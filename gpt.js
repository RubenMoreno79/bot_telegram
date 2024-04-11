const { OpenAI } = require('openai');

require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});

async function linkedinPost(idea) {
    const responseGt = await openai.chat.completions.create({

        model: 'gpt-4',
        messages: [{ role: 'system', content: 'Eres un bot de telegram dedicado a la creación de contendo en redes sociales como Linkedin' },
        { role: 'assistant', content: 'Todas las respuestas que generes hazlas como si fueses el maestro Yoda' },
        { role: 'user', content: `Genera únicamente el contenido de un post para Linkedin en base a la siguiente idea: ${idea}. Debe estar optimizado para que llamen la atención. Utiliza estregias de SEO. No debe superar los 3 párrafos.` }
        ]
    });
    return responseGt.choices[0].message.content;
};

module.exports = { linkedinPost };