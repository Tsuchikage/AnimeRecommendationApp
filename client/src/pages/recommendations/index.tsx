import { Fragment, ReactElement, useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import { Layout } from '@/components/Layout';
import { Col, Row, Table, Text, Tooltip } from '@nextui-org/react';
import { useGetRecommendationsQuery } from '@/redux/services/user';
import { IconButton } from '@/components/IconButton';
import { EyeIcon } from '@/components/EyeIcon';
import { formatDate } from '@/utils/format-date';
import Link from 'next/link';
import { Recommendation } from '@/redux/services/recommendations';
import Head from 'next/head';

const RecommendationsPage: NextPageWithLayout = () => {
	const columns = [
		{ name: 'ПОИСК', uid: 'search' },
		{ name: 'РЕЗУЛЬТАТЫ', uid: 'results' },
		{ name: 'ДАТА', uid: 'date' },
		{ name: 'ДЕЙСТВИЯ', uid: 'actions' },
	];

	const [page, setPage] = useState(1);
	const [size, setSize] = useState(5);

	const { data, isLoading } = useGetRecommendationsQuery({
		page,
		size,
	});

	const renderCell = (recommendation: Recommendation, columnKey: any) => {
		switch (columnKey) {
			case 'search':
				return (
					<Text
						css={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '500px',
						}}
					>
						{recommendation.search_words.join(', ')}
					</Text>
				);
			case 'results':
				return <Text>{recommendation.total}</Text>;
			case 'date':
				return <Text>{formatDate(recommendation.created_at)}</Text>;
			case 'actions':
				return (
					<Row justify="center" align="center">
						<Col css={{ d: 'flex' }}>
							<Tooltip content="Подробнее">
								<Link href={`/recommendations/${recommendation.id}`}>
									<IconButton>
										<EyeIcon size={20} fill="#979797" />
									</IconButton>
								</Link>
							</Tooltip>
						</Col>
					</Row>
				);
		}
	};

	if (isLoading && !data) return <div>Загрузка...</div>;

	if (data && !data.items.length)
		return <div>Вы еще не сгенерировали рекомендации</div>;

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				<Text h4>Рекомендации</Text>
				<Table
					bordered
					shadow={false}
					color="secondary"
					aria-label="Recommendations table"
					css={{
						height: 'auto',
						minWidth: '100%',
					}}
				>
					<Table.Header columns={columns}>
						{column => (
							<Table.Column
								key={column.uid}
								hideHeader={column.uid === 'actions'}
								align={column.uid === 'actions' ? 'center' : 'start'}
							>
								{column.name}
							</Table.Column>
						)}
					</Table.Header>
					<Table.Body>
						{/* @ts-ignore */}
						{data?.items.map(item => (
							<Table.Row key={item.id}>
								{columnKey => (
									<Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
								)}
							</Table.Row>
						))}
					</Table.Body>
					{/* @ts-ignore */}
					{data?.items?.length > 0 ? (
						<Table.Pagination
							noMargin
							align="center"
							rowsPerPage={size}
							onPageChange={setPage}
							total={data?.pages}
						/>
					) : (
						<Fragment />
					)}
				</Table>
			</div>
		</>
	);
};

RecommendationsPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Мои рекомендации</title>
			</Head>
			{page}
		</Layout>
	);
};

RecommendationsPage.auth = true;

export default RecommendationsPage;
