const express = require('express');
const axios = require('axios').default;
const { Telegraf } = require('telegraf');
const User = require('./models/user.model');
const { linkedinPost } = require('./gpt');


//Confi .env
require('dotenv').config();

//Config de la BD
require('./db');

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

//MIDDLEWARE
bot.use(async (ctx, next) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });

    if (!user) {
        ctx.from.telegram_id = ctx.from.id;
        await User.create(ctx.from);
    }
    next();

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

bot.command('mensaje', async () => {
    //mensaje Hola amigui
    const mensaje = ctx.message.text.split('/mensaje')[1];

    const users = await User.find();
    const user = users[Math.floor(Math.random() * users.length)];

    try {
        await bot.telegram.sendMessage(user.telegram_id, mensaje);
        await ctx.reply(`Mensaje enviado a ${user.first_name}`);
    } catch (error) {
        ctx.reply('Usa bien el comando')
    }
});

bot.command('linkedin', async (ctx) => {
    //Linkedin: como usar javascript en el servidor
    const idea = ctx.message.text.split('/linkedin')[1];

    const content = await linkedinPost(idea);
    ctx.reply(content);
});


//Poner a escuchar en un puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuando en puerto ${PORT}`);
});