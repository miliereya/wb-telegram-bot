import dayjs from 'dayjs'

export const formatDate = (date: Date | number, isReq: boolean = false): string => {
	return isReq
		? `${dayjs(date).format('YYYY/MM/DD')}`
		: `${dayjs(date).format('DD.MM.YYYY HH:mm')}`
}
