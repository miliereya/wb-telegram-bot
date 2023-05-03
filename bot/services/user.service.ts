import { ITransaction, IUser } from '../types/user.types'
import { UserModel } from '../models/user.model'
import { TypeSubscription } from '../types/account.types'

export const UserService = {
	async getByChatIdOrCreate(chatId: number): Promise<IUser> {
		const user = await UserModel.findOne({ chatId })
		if (!user)
			await UserModel.create({
				chatId,
			})
		return user
	},

	async updateKey(chatId: number, wb_key: string) {
		await UserModel.findOneAndUpdate({ chatId }, { wb_key })
	},

	async setCurrentStep(chatId: number, currentStep: string) {
		await UserModel.findOneAndUpdate({ chatId }, { currentStep })
	},

	async getActiveUsers(): Promise<IUser[]> {
		return await UserModel.find({ subscription: 'Active' })
	},

	async setSubscription(chatId: number, subscription: TypeSubscription) {
		await UserModel.findOneAndUpdate({ chatId }, { subscription })
	},

	async addOrderNotification(chatId: number, odid: number) {
		await UserModel.findOneAndUpdate(chatId, {
			$push: { notifiedOrders: odid },
		})
	},

	async setBalance(
		chatId: number,
		balance: number,
		transaction: ITransaction
	): Promise<IUser> {
		return await UserModel.findOneAndUpdate(
			{ chatId },
			{ balance, $push: { transactionHistory: transaction } },
			{ new: true }
		)
	},

	async addAccount(chatId: number, accountId: string) {
		await UserModel.findOneAndUpdate(
			{ chatId },
			{
				$push: {
					accounts: accountId,
				},
			}
		)
	},

	async updateTestPeriod(chatId: number, dateTo: Date | number) {
		await UserModel.findOneAndUpdate(
			{ chatId },
			{ endOfFreePeriodDate: dateTo, isFreePeriodUsed: true }
		)
	},
}
