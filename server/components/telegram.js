const TelegramBot = require('node-telegram-bot-api')
class Telegram {
    constructor(){
        this.token = '5009717286:AAFVoLJ94rx4BdiVLmTRnqZyiY-IYYAYJEU'
    }
    send(text) {
        const bot = new TelegramBot(this.token, {polling: true})
        const chatId = '-1001580214885'
        bot.sendMessage(chatId, text, {parse_mode: 'HTML'})
        return true
    }
}
module.exports = new Telegram()