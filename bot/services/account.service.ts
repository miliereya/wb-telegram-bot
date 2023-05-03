import { AccountModel } from '../models/account.model'
import { IAccount } from '../types/account.types'

export const AccountService = {
	async create(chatId: number) {
		const newAccount = new AccountModel({
			chatId,
		})

		await newAccount.save()
		return newAccount._id
	},

	async getManyByChatId(chatId: number): Promise<IAccount[]> {
		return await AccountModel.find({ chatId })
	},

	async getById(_id: string): Promise<IAccount> {
		return await AccountModel.findById(_id)
	},

	async updateOne(
		_id: string,
		value: string,
		placeholder: string
	): Promise<IAccount> {
		return await AccountModel.findByIdAndUpdate(
			_id,
			{ [placeholder]: value },
			{
				new: true,
			}
		)
	},

	async activateSubscription(_id: string, renewDate: Date | number) {
		return await AccountModel.findByIdAndUpdate(
			_id,
			{
				subscription: 'Активна',
				tariffRenewDate: renewDate,
			},
			{ new: true }
		)
	},

	async deactivateSubscription(_id: string) {
		return await AccountModel.findByIdAndUpdate(
			_id,
			{
				subscription: 'Не активна',
				tariffRenewDate: undefined,
			},
			{ new: true }
		)
	},

	async delete(_id: string) {
		return await AccountModel.findByIdAndDelete(_id)
	},
}
