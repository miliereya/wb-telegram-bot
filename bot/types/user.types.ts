export interface ITransaction {
	date: Date
	action: string
	title: string
}

export interface IUser {
	chatId: number
	currentStep: string
	balance: number
	endOfFreePeriodDate: Date
	isFreePeriodUsed: boolean
	transactionHistory: ITransaction[]
}
