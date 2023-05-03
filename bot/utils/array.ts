export const isIncludedInArray = (
	arr: string[],
	data: string,
	prefix: string
): null | string => {
	for (let i = 0; i < arr.length; i++) {
		if (prefix + arr[i] === data) return arr[i]
	}

	return null
}
