import { IUser } from '../types/user.types'
import { formatDate } from '../utils/date'

export const HistoryTemplate = (user: IUser): string => {
	const { balance, transactionHistory } = user

	return `
Список транзакций за последние 3 месяца:
${transactionHistory.map(
	(t, index) => `
${index !== 0 ? '------------------------------------------------' : ''}
${formatDate(t.date)}

${t.title}
Баланс: ${t.action} руб.`
)}
\n\nТекущий баланс: ${balance} руб.
	`
		.split('.,')
		.join('.')
}
