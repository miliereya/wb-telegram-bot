import { IOrder } from '../types/order.types'
import { formatDate } from '../utils/date'

export const OrderTemplate = (order: IOrder): string => {
	const {
		barcode,
		category,
		date,
		discountPercent,
		lastChangeDate,
		nmId,
		odid,
		subject,
		totalPrice,
	} = order

	return `${formatDate(date)}
	Цена: ${totalPrice}
	Арт: ${nmId}
	${category}/${subject}
	`
}
