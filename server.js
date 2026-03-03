/**
 * Web Page Evaluation Engine - Express Server
 * Provides REST API and serves frontend interface
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluatePages } from './src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for temporary pages
const tempPages = new Map();
let pageCounter = 0;

/**
 * POST /api/create-page
 * Create a temporary page from HTML code
 */
app.post('/api/create-page', (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    const pageId = `temp_${++pageCounter}_${Date.now()}`;
    const pageUrl = `http://localhost:${PORT}/temp/${pageId}`;

    // Store the code
    tempPages.set(pageId, code);

    console.log(`✅ Page created: ${pageId}`);

    res.json({
      success: true,
      pageId,
      pageUrl,
      message: 'Temporary page created successfully',
    });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /temp/:pageId
 * Serve temporary page
 */
app.get('/temp/:pageId', (req, res) => {
  const { pageId } = req.params;
  const code = tempPages.get(pageId);

  if (!code) {
    return res.status(404).html('<h1>Page not found</h1>');
  }

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(code);
});

/**
 * POST /api/evaluate
 * Evaluate two pages
 */
app.post('/api/evaluate', async (req, res) => {
  try {
    const { expectedUrl, studentCode } = req.body;

    if (!expectedUrl || !studentCode) {
      return res.status(400).json({
        error: 'Both expectedUrl and studentCode are required',
      });
    }

    console.log(`\n🔄 Starting evaluation...`);
    console.log(`  Expected: ${expectedUrl}`);

    // Create temporary page for student code
    const pageId = `temp_${++pageCounter}_${Date.now()}`;
    const studentUrl = `http://localhost:${PORT}/temp/${pageId}`;
    tempPages.set(pageId, studentCode);

    console.log(`  Student: ${studentUrl}`);

    // Run evaluation
    const result = await evaluatePages(expectedUrl, studentUrl);

    console.log(`✅ Evaluation complete!\n`);

    res.json({
      success: true,
      result,
      studentPageId: pageId,
    });
  } catch (error) {
    console.error('❌ Evaluation error:', error);
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Web Page Evaluation Engine is running',
    version: '1.0.0',
  });
});

/**
 * Serve index.html for root path
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Middleware error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🚀 Web Page Evaluation Engine - Frontend Server');
  console.log(`${'='.repeat(60)}`);
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`📝 Open in browser to start evaluating pages`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  POST /api/create-page - Create temporary page`);
  console.log(`  POST /api/evaluate - Evaluate pages`);
  console.log(`  GET /api/health - Health check`);
  console.log(`\n${'='.repeat(60)}\n`);
});

export default app;
