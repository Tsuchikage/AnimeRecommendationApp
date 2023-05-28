import { ReactElement, useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import { Layout } from '@/components/Layout';
import { Badge, Card, Col, Collapse, Grid, Row, Text } from '@nextui-org/react';
import { useGetRecommendationQuery } from '@/redux/services/recommendations';
import { useRouter } from 'next/router';
import AnimeCard from '@/components/AnimeCard';

const RecommendationPage: NextPageWithLayout = () => {
	const router = useRouter();

	const { data, isLoading, isFetching } = useGetRecommendationQuery(
		// @ts-ignore
		router.query.id,
		{ skip: !router.isReady }
	);

	const renderResults = () => {
		if (data) {
			return Object.keys(data.data).map(key => {
				const recs = data.data[key];

				return (
					<Collapse key={key} title={key}>
						<Grid.Container gap={2} css={{ p: 0 }}>
							{recs.map(rec => (
								<Grid xs={6} sm={4} md={3} lg={2.4} xl={2} key={rec.id}>
									<AnimeCard anime={rec} />
								</Grid>
							))}
						</Grid.Container>
					</Collapse>
				);
			});
		}
		return null;
	};

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Text></Text>
				<Grid.Container gap={2} css={{ p: 0 }}>
					<Grid css={{ width: '100%' }}>
						<Collapse.Group bordered>{renderResults()}</Collapse.Group>
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
