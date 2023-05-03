import { Tariffs } from '../data'

export const TariffTemplate = (): string =>
	`
    Доступные тарифы:
${Tariffs.map(
	(t) => `\n\n
"${t.name}"
    ${t.description.map((opp) => `\n- ${opp}`)}

Цена: ${t.price} руб./мес.`
)}

\n\n* Цена за каждый заказ, превысивший лимит выбранного тарифа - 1 руб.
\n* Ручная смена тарифа деактивирует подписку. Средства за оставшиеся дни подписки вернуться на баланс.
	`
		.split('.,')
		.join('.')
		.split('),')
		.join(')')
