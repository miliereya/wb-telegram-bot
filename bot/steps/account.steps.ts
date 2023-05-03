import { bot } from '../bot'
import { Options } from '../options'
import { AccountService } from '../services/account.service'
import { NotificationService } from '../services/notification.service'
import { UserService } from '../services/user.service'
import { AccountTemplate } from '../templates/account.template'
import { ProfileTemplate } from '../templates/profile.template'

export const AccountSteps = async (
	secondaryRoute: string,
	dynamicParam: string,
	text: string,
	chatId: number
) => {
	switch (secondaryRoute) {
		case 'Обновить имя':
			try {
				if (text.length > 15) throw 'Error'

				const account = await AccountService.updateOne(
					dynamicParam,
					text,
					'name'
				)
				await UserService.setCurrentStep(chatId, '')
				return bot.sendMessage(
					chatId,
					AccountTemplate(account),
					Options.account(account)
				)
			} catch (e: any) {
				return bot.sendMessage(chatId, 'Максимальная длина имени - 15 символов')
			}

		case 'Обновить ключ статистики':
			try {
				if (!/^[a-zA-Z.-_-]+$/.test(text)) throw 'Error'

				await NotificationService.getOrders(text, '2023-02-21')

				const account = await AccountService.updateOne(
					dynamicParam,
					text,
					'statistics_key'
				)

				await UserService.setCurrentStep(chatId, '')
				return bot.sendMessage(
					chatId,
					AccountTemplate(account),
					Options.account(account)
				)
			} catch (e: any) {
				return bot.sendMessage(chatId, 'Невалидный ключ статистики')
			}

		case 'Обновить стандартный ключ':
			try {
				if (!/^[a-zA-Z.-_-]+$/.test(text)) throw 'Error'

				await NotificationService.getPrices(text)

				const account = await AccountService.updateOne(
					dynamicParam,
					text,
					'common_key'
				)

				await UserService.setCurrentStep(chatId, '')
				return bot.sendMessage(
					chatId,
					AccountTemplate(account),
					Options.account(account)
				)
			} catch (e: any) {
				return bot.sendMessage(chatId, 'Невалидный стандартный ключ')
			}

		case 'Удалить аккаунт':
			await AccountService.delete(dynamicParam)
			const accounts = await AccountService.getManyByChatId(chatId)
			const user = await UserService.getByChatIdOrCreate(chatId)

			return await bot.sendMessage(
				chatId,
				ProfileTemplate(user),
				Options.accounts(accounts)
			)

		default:
			bot.sendMessage(chatId, 'Попробуйте /start')
	}
}
