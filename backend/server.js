
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Usando variável em memória para o Vercel
let DB = [];

app.get('/api/sabores', (req, res) => res.json(DB));

app.post('/api/sabores', (req, res) => {
  const novo = { id: Date.now(), ...req.body };
  DB.push(novo);
  res.status(201).json(novo);
});

app.put('/api/sabores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  DB = DB.map(s => s.id === id ? { ...s, ...req.body } : s);
  res.json({ ok: true });
});

app.delete('/api/sabores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  DB = DB.filter(s => s.id !== id);
  res.json({ ok: true });
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}

// Para o Vercel
module.exports = app;
