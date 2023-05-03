import axios from 'axios'

export const api = axios.create({
	baseURL:
		'https://statistics-api.wildberries.ru/api/v1',
})
