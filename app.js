const express = require('express');
const path = require('path');
const cors = require('cors'); // Você precisa instalar: npm install cors

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors());

// Middleware para processar JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Outras rotas
app.get('/cozinha', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cozinha.html'));
});

app.get('/entregue', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'entregue.html'));
});

app.get('/motoboy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'motoboy.html'));
});

// Nova rota para a página de adicionar produto
app.get('/addProduct', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adicionarProdutos.html'));
});

// Rota de API para adicionar produto (simulação)
app.post('/api/produtos', (req, res) => {
  console.log('Produto recebido:', req.body);
  // Aqui você normalmente salvaria no banco de dados
  res.status(201).json({ message: 'Produto adicionado com sucesso', produto: req.body });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});