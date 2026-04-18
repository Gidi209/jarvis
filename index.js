const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

// 1. Configure sua API Key (Use variáveis de ambiente!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/alexa', async (req, res) => {
  try {
    // Captura a pergunta enviada pela Skill da Alexa
    const userQuery = req.body.request.intent.slots.pergunta.value || "Olá, em que posso ajudar?";

    // Envia para o Gemini
    const result = await model.generateContent(userQuery);
    const response = await result.response;
    const answer = response.text();

    // Resposta formatada para o padrão da Alexa
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: answer
        },
        shouldEndSession: true
      }
    });
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: { type: "PlainText", text: "Houve um erro ao processar sua pergunta." }
      }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));