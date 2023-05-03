export const addAuthorizationHeader = (key: string) => ({
	headers: {
		Authorization: key,
	},
})
