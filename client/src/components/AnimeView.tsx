import { Anime } from '@/redux/services/anime';
import { formatAiredDate } from '@/utils/format-aired-date';
import { Modal, Text, Image, Grid } from '@nextui-org/react';

interface AnimeViewProps {
	anime: Anime;
	open: boolean;
	onClose: () => void;
}

const AnimeView = ({ anime, open, onClose }: AnimeViewProps) => {
	return (
		<Modal
			blur
			aria-labelledby="modal-title"
			open={open}
			width="1000px"
			onClose={onClose}
		>
			<div style={{ display: 'flex', textAlign: 'start' }}>
				<div
					style={{
						flexBasis: '30%',
						flex: 'none',
					}}
				>
					{anime.cover && (
						<Image
							src={anime.cover}
							objectFit="cover"
							width="100%"
							height="100%"
							alt={anime.title}
						/>
					)}
				</div>
				<div style={{ flexGrow: 1, display: 'flex', padding: '16px' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
						}}
					>
						<Text h3>{anime.title}</Text>
						<Text h6 color="gray">
							{anime.synopsis}
						</Text>
						<Grid.Container>
							<Grid css={{ gap: '4px' }} xs={6}>
								<Text size={14} b color="gray">
									Тип:
								</Text>
								<Text size={14} color="secondary" b>
									{anime.type}
								</Text>
							</Grid>
							{anime.episodes && (
								<Grid css={{ gap: '4px' }} xs={6}>
									<Text size={14} b color="gray">
										Эпизодов:{' '}
									</Text>
									<Text size={14} color="secondary" b>
										{anime.episodes}
									</Text>
								</Grid>
							)}
							{anime.duration && (
								<Grid css={{ gap: '4px' }} xs={6}>
									<Text size={14} b color="gray">
										Продолжительность:{' '}
									</Text>
									<Text size={14} color="secondary" b>
										{anime.duration} мин
									</Text>
								</Grid>
							)}
							{anime.aired_from && (
								<Grid css={{ gap: '4px' }} xs={6}>
									<Text size={14} b color="gray">
										Дата выхода в эфир:
									</Text>{' '}
									<Text size={14} color="secondary" b>
										{formatAiredDate(anime.aired_from)} по{' '}
										{anime.aired_to ? formatAiredDate(anime.aired_to) : '?'}
									</Text>
								</Grid>
							)}
							<Grid css={{ gap: '4px' }} xs={6}>
								<Text size={14} b color="gray">
									Статус:
								</Text>{' '}
								<Text size={14} color="secondary" b>
									{anime.airing ? 'Выпускается' : 'Завершен'}
								</Text>
							</Grid>
							{anime.genres && (
								<Grid css={{ gap: '4px' }} xs={6}>
									<Text size={14} b color="gray">
										Жанры:
									</Text>{' '}
									<Text size={14} b color="secondary">
										{anime.genres.join(', ')}
									</Text>
								</Grid>
							)}
							{anime.producers && (
								<Grid css={{ gap: '4px' }} xs={6}>
									<Text size={14} b color="gray">
										Продюсеры:
									</Text>{' '}
									<Text size={14} b color="secondary">
										{anime.producers.join(', ')}
									</Text>
								</Grid>
							)}
							{anime.studios && (
								<Grid css={{ gap: '4px' }} xs={6}>
									<Text size={14} b color="gray">
										Студии:
									</Text>{' '}
									<Text size={14} b color="secondary">
										{anime.studios.join(', ')}
									</Text>
								</Grid>
							)}
						</Grid.Container>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default AnimeView;
