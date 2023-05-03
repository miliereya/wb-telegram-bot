import { IAccount } from '../types/account.types'
import { formatDate } from '../utils/date'

export const AccountTemplate = (account: IAccount): string => {
	const {
		name,
		common_key,
		statistics_key,
		subscription,
		tariffRenewDate,
		tariff,
	} = account

	return `
Имя аккаунта: ${name || '-'}

Стандартный ключ:   ${common_key ? '************' : '-'}
Ключ статистики:       ${statistics_key ? '************' : '-'}

Подписка: ${subscription}
Тариф: ${tariff || '-'}
${
	tariffRenewDate
		? `Обновление подписки: ${formatDate(tariffRenewDate)}`
		: ''
}
`
}
