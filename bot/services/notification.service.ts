import axios from 'axios'
import { api } from '../api/instance'
import { IOrder } from '../types/order.types'
import { addAuthorizationHeader } from '../utils/api'

export const NotificationService = {
	async getOrders(key: string, dateFrom: string): Promise<IOrder[]> {
		const res = await api.get<IOrder[]>(
			`/supplier/orders?dateFrom=${dateFrom}`,
			addAuthorizationHeader(key)
		)
		return res.data
	},

	async getPrices(key: string) {
		const res = await axios.get(
			'https://suppliers-api.wildberries.ru/public/api/v1/info',
			addAuthorizationHeader(key)
		)
		return res.data
	},
}
