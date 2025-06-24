
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = './sorvetes.json';

function lerDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function salvarDB(dados) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
}

app.get('/sabores', (req, res) => res.json(lerDB()));

app.post('/sabores', (req, res) => {
  const db = lerDB();
  const novo = { id: Date.now(), ...req.body };
  db.push(novo);
  salvarDB(db);
  res.status(201).json(novo);
});

app.put('/sabores/:id', (req, res) => {
  let db = lerDB();
  const id = parseInt(req.params.id);
  db = db.map(s => s.id === id ? { ...s, ...req.body } : s);
  salvarDB(db);
  res.json({ ok: true });
});

app.delete('/sabores/:id', (req, res) => {
  let db = lerDB();
  const id = parseInt(req.params.id);
  db = db.filter(s => s.id !== id);
  salvarDB(db);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
