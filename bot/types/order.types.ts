export interface IOrder {
	nmId: string
	barcode: string
	date: Date
	lastChangeDate: Date
	subject: string
	category: string
	discountPercent: number
	totalPrice: number
	odid: number
}
