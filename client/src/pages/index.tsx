import { ReactElement, useState } from 'react';
import type { NextPageWithLayout } from './_app';
import { Layout } from '@/components/Layout';
import {
	Button,
	Grid,
	Loading,
	Pagination,
	Row,
	Text,
} from '@nextui-org/react';
import { useListAnimeQuery } from '@/redux/services/anime';
import AnimeCard from '@/components/AnimeCard';
import Filters from '@/components/Filters';
import { useAppSelector } from '@/redux/hooks';
import { useCreateRecommendationMutation } from '@/redux/services/recommendations';
import { useRouter } from 'next/router';

const Home: NextPageWithLayout = () => {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const [page, setPage] = useState(1);
	const [size, setSize] = useState(25);

	const { q, genre, type } = useAppSelector(
		state => state.recommendations.filters
	);

	const selected = useAppSelector(state => state.recommendations.selected);

	const [createRecommendation, { isLoading: isCreatingRecommendation }] =
		useCreateRecommendationMutation();

	const { data, isLoading, isFetching } = useListAnimeQuery({
		page,
		size,
		...(q && { q }),
		...(type && { type: type.join(';') }),
		...(genre && { genre: genre.join(';') }),
	});

	const handlePaginationOnChange = (page: number) => {
		setPage(page);
		window.scrollTo(0, 0);
	};

	const handleCreateRecommendations = async () => {
		const res = await createRecommendation({
			search_words: selected,
			count: 10,
		});
		// @ts-ignore
		router.push(`/recommendations/${res.data.id}`);
	};

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					<Filters isLoading={isFetching} />
					<Button
						color="gradient"
						disabled={!selected.length || isCreatingRecommendation}
						auto
						css={{ fontSize: '16px', fontWeight: 'bold' }}
						onClick={handleCreateRecommendations}
					>
						{isCreatingRecommendation ? (
							<Loading color="currentColor" size="sm" />
						) : (
							'Сгенерировать рекомендации'
						)}
					</Button>
					{data && (
						<Text size={14} color="gray">
							{data.total} тайтлов
						</Text>
					)}
				</div>
				<Grid.Container gap={2} justify="center" css={{ p: 0 }}>
					{!isLoading && data ? (
						<>
							{data.items.map(anime => (
								<Grid key={anime.id} xs={6} sm={4} md={3} lg={2.4} xl={2}>
									<AnimeCard anime={anime} isPressable />
								</Grid>
							))}
						</>
					) : (
						<Loading size="md" color="secondary" />
					)}
				</Grid.Container>

				{!isLoading && (
					<Row justify="center" css={{ pb: '12px' }}>
						<Pagination
							onChange={handlePaginationOnChange}
							loop
							color="secondary"
							total={data?.pages}
						/>
					</Row>
				)}
			</div>
		</>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

Home.auth = true;

export default Home;
