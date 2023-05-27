import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Anime } from '@/redux/services/anime';
import { addAnime, removeAnime } from '@/redux/slices/recommendations';
import { Card, Col, Text, Row, Badge } from '@nextui-org/react';

const AnimeCard = ({ anime }: { anime: Anime }) => {
	const selected = useAppSelector(state => state.recommendations.selected);
	const dispatch = useAppDispatch();

	const handleSelectAnime = () => {
		if (selected.includes(anime.title)) {
			dispatch(removeAnime(anime.title));
		} else {
			dispatch(addAnime(anime.title));
		}
	};

	return (
		<Col>
			<Card
				isPressable
				css={{
					borderRadius: '4px',
					...(selected.includes(anime.title) && {
						outline: '2px solid',
						outlineColor: '$secondary',
					}),
				}}
				onClick={handleSelectAnime}
			>
				<Card.Body css={{ p: 0 }}>
					{anime.cover && (
						<Card.Image
							src={anime.cover}
							objectFit="cover"
							width="100%"
							height={280}
							alt={anime.title}
						/>
					)}
				</Card.Body>
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
			</Card>
			<Text css={{ mt: '6px' }}>{anime.title}</Text>
		</Col>
	);
};

export default AnimeCard;
