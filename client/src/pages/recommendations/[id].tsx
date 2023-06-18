import { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';
import { Layout } from '@/components/Layout';
import { Grid, Text } from '@nextui-org/react';
import { useGetRecommendationQuery } from '@/redux/services/recommendations';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const AnimeCard = dynamic(() => import('@/components/AnimeCard'));

const RecommendationPage: NextPageWithLayout = () => {
	const router = useRouter();

	const { data, isLoading, isFetching } = useGetRecommendationQuery(
		// @ts-ignore
		router.query.id,
		{ skip: !router.isReady }
	);

	return (
		<>
			<Head>
				<title>Рекомендации по {data?.search_words.join(', ')}</title>
			</Head>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{data && <Text h4>Рекомендации по {data.search_words.join(', ')}</Text>}
				<Grid.Container gap={2} css={{ p: 0 }}>
					<Grid css={{ width: '100%' }}>
						<Grid.Container gap={2} css={{ p: 0 }}>
							{data &&
								data.recommendations.map((anime, id) => (
									<Grid key={id} xs={6} sm={4} md={3} lg={2.4} xl={2}>
										<AnimeCard anime={anime} isPressable={false} />
									</Grid>
								))}
						</Grid.Container>
					</Grid>
				</Grid.Container>
			</div>
		</>
	);
};

RecommendationPage.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

RecommendationPage.auth = true;

export default RecommendationPage;
