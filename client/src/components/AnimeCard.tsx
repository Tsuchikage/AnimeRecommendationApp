import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Anime } from '@/redux/services/anime';
import { addAnime, removeAnime } from '@/redux/slices/recommendations';
import { Card, Col, Text, Row, Badge } from '@nextui-org/react';
import AnimeView from './AnimeView';
import { useState } from 'react';

const AnimeCard = ({
	anime,
	isPressable = false,
}: {
	anime: Anime;
	isPressable?: boolean;
}) => {
	const [open, setOpen] = useState(false);

	const selected = useAppSelector(state => state.recommendations.selected);
	const dispatch = useAppDispatch();

	const handleSelectAnime = () => {
		if (selected.includes(anime.title)) {
			dispatch(removeAnime(anime.title));
		} else {
			dispatch(addAnime(anime.title));
		}
	};

	const handleAnimeView = () => {
		setOpen(true);
	};

	return (
		<>
			<Col>
				<Card
					css={{
						borderRadius: '4px',
						...(selected.includes(anime.title) && {
							outline: '2px solid',
							outlineColor: '$secondary',
						}),
					}}
					isPressable
					onClick={isPressable ? handleSelectAnime : handleAnimeView}
				>
					<Card.Body css={{ p: 0 }}>
						<Card.Image
							src={
								anime.cover || 'https://storage.yandexcloud.net/anime/empty.png'
							}
							objectFit="cover"
							width="100%"
							height={280}
							alt={anime.title}
						/>
					</Card.Body>
					{(anime.episodes || anime.type) && (
						<Card.Footer css={{ justifyItems: 'flex-start', py: '6px' }}>
							<Row
								justify={anime.episodes ? 'space-between' : 'flex-end'}
								align="center"
							>
								{anime.episodes && (
									<Badge size="xs" isSquared disableOutline color="secondary">
										{anime.episodes}
									</Badge>
								)}
								<Text color="gray">{anime.type}</Text>
							</Row>
						</Card.Footer>
					)}
				</Card>
				<Text
					onClick={() => setOpen(true)}
					css={{ mt: '6px', cursor: 'pointer', w: 'fit-content' }}
				>
					{anime.title}
				</Text>
			</Col>
			<AnimeView anime={anime} open={open} onClose={() => setOpen(false)} />
		</>
	);
};

export default AnimeCard;
