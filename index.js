const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // A Alexa sempre envia um POST. Se alguém tentar acessar via navegador (GET), damos um erro amigável.
  if (req.method !== 'POST') {
    return res.status(200).send("Servidor do Jarvis está online! (Use a Alexa para interagir)");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Captura a pergunta da Alexa
    const userQuery = req.body.request.intent.slots.pergunta.value || "Olá";

    const result = await model.generateContent(userQuery);
    const response = await result.response;
    const answer = response.text();

    // Formato exato que a Alexa exige
    res.status(200).json({
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
    console.error("Erro:", error);
    res.status(200).json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Desculpe, tive um problema ao falar com o Gemini."
        }
      }
    });
  }
};
