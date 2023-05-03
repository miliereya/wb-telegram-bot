import mongoose from "mongoose"

export const mongoConnect = () => {
	try {
		if (!process.env.MONGO_URI) throw 'No mongo uri was provided'

		mongoose.set('strictQuery', true)
		mongoose.connect(process.env.MONGO_URI)
	} catch (e) {
		return console.log(e)
	}
}
