const express = require('express');
const axios = require('axios').default;
const { Telegraf } = require('telegraf');

//Confi .env
require('dotenv').config();


//Creamos app de Express
const app = express();

//Crear el bot de telegram
const bot = new Telegraf(process.env.BOT_TOKEN);

//Config conexión con telegram
app.use(bot.webhookCallback('/telegram-bot'));
//URL pública
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`);

//Necesito una ruta para enganchar con Telegram
app.post('/telegram-bot', (req, res) => {
    res.send('Responde');
});

//Crear los comandos del bot
bot.command('prueba', async ctx => {
    await ctx.reply('funsiona!!');
    await ctx.replyWithDice();
    ctx.replyWithMarkdownV2('*hola hermosura* _hola guapo_')

});

bot.command('tiempo', async ctx => {
    const ciudad = ctx.message.text.slice(8);

    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OPM_API_KEY}&units=metric`)
        ctx.reply('Holi')
        ctx.replyWithHTML(`<b>Tiempo en ${ciudad.toLocaleUpperCase()}</b>
🌡 Temperatura ${data.main.temp}ºC
❄ Mínima ${data.main.temp_min}ºC
🥵 Máxima ${data.main.temp_max}ºC
💧 Humedad ${data.main.humidity}%`);
        ctx.replyWithLocation(data.coord.lat, data.coord.lon);
    } catch (error) {
        ctx.reply(`No disponemos de datos para la ciudad ${ciudad}`)
    };
});


//Poner a escuchar en un puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuando en puerto ${PORT}`);
});