import { bot } from '../bot'
import { Tariffs } from '../data'
import { UserService } from '../services/user.service'
import { accountCallbacks } from './account.callbacks'

export const setCallbacks = () => {
	bot.on('callback_query', async (msg) => {
		const data = msg.data
		if (!msg.message) return
		if (!data) return

		const chatId = msg.message.chat.id
		const user = await UserService.getByChatIdOrCreate(chatId)

		const splittedText = data.split('/')

		const callback = splittedText[0]
		const dynamicParameter = splittedText[1]

		switch (callback) {
			case 'Добавить аккаунт':
				return accountCallbacks.addAccount(chatId)

			case 'Аккаунт':
				return accountCallbacks.getAccount(chatId, dynamicParameter)

			case 'Имя аккаунта':
				return accountCallbacks.updateName(chatId, dynamicParameter)

			case 'Ключ статистики':
				return accountCallbacks.updateStatisticKey(chatId, dynamicParameter)

			case 'Выбрать тариф':
				return accountCallbacks.chooseTariff(chatId, dynamicParameter)

			case 'Стандартный ключ':
				return accountCallbacks.updateCommonKey(chatId, dynamicParameter)

			case 'Подписка':
				return accountCallbacks.toggleSubscription(
					chatId,
					dynamicParameter,
					user
				)

			case 'Удалить аккаунт':
				return accountCallbacks.deleteAccount(chatId, dynamicParameter, user)

			case 'Вернуться в профиль':
				return accountCallbacks.backToProfile(chatId, user)
		}

		for (let i = 0; i < Tariffs.length; i++) {
			if (callback === Tariffs[i].name) {
				return accountCallbacks.confirmTariff(
					chatId,
					dynamicParameter,
					Tariffs[i].name
				)
			}
		}
	})
}
