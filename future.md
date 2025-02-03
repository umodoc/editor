```python
from fastapi import Request
from fastapi.middleware import Middleware
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/v1/assist":
        return await limiter.limit("10/minute")(call_next)(request)
    return await call_next(request)
# ai_service.py
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import openai

router = APIRouter()

class AIRequest(BaseModel):
    prompt: str
    max_tokens: int = 500
    temperature: float = 0.7

@router.post("/v1/assist")
async def process_assistance(request: AIRequest):
    try:
        response = openai.ChatCompletion.create(
            engine="gpt-4",
            messages=[{"role": "user", "content": request.prompt}],
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            api_key=os.getenv("AI_API_KEY")
        )
        return JSONResponse({
            "content": response.choices[0].message.content,
            "usage": response.usage
        })
    except openai.error.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid AI API credentials")
    except openai.error.RateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limit exceeded")
# document_storage.py
from clickhouse_driver import Client as ClickhouseClient
from typing import Optional, Dict, Any

class DocumentStorage:
    def __init__(self):
        self.client = ClickhouseClient(
            host=CLICKHOUSE_HOST,
            port=CLICKHOUSE_PORT,
            user=CLICKHOUSE_USER,
            password=CLICKHOUSE_PASSWORD,
            database=CLICKHOUSE_DATABASE,
            secure=CLICKHOUSE_SSL
        )
        
        self.client.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                doc_id UUID,
                user_id String,
                content String,
                version UInt32,
                created_at DateTime DEFAULT now(),
                updated_at DateTime DEFAULT now()
            ) ENGINE = MergeTree()
            ORDER BY (user_id, doc_id)
        ''')

    async def save_document(self, doc_id: str, content: str, user_id: str) -> None:
        self.client.execute(
            '''INSERT INTO documents (doc_id, user_id, content, version)
            VALUES (%(doc_id)s, %(user_id)s, %(content)s, 1)''',
            {'doc_id': doc_id, 'user_id': user_id, 'content': content}
        )

    async def load_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        result = self.client.execute(
            '''SELECT content, version FROM documents
            WHERE doc_id = %(doc_id)s
            ORDER BY version DESC LIMIT 1''',
            {'doc_id': doc_id}
        )
        return {'content': result[0][0], 'version': result[0][1]} if result else None
  ## 5.5 Backend Service Configuration (ClickHouse Edition)
  
  ### Environment Configuration (.env)
  ```ini
  # Required for ClickHouse integration
  CLICKHOUSE_HOST=clickhouse-prod.example.com
  CLICKHOUSE_PORT=9440
  CLICKHOUSE_USER=umo_service
  CLICKHOUSE_PASSWORD=${SECURE_DB_PASSWORD}
  CLICKHOUSE_DATABASE=umodoc
  CLICKHOUSE_SSL=true
  
  # AI Service Configuration
  AI_ENDPOINT=https://api.openai.com/v1/chat/completions
  AI_API_KEY=${SECURE_AI_KEY}


```

## 12. Docker Image CI

This section describes how to build and push a Docker image for this project using GitHub Actions, and how to run it using Docker Compose.

### GitHub Actions Workflow

Below is an example GitHub Actions workflow configuration that builds and pushes your Docker image to GitHub Container Registry:

```yaml
name: Docker Image CI

on:
  push:
    branches: [ "main" ]
    tags: [ 'v*.*.*' ]
  pull_request:
    branches: [ "main" ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v5

      - name: "Set up Python"
        uses: actions/setup-python@v5
        with:
          python-version-file: "pyproject.toml"

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Dockerfile

The following Dockerfile is used to build the image:

```dockerfile
# Use uv pre-installed image
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# Install the project into `/app`
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    curl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Then, add the rest of the project source code and install it
ADD . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Create non-root user and set up directories
RUN useradd -m -u 1000 cicero && \
    mkdir -p /app/logs /app/downloads && \
    chown -R cicero:cicero /app && \
    chmod +x /app/start.sh

# Switch to non-root user
USER cicero

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Run start.sh which handles environment setup and waits for PostgreSQL
CMD ["/app/start.sh"]