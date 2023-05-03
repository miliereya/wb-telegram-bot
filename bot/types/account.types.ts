export type TypeSubscription = 'Активна' | 'Не активна'

export interface IAccount {
	_id: string
	chat_id: number
	tariff: string
	name: string
	statistics_key: string
	common_key: string
	subscription: TypeSubscription
	tariffRenewDate: Date
}
