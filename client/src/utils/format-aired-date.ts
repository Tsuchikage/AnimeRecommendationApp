export const formatAiredDate = (timestamp: string) => {
	const date = new Date(timestamp);

	let options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	};

	const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date);

	return formattedDate;
};
