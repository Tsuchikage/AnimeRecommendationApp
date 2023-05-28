export const formatDate = (timestamp: string) => {
	const date = new Date(timestamp);

	let options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	};

	const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date);

	return formattedDate;
};
