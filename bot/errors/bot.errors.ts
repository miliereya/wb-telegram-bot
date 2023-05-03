import { bot } from '../bot'

export const unexpectedError = (chatId: number | string) =>
	bot.sendMessage(chatId, 'Непредвиденная ошибка')
