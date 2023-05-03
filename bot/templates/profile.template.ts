import { IUser } from '../types/user.types'
import { formatDate } from '../utils/date'

export const ProfileTemplate = (user: IUser): string => {
	const { chatId, balance, endOfFreePeriodDate } = user

	return `
    ID: ${chatId}

Баланс: ${balance} руб.
${
	endOfFreePeriodDate > new Date()
		? `Бесплатный период до: ${formatDate(endOfFreePeriodDate)}`
		: ''
}
	`
}
