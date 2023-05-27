import { ReactElement, useState } from 'react';
import type { NextPageWithLayout } from './_app';
import { Layout } from '@/components/Layout';
import {
	Button,
	Grid,
	Input,
	Loading,
	Pagination,
	Row,
	Text,
} from '@nextui-org/react';
import { useListAnimeQuery } from '@/redux/services/anime';
import AnimeCard from '@/components/AnimeCard';
import Filters from '@/components/Filters';
import { FiList } from 'react-icons/fi';
import AnimeSelectedListModal from '@/components/AnimeSelectedListModal';

const Home: NextPageWithLayout = () => {
	const [open, setOpen] = useState(false);

	const [page, setPage] = useState(1);
	const [size, setSize] = useState(25);

	const { data, isLoading, isFetching } = useListAnimeQuery({ page, size });

	const handlePaginationOnChange = (page: number) => {
		setPage(page);
		window.scrollTo(0, 0);
	};

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					<Row
						css={{
							flexDirection: 'column',
							'@xs': { flexDirection: 'row' },
							gap: '12px',
						}}
					>
						<Input
							placeholder="Найти аниме"
							animated={false}
							color="secondary"
							bordered
							fullWidth
							contentRight={isFetching && <Loading size="xs" />}
						/>
						<div style={{ display: 'flex', gap: '12px' }}>
							<Button
								auto
								color="secondary"
								icon={<FiList size={20} fill="currentColor" />}
								css={{ flex: 'none' }}
								flat
								onClick={() => setOpen(true)}
							/>
							<Button color="gradient" auto ghost css={{ w: 'fit-content' }}>
								<Text size={16} weight="semibold">
									Сгенерировать рекомендации
								</Text>
							</Button>
						</div>
					</Row>
					<Filters />
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
								<Grid xs={6} sm={4} md={3} lg={2.4} xl={2}>
									<AnimeCard anime={anime} />
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
			<AnimeSelectedListModal open={open} onClose={() => setOpen(false)} />
		</>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

Home.auth = true;

export default Home;
