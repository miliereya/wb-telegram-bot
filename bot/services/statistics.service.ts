import axios from 'axios'
import { addAuthorizationHeader } from '../utils/api'

export const StatisticsService = {
	async getSalesReports(
		statistics_key: string,
		dateFrom: string
	) {
		return await axios.get(
			`https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${dateFrom}`,
			addAuthorizationHeader(statistics_key)
		)
	},
}
