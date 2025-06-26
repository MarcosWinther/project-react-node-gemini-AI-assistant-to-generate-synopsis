// 1. Importar os pacotes necessários
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. Inicializar o Express e configurar middlewares
const app = express();
app.use(cors()); // Permite requisições de outras origens (nosso frontend React)
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições

// 3. Inicializar o cliente da API do Gemini
// A chave da API é pega de forma segura das variáveis de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 4. Definir a rota da nossa API
app.post('/api/gerar-sinopse', async (req, res) => {
  try {
    // Pega as palavras-chave do corpo da requisição enviada pelo frontend
    const { keywords } = req.body;

    if (!keywords) {
      return res.status(400).json({ error: 'Palavras-chave são obrigatórias.' });
    }

    // --- CORREÇÃO APLICADA AQUI ---
    // Seleciona o modelo do Gemini atualizado e estável
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    // Cria um prompt otimizado para a tarefa
    const prompt = `Você é um assistente criativo especializado em literatura. Sua tarefa é criar uma sinopse de livro curta e envolvente com base nas seguintes palavras-chave: '${keywords}'. A sinopse deve ser cativante, despertar a curiosidade do leitor e ser adequada para a contracapa de um livro. Não inclua as palavras-chave literalmente, mas use-as como inspiração para o tema, o enredo e a atmosfera.`;

    // Chama a API para gerar o conteúdo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Envia a sinopse gerada de volta para o frontend
    res.json({ sinopse: text });

  } catch (error) {
    // Aprimorando o log de erro para ser mais detalhado no console do servidor
    console.error("Erro ao gerar sinopse:", error);
    res.status(500).json({ error: 'Falha ao se comunicar com a IA.' });
  }
});

// 5. Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});