import { IncomingMessage, ServerResponse } from 'http';
import { assistNoteWithAI, generateStickerWithAI } from './geminiService';

export function handleApiRequests(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = req.url?.split('?')[0];

  if ((url === '/api/ai/assist-note' || url === '/api/ai/improve-note') && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const result = await assistNoteWithAI({
          originalNote: payload.originalNote || payload.message || '',
          mood: payload.mood || payload.tone || 'joyful',
          action: payload.action || 'rewrite',
          recipient: payload.recipient || '',
          sender: payload.sender || '',
          occasion: payload.occasion || '',
          language: payload.language || 'English',
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      } catch (err: any) {
        console.error('API Error assistNote:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message || 'Server error' }));
      }
    });
    return;
  }

  if (url === '/api/ai/generate-sticker' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const prompt = payload.prompt || '';
        const sticker = await generateStickerWithAI({ prompt });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(sticker));
      } catch (err: any) {
        console.error('API Error generateSticker:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message || 'Server error' }));
      }
    });
    return;
  }

  next();
}

