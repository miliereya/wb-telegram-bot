import { SendBasicOptions } from 'node-telegram-bot-api'
import { Tariffs } from './data'
import { IAccount, TypeSubscription } from './types/account.types'

export const Options = {
	buy_tariff: <SendBasicOptions>{
		reply_markup: {
			inline_keyboard: [],
		},
	},

	accounts(accounts: IAccount[]) {
		const accountsData = accounts.map((acc) => [
			{
				text: `👤 ${acc.name || 'Без имени'}`,
				callback_data: `Аккаунт/${acc._id}`,
			},
		])

		accounts.length < 5 &&
			accountsData.push([
				{
					text: 'Добавить аккаунт',
					callback_data: 'Добавить аккаунт',
				},
			])

		return {
			reply_markup: {
				inline_keyboard: accountsData,
			},
		}
	},

	account(account: IAccount) {
		const { _id, subscription } = account
		return {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: 'Обновить ключ статистики',
							callback_data: `Ключ статистики/${_id}`,
						},
						{
							text: 'Обновить стандартный ключ',
							callback_data: `Стандартный ключ/${_id}`,
						},
					],
					[
						{
							text: 'Обновить имя',
							callback_data: `Имя аккаунта/${_id}`,
						},
						{
							text: 'Выбрать тариф',
							callback_data: `Выбрать тариф/${_id}`,
						},
					],
					[
						{
							text:
								subscription === 'Активна'
									? 'Отменить подписку'
									: 'Активировать подписку',
							callback_data: `Подписка/${_id}`,
						},
						{
							text: 'Удалить аккаунт',
							callback_data: `Удалить аккаунт/${_id}`,
						},
					],
					[
						{
							text: 'Вернуться',
							callback_data: `Вернуться в профиль`,
						},
					],
				],
			},
		}
	},

	tariffs(_id: string) {
		return {
			reply_markup: {
				inline_keyboard: Tariffs.map((t) => [
					{
						text: t.name,
						callback_data: `${t.name}/${_id}`,
					},
				]),
			},
		}
	},
}
