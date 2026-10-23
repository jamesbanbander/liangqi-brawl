const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = Number(process.env.PORT || 8080);
const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const file = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  if (file !== 'index.html') { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) { res.writeHead(500); return res.end('Could not load game'); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(data);
  });
});
const wss = new WebSocket.Server({ server, path: '/ws' });
const rooms = new Map();
function send(ws, msg) { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg)); }
function leave(ws) {
  if (!ws.room) return;
  const room = rooms.get(ws.room);
  if (room) {
    room.delete(ws);
    for (const peer of room) send(peer, { type: 'peer-left' });
    if (!room.size) rooms.delete(ws.room);
  }
  ws.room = null;
}
wss.on('connection', ws => {
  ws.on('message', raw => {
    let msg; try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (msg.type === 'join') {
      const roomName = String(msg.room || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12);
      if (!roomName) return send(ws, { type: 'error', message: 'Invalid room code' });
      leave(ws);
      let room = rooms.get(roomName);
      if (!room) { room = new Set(); rooms.set(roomName, room); }
      if (room.size >= 2) return send(ws, { type: 'error', message: '房間已滿，請換一個房間代碼' });
      room.add(ws); ws.room = roomName; ws.role = room.size;
      send(ws, { type: 'joined', room: roomName, role: ws.role });
      if (room.size === 2) for (const peer of room) send(peer, { type: 'ready', room: roomName });
      return;
    }
    if (msg.type === 'input' && ws.room) {
      const room = rooms.get(ws.room);
      if (!room) return;
      const allowed = ws.role === 1 ? ['a','d','w','f','g'] : ['arrowleft','arrowright','arrowup','enter','shift'];
      const key = String(msg.key || '').toLowerCase();
      if (!allowed.includes(key)) return;
      for (const peer of room) if (peer !== ws) send(peer, { type: 'input', key, down: !!msg.down });
    }
  });
  ws.on('close', () => leave(ws));
  ws.on('error', () => leave(ws));
});
server.listen(PORT, '0.0.0.0', () => console.log(`兩棲大亂鬥線上伺服器：http://localhost:${PORT}`));
