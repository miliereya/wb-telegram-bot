// import dayjs from 'dayjs'
// import { bot } from '../bot'
// import { NotificationService } from '../services/notification.service'
// import { UserService } from '../services/user.service'
// import { OrderTemplate } from '../templates/order.template'
// import { IUser } from '../types/user.types'
// import { formatDate } from '../utils/date'

// export const sendNewNotifications = async () => {
// 	const activeUsers = await UserService.getActiveUsers()
// 	const nowDate = new Date()
// 	for (let i = 0; i < activeUsers.length; i++) {
// 		notifyUser(activeUsers[i], nowDate)
// 	}
// }

// const notifyUser = async (user: IUser, nowDate: Date) => {
// 	const chatId = user.chatId

// 	if (user.tariffRenewDate.getTime() < nowDate.getTime()) {
// 		if (user.balance > 100) {
// 			await UserService.setBalance(chatId, user.balance - 100)
// 		} else {
// 			UserService.setSubscription(chatId, 'Не активна')

// 			return bot.sendMessage(
// 				chatId,
// 				'Недостаточно средств на балансе для продления тарифа'
// 			)
// 		}
// 	}

// 	try {
// 		const orders = await NotificationService.getOrders(
// 			user.wb_key,
// 			formatDate(nowDate, true)
// 		)
// 		for (let i = 0; i < orders.length; i++) {
// 			const date = new Date(orders[i].date)

// 			if (
// 				dayjs(nowDate).diff(dayjs(date)) > 15000 ||
// 				user.notifiedOrders.includes(orders[i].odid)
// 			)
// 				return

// 			bot.sendMessage(chatId, OrderTemplate(orders[i]), {
// 				parse_mode: 'HTML',
// 			})
// 			UserService.addOrderNotification(chatId, orders[i].odid)
// 		}
// 	} catch (e: any) {
// 		if (e.status === 401) {
// 			await UserService.setCurrentStep(chatId, 'wb-ключ')
// 			bot.sendMessage(chatId, 'Неверный ключ авторизации, отправьте ключ снова')
// 		}
// 	}
// }
