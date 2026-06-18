/*
 * @Author: wangqz
 * @Date: 2026-06-18
 * @LastEditTime: 2026-06-18
 * @Description: content
 */
import express from 'express';
import { chromium } from 'playwright';
import pLimit from 'p-limit';
import { v4 as uuidv4 } from 'uuid'; // 可选，用于日志追踪

const app = express();
app.use(express.json({ limit: '10mb' })); // 限制请求体大小，防止恶意超大HTML

// ---------- 配置 ----------
const CONFIG = {
  port: process.env.PORT || 9001,
  maxConcurrent: 5,                // 最大并发请求数
  pageTimeout: 30000,             // 页面加载超时 (ms)
  pdfTimeout: 60000,              // PDF生成超时 (ms)
  maxHtmlSize: 5 * 1024 * 1024,   // 限制HTML大小 5MB
};

// ---------- 浏览器全局单例 ----------
let browserInstance = null;
let browserPromise = null;

async function getBrowser() {
  if (browserInstance) return browserInstance;
  if (browserPromise) return browserPromise;

  browserPromise = (async () => {
    console.log('🚀 Launching Chromium...');
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',      // 避免 /dev/shm 不足
        '--no-sandbox',                // 容器环境可能需要（注意安全）
        '--disable-setuid-sandbox',
        '--disable-gpu',               // 服务器无GPU
        '--disable-software-rasterizer',
      ],
    });
    browserInstance = browser;
    console.log('✅ Chromium launched.');
    return browser;
  })();
  return browserPromise;
}

// ---------- 并发限制器 ----------
const limit = pLimit(CONFIG.maxConcurrent);

// ---------- 核心转换函数 ----------
async function htmlToPdf(htmlString, options = {}) {
  const browser = await getBrowser();

  // 每个请求使用独立的上下文（Incognito），隔离缓存/Cookie
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    // 设置超时
    page.setDefaultTimeout(CONFIG.pageTimeout);

    // 设置内容（使用 baseURL 避免相对路径资源加载，这里禁用加载外部资源以提高安全性和性能）
    await page.setContent(htmlString, {
      waitUntil: 'networkidle',        // 等待所有网络请求完成（可能会慢，可改为 'domcontentloaded'）
      timeout: CONFIG.pageTimeout,
    });

    // 模拟打印媒体
    await page.emulateMedia({ media: 'print' });

    // 生成 PDF
    const pdfBuffer = await page.pdf({
      format: options.format || 'A4',
      printBackground: options.printBackground !== undefined ? options.printBackground : true,
      margin: options.margin || { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      // 可以增加其他选项如 landscape, pageRanges 等
    });

    return pdfBuffer;
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    // 关闭页面和上下文，释放资源
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

// ---------- 路由 ----------
app.post('/html2pdf', async (req, res) => {
  const requestId = uuidv4().slice(0, 8);
  console.log(`[${requestId}] Received request`);

  try {
    const { html, format, printBackground, margin } = req.body;

    // 1. 校验参数
    if (!html) {
      return res.status(400).json({ error: 'Missing "html" field' });
    }
    if (typeof html !== 'string') {
      return res.status(400).json({ error: '"html" must be a string' });
    }
    if (Buffer.byteLength(html, 'utf8') > CONFIG.maxHtmlSize) {
      return res.status(413).json({ error: `HTML size exceeds limit (${CONFIG.maxHtmlSize} bytes)` });
    }

    // 2. 并发控制：使用 p-limit 包装
    const pdfBuffer = await limit(async () => {
      console.log(`[${requestId}] Processing (concurrency: ${limit.activeCount}/${limit.concurrency})`);
      return await htmlToPdf(html, { format, printBackground, margin });
    });

    // 3. 返回 PDF 流
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

    console.log(`[${requestId}] Success (${pdfBuffer.length} bytes)`);
  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    // 区分客户端错误和服务端错误
    if (error.message.includes('Timeout')) {
      return res.status(504).json({ error: 'Conversion timeout' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- 健康检查 ----------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', browser: !!browserInstance });
});

// ---------- 优雅关闭 ----------
async function shutdown() {
  console.log('Shutting down...');
  if (browserInstance) {
    await browserInstance.close();
    console.log('Browser closed.');
  }
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// ---------- 启动服务 ----------
app.listen(CONFIG.port, () => {
  console.log(`✅ Server listening on port ${CONFIG.port}`);
  console.log(`   Max concurrent conversions: ${CONFIG.maxConcurrent}`);
  // 预启动浏览器
  getBrowser().catch(err => console.error('Pre-launch browser failed:', err));
});