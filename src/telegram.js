const TelegramBot = require('node-telegram-bot-api')
const TelegramUser = require('../models/telegramUser')
// Setting up Telegrsm bot
const token = '1666702592:AAHmNCgV9SkbZfkSMJL30RLmecVHsCxQ2Ho'
const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/register/, (msg, match) => {
    const chatId = msg.chat.id
  //   bot.sendMessage(chatId, 'Done.')  
  sendRegisterDone(chatId)
    Savechatid(chatId)
})
const Savechatid = async(chatId) => {
	const telegramUser = new TelegramUser({chatId: chatId})
	try {
		await telegramUser.save();
		return
	} catch (error) {
		return 
	}
}
const sendRegisterDone = (chatId) => {
    bot.sendMessage(chatId, 'Done.')
}

const sendErrorMessage = (chatId, message) => {
    bot.sendMessage(chatId, message)
}

module.exports = {
    sendRegisterDone,
    sendErrorMessage
}