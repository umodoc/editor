We use bun as package manager for node and uv as package manager for python.

## Minimum Necessary Testing Setup

### Backend Setup (Python FastAPI)

1. Install requirements:
```bash
pip install fastapi uvicorn python-multipart python-docx
```

2. Create `main.py`:
```python
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from docx import Document
import os

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_docx(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    return {"filename": file.filename, "url": f"/static/{file.filename}"}

@app.get("/documents")
async def list_documents():
    return {"files": os.listdir(UPLOAD_DIR)}

@app.get("/load/{filename}")
async def load_docx(filename: str):
    file_path = f"{UPLOAD_DIR}/{filename}"
    if not os.path.exists(file_path):
       return {"error": "File not found"}
    try:
       doc = Document(file_path)
       text = "\n".join([para.text for para in doc.paragraphs])
       return {"filename": filename, "content": text}
    except Exception as e:
       return {"error": str(e)}
```

3. Run backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Create `static/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="/path/to/umo-editor.umd.js"></script>
</head>
<body>
    <div id="app">
        <umo-editor 
            ref="umoEditor"
            :on-save="handleSave"
            :on-file-upload="handleFileUpload"
            file-extensions="docx"
        ></umo-editor>
        <button @click="handleLoad('document.docx')">Load Document</button>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            methods: {
                async handleSave(content) {
                    const blob = new Blob([content], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                    const file = new File([blob], 'document.docx');
                    await this.handleFileUpload(file);
                },

                async handleFileUpload(file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('http://localhost:8000/upload', {
                        method: 'POST',
                        body: formData
                    });

                    return response.json();
                },

                async handleLoad(filename) {
                    const response = await fetch(`http://localhost:8000/load/${filename}`);
                    const data = await response.json();
                    if (data.content) {
                         // Assume the editor component provides a method to set content
                         this.$refs.umoEditor.setContent(data.content);
                    } else {
                         console.error('Failed to load document:', data.error);
                    }
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

### Testing Workflow

1. Start backend server:
```bash
uvicorn main:app --reload
```

2. Open frontend in browser:
```
http://localhost:8000/static/index.html
```

3. Test document operations:
- Upload DOCX via toolbar upload button
- Edit document content
- Save as DOCX (auto-uploads to backend)
- Load document using Load Document button
- Verify files in `uploads/` directory

### Requirements

- Python 3.8+
- Node.js 16+
- Modern web browser
