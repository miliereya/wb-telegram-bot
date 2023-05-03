import TelegramBot from 'node-telegram-bot-api'
import { setCallbacks } from './callbacks'
import { setCommands } from './commands'
import { mongoConnect } from './config/mongo.config'
// import { sendNewNotifications } from './features/order-notifications.features'
import { setMessages } from './messages'

const dotenv = require('dotenv')
dotenv.config()

const telegramApi = require('node-telegram-bot-api')

export const bot: TelegramBot = new telegramApi(process.env.TOKEN, {
	polling: true,
})

interface StartOptions {
	sendNotifications?: boolean
}

const start = (options?: StartOptions) => {
	mongoConnect()

	// Order notifications
	// if (options) {
	// 	options.sendNotifications &&
	// 		setInterval(() => sendNewNotifications(), 10000)
	// }

	setCommands()
	setCallbacks()
	setMessages()
}

start({ sendNotifications: true })
