import dayjs from 'dayjs'
import { bot } from '../bot'
import { Tariffs } from '../data'
import { Options } from '../options'
import { AccountService } from '../services/account.service'
import { UserService } from '../services/user.service'
import { AccountTemplate } from '../templates/account.template'
import { ProfileTemplate } from '../templates/profile.template'
import { TariffTemplate } from '../templates/tariff.template'
import { ITransaction, IUser } from '../types/user.types'
import { formatDate } from '../utils/date'

export const accountCallbacks = {
	async addAccount(chatId: number) {
		const newAccountId = await AccountService.create(chatId)
		const chosenAccount = await AccountService.getById(newAccountId)
		bot.sendMessage(
			chatId,
			AccountTemplate(chosenAccount),
			Options.account(chosenAccount)
		)
	},

	async getAccount(chatId: number, accountId: string) {
		const chosenAccount = await AccountService.getById(accountId)
		bot.sendMessage(
			chatId,
			AccountTemplate(chosenAccount),
			Options.account(chosenAccount)
		)
	},

	async chooseTariff(chatId: number, accountId: string) {
		await UserService.setCurrentStep(
			chatId,
			`Аккаунт/Выбрать тариф/${accountId}`
		)
		bot.sendMessage(chatId, TariffTemplate(), Options.tariffs(accountId))
	},

	async confirmTariff(chatId: number, accountId: string, tariff: string) {
		let account = await AccountService.updateOne(accountId, tariff, 'tariff')

		if (account.subscription === 'Активна') {
			await AccountService.deactivateSubscription(account._id)
			account = await AccountService.getById(account._id)
			bot.sendMessage(chatId, '⚠️ Подписка была отменена')
		}

		await UserService.setCurrentStep(chatId, '')
		return bot.sendMessage(
			chatId,
			AccountTemplate(account),
			Options.account(account)
		)
	},

	async updateName(chatId: number, accountId: string) {
		await UserService.setCurrentStep(
			chatId,
			`Аккаунт/Обновить имя/${accountId}`
		)
		bot.sendMessage(chatId, 'Напишите имя')
	},

	async updateStatisticKey(chatId: number, accountId: string) {
		await UserService.setCurrentStep(
			chatId,
			`Аккаунт/Обновить ключ статистики/${accountId}`
		)
		bot.sendMessage(chatId, 'Отправьте ключ статистики')
	},

	async updateCommonKey(chatId: number, accountId: string) {
		await UserService.setCurrentStep(
			chatId,
			`Аккаунт/Обновить стандартный ключ/${accountId}`
		)
		bot.sendMessage(chatId, 'Отправьте стандартный ключ')
	},

	async toggleSubscription(chatId: number, accountId: string, user: IUser) {
		let errors: string[] = []
		const account = await AccountService.getById(accountId)
		const tariff = Tariffs.find((t) => t.name === account.tariff)

		if (!account.name) errors.push('Укажите имя')
		if (!account.common_key) errors.push('Укажите стандартный ключ')
		if (!account.statistics_key) errors.push('Укажите ключ статистики')
		if (!tariff) errors.push('Выберите тариф')

		if (errors.length) {
			for (let i = 0; i < errors.length; i++) {
				bot.sendMessage(chatId, errors[i])
			}
			return
		}

		if (!tariff) return

		const nowDate = new Date()

		if (account.subscription === 'Не активна') {
			if (!user.isFreePeriodUsed) {
				const dateTo = nowDate.setHours(nowDate.getHours() + 72)
				await UserService.updateTestPeriod(chatId, dateTo)
				const updatedAccount = await AccountService.activateSubscription(
					accountId,
					dateTo
				)
				bot.sendMessage(
					chatId,
					`⚠️ Вам доступен бесплатный период до ${formatDate(dateTo)}`
				)
				return bot.sendMessage(
					chatId,
					AccountTemplate(updatedAccount),
					Options.account(updatedAccount)
				)
			}

			if (
				user.endOfFreePeriodDate &&
				nowDate.getTime() < user.endOfFreePeriodDate.getTime()
			) {
				const updatedAccount = await AccountService.activateSubscription(
					accountId,
					nowDate.setMonth(nowDate.getMonth() + 1)
				)
				return bot.sendMessage(
					chatId,
					AccountTemplate(updatedAccount),
					Options.account(updatedAccount)
				)
			}
			if (user.balance >= tariff.price) {
				const transaction: ITransaction = {
					title: `👤 ${account.name}: Списание за подписку (Тариф: ${tariff.name})`,
					date: nowDate,
					action: `- ${tariff.price}`,
				}
				await UserService.setBalance(
					chatId,
					user.balance - tariff.price,
					transaction
				)
				const updatedAccount = await AccountService.activateSubscription(
					accountId,
					nowDate.setMonth(nowDate.getMonth() + 1)
				)
				bot.sendMessage(
					chatId,
					`⚠️ Списание с баланса - ${tariff.price} руб.\nВаш баланс: ${
						user.balance - tariff.price
					} руб.`
				)
				return bot.sendMessage(
					chatId,
					AccountTemplate(updatedAccount),
					Options.account(updatedAccount)
				)
			} else {
				return bot.sendMessage(chatId, 'Недостаточно средств на балансе')
			}
		} else if (account.subscription === 'Активна') {
			const updatedAccount = await AccountService.deactivateSubscription(
				accountId
			)

			if (user.endOfFreePeriodDate < nowDate) {
				const notUsedDays =
					dayjs(account.tariffRenewDate).diff(dayjs(nowDate)) /
					1000 /
					60 /
					60 /
					24
				const returnAmount = Math.floor((tariff.price / 30) * (notUsedDays + 1))
				const transaction: ITransaction = {
					title: `👤 ${account.name}: Возврат за отмену подписки (Тариф: ${tariff.name})`,
					date: nowDate,
					action: `+ ${returnAmount}`,
				}

				await UserService.setBalance(
					chatId,
					user.balance + returnAmount,
					transaction
				)
				bot.sendMessage(
					chatId,
					AccountTemplate(updatedAccount),
					Options.account(updatedAccount)
				)
				return bot.sendMessage(
					chatId,
					`⚠️ Зачисление на баланс + ${returnAmount} руб.\nВаш баланс: ${
						user.balance + returnAmount
					} руб.`
				)
			}

			return bot.sendMessage(
				chatId,
				AccountTemplate(updatedAccount),
				Options.account(updatedAccount)
			)
		}
	},

	async deleteAccount(chatId: number, accountId: string, user: IUser) {
		await AccountService.delete(accountId)
		const accounts = await AccountService.getManyByChatId(chatId)
		return await bot.sendMessage(
			chatId,
			ProfileTemplate(user),
			Options.accounts(accounts)
		)
	},

	async backToProfile(chatId: number, user: IUser) {
		const accounts = await AccountService.getManyByChatId(chatId)
		return await bot.sendMessage(
			chatId,
			ProfileTemplate(user),
			Options.accounts(accounts)
		)
	},
}
