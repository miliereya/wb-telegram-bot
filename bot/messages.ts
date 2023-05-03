import { bot } from './bot'
import { unexpectedError } from './errors/bot.errors'
import { Options } from './options'
import { AccountService } from './services/account.service'
import { StatisticsService } from './services/statistics.service'
import { UserService } from './services/user.service'
import { AccountSteps } from './steps/account.steps'
import { HistoryTemplate } from './templates/history.template'
import { ProfileTemplate } from './templates/profile.template'
import { formatDate } from './utils/date'

export const setMessages = () => {
	bot.on('message', async (msg) => {
		const text = msg.text
		const chatId = msg.chat.id

		if (!text || !chatId) throw ''

		try {
			const user = await UserService.getByChatIdOrCreate(chatId)

			if (text === '/start') {
				return await bot.sendMessage(chatId, 'Описание бота')
			}

			if (text === '/services') {
				return await bot.sendMessage(
					chatId,
					'Описание всех тарифов...',
					Options.buy_tariff
				)
			}

			if (text === '/profile') {
				const accounts = await AccountService.getManyByChatId(chatId)
				return await bot.sendMessage(
					chatId,
					ProfileTemplate(user),
					Options.accounts(accounts)
				)
			}

			if (text === '/history') {
				return await bot.sendMessage(chatId, HistoryTemplate(user))
			}

			if (text === '/reports') {
				const accounts = await AccountService.getManyByChatId(chatId)
				for (let i = 0; i < accounts.length; i++) {
					const account = accounts[i]
					if (account.subscription === 'Активна') {
						const sales = await StatisticsService.getSalesReports(
							account.statistics_key,
							formatDate(new Date().setMonth(new Date().getMonth() - 1), true)
						)
					}
				}
			}

			const step = user.currentStep

			if (!step) return

			const splittedText = step.split('/')

			const mainRoute = splittedText[0]
			const secondaryRoute = splittedText[1]
			const dynamicParameter = splittedText[2]

			switch (mainRoute) {
				case 'Аккаунт':
					AccountSteps(secondaryRoute, dynamicParameter, text, chatId)
					break

				default:
					bot.sendMessage(chatId, 'Попробуйте /start')
			}
		} catch (e) {
			return unexpectedError(chatId)
		}
	})
}
