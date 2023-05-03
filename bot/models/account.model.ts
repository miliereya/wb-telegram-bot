const mongoose = require('mongoose')

// Define a schema
const Schema = mongoose.Schema

const AccountSchema = new Schema({
	chat_id: { type: Number, require: true },
	name: { type: String, require: true, default: '' },
	tariff: { type: String, require: true, default: '' },
	statistics_key: { type: String, require: true, default: '' },
	common_key: { type: String, require: true, default: '' },
	subscription: { type: String, require: true, default: 'Не активна' },
	tariffRenewDate: { type: Date, require: false },
})

export const AccountModel = mongoose.model('Account', AccountSchema)
