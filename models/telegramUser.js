const mongoose = require('mongoose')

const telegramUserSchema = new mongoose.Schema({
    chatId: {
        type:Number,
        unique:true
    }
})

const TelegramUser = mongoose.model("TelegramUser",telegramUserSchema)
module.exports = TelegramUser