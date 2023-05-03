const mongoose = require('mongoose')

// Define a schema
const Schema = mongoose.Schema

const UserSchema = new Schema({
	chatId: { type: Number, require: true },
	currentStep: { type: String, require: true, default: '' },
	balance: { type: Number, require: true, default: 0 },
	endOfFreePeriodDate: { type: Date, require: false },
	isFreePeriodUsed: { type: Boolean, require: true, default: false },
	transactionHistory: { type: [], require: true, default: [] },
})

export const UserModel = mongoose.model('User', UserSchema)
