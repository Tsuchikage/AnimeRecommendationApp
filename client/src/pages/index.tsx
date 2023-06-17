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
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const RecommendationOptionsModal = dynamic(
	() => import('@/components/RecommendationOptionsModal')
);
const AnimeCard = dynamic(() => import('@/components/AnimeCard'));
const Filters = dynamic(() => import('@/components/Filters'));

const Home: NextPageWithLayout = () => {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const [page, setPage] = useState(1);
	const [size, setSize] = useState(25);

	const { q, genre, type } = useAppSelector(
		state => state.recommendations.filters
	);

	const selected = useAppSelector(state => state.recommendations.selected);

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

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					<Filters isLoading={isFetching} />
					<Button
						color="gradient"
						disabled={!selected.length}
						auto
						css={{ fontSize: '16px', fontWeight: 'bold' }}
						onClick={() => setOpen(true)}
					>
						Сгенерировать рекомендации
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
			<RecommendationOptionsModal open={open} onClose={() => setOpen(false)} />
		</>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Аниме</title>
			</Head>
			{page}
		</Layout>
	);
};

Home.auth = true;

export default Home;
