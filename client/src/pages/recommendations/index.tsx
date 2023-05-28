import { ReactElement, useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import { Layout } from '@/components/Layout';
import { Col, Row, Table, Text, Tooltip } from '@nextui-org/react';
import {
	UserRecommendation,
	useGetRecommendationsQuery,
} from '@/redux/services/user';
import { IconButton } from '@/components/IconButton';
import { EyeIcon } from '@/components/EyeIcon';
import { formatDate } from '@/utils/format-date';
import Link from 'next/link';

const RecommendationsPage: NextPageWithLayout = () => {
	const columns = [
		{ name: 'ПОИСК', uid: 'search' },
		{ name: 'РЕЗУЛЬТАТЫ', uid: 'results' },
		{ name: 'ДАТА', uid: 'date' },
		{ name: 'ДЕЙСТВИЯ', uid: 'actions' },
	];

	const [open, setOpen] = useState(false);

	const [page, setPage] = useState(1);
	const [size, setSize] = useState(25);

	const { data, isLoading, isFetching } = useGetRecommendationsQuery({
		page,
		size,
	});

	const renderCell = (recommendation: UserRecommendation, columnKey: any) => {
		switch (columnKey) {
			case 'search':
				return <Text>{recommendation.search_words.join(', ')}</Text>;
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

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					{data && (
						<Text size={14} color="gray">
							{data.total} рекомендации
						</Text>
					)}
				</div>
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
							<Table.Row>
								{columnKey => (
									<Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
								)}
							</Table.Row>
						))}
					</Table.Body>
					<Table.Pagination
						noMargin
						align="center"
						rowsPerPage={3}
						onPageChange={setPage}
						total={data?.pages}
					/>
				</Table>
			</div>
		</>
	);
};

RecommendationsPage.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

RecommendationsPage.auth = true;

export default RecommendationsPage;