import { bot } from './bot'
import { ICommand } from './types/command.types'

const Commands: ICommand[] = [
	{ command: '/start', description: 'Полное описание бота' },
	{ command: '/supplies', description: 'Работа с поставками' },
	{ command: '/stocks', description: 'Работа с остатками"' },
	{ command: '/reports', description: 'Получить отсчеты' },
	{ command: '/profile', description: 'Профиль' },
	{ command: '/export', description: 'Экспортировать в таблицы' },
	{ command: '/history', description: 'История транзакций' },
]

export const setCommands = () => bot.setMyCommands(Commands)
