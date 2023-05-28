import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { AnimeGenre, AnimeType } from '@/redux/services/anime';
import { setFilters } from '@/redux/slices/recommendations';
import {
	Button,
	Col,
	Dropdown,
	Grid,
	Input,
	Loading,
	Text,
} from '@nextui-org/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { FiFilter, FiList } from 'react-icons/fi';
import AnimeSelectedModal from './AnimeSelectedModal';

interface TypeFilterProps {
	types: AnimeType[];
	setTypes: Dispatch<SetStateAction<AnimeType[]>>;
}

const TypeFilter = ({ types, setTypes }: TypeFilterProps) => {
	const items = ['Movie', 'Music', 'ONA', 'OVA', 'Special', 'TV'];

	const selectedValue = useMemo(() => {
		const array: string[] = types ?? [];
		return array.length > 2
			? `${array.length} выбрано`
			: array.join(', ').replaceAll('_', ' ');
	}, [types]);

	const handleSelect = (v: any) => {
		setTypes(Array.from(v));
	};

	return (
		<Dropdown>
			<Dropdown.Button
				flat
				color="secondary"
				css={{
					tt: 'capitalize',
					width: '100%',
					justifyContent: 'space-between',
				}}
			>
				{selectedValue ? selectedValue : 'Выбрать тип'}
			</Dropdown.Button>
			<Dropdown.Menu
				aria-label="Multiple selection types"
				color="secondary"
				selectionMode="multiple"
				selectedKeys={types}
				onSelectionChange={(v: any) => handleSelect(v)}
				css={{ maxH: '260px' }}
			>
				{items.map(type => (
					<Dropdown.Item key={type}>{type}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};

interface GenreFilterProps {
	genres: AnimeGenre[];
	setGenres: Dispatch<SetStateAction<AnimeGenre[]>>;
}

const GenreFilter = ({ genres, setGenres }: GenreFilterProps) => {
	const items = [
		'Action',
		'Adventure',
		'Avant Garde',
		'Award Winning',
		'Boys Love',
		'Comedy',
		'Drama',
		'Ecchi',
		'Erotica',
		'Fantasy',
		'Girls Love',
		'Gourmet',
		'Hentai',
		'Horror',
		'Mystery',
		'Romance',
		'Sci-Fi',
		'Slice of Life',
		'Sports',
		'Supernatural',
		'Suspense',
	];

	const selectedValue = useMemo(() => {
		const array: string[] = genres ?? [];
		return array.length > 2
			? `${array.length} выбрано`
			: array.join(', ').replaceAll('_', ' ');
	}, [genres]);

	const handleSelect = (v: any) => {
		setGenres(Array.from(v));
	};

	return (
		<Dropdown>
			<Dropdown.Button
				flat
				color="secondary"
				css={{
					tt: 'capitalize',
					width: '100%',
					justifyContent: 'space-between',
				}}
			>
				{selectedValue ? selectedValue : 'Выбрать жанр'}
			</Dropdown.Button>
			<Dropdown.Menu
				aria-label="Multiple selection genres"
				color="secondary"
				selectionMode="multiple"
				selectedKeys={genres}
				onSelectionChange={(v: any) => handleSelect(v)}
				css={{ maxH: '260px', width: '100%' }}
			>
				{items.map(genre => (
					<Dropdown.Item key={genre}>{genre}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};

const Filters = ({ isLoading }: { isLoading: boolean }) => {
	const [open, setOpen] = useState(false);
	const [types, setTypes] = useState<AnimeType[]>([]);
	const [genres, setGenres] = useState<AnimeGenre[]>([]);
	const [q, setQ] = useState<string>('');

	const dispatch = useAppDispatch();

	const handleFilter = () => {
		dispatch(setFilters({ type: types, genre: genres, q }));
	};

	return (
		<Col>
			<Text h4>Фильтры</Text>
			<Grid.Container gap={1} css={{ p: 0 }}>
				<Grid xs={12} sm={4} md={2}>
					<Input
						placeholder="Поиск..."
						status="secondary"
						fullWidth
						onChange={e => setQ(e.target.value)}
						maxLength={64}
					/>
				</Grid>
				<Grid xs={12} sm={4} md={2}>
					<TypeFilter types={types} setTypes={setTypes} />
				</Grid>
				<Grid xs={12} sm={4} md={2}>
					<GenreFilter genres={genres} setGenres={setGenres} />
				</Grid>
				<Grid xs={12} sm={4} md={4}>
					<div style={{ display: 'flex', gap: '12px' }}>
						<Button
							auto
							color="secondary"
							icon={<FiList size={20} fill="currentColor" />}
							css={{ flex: 'none' }}
							flat
							onClick={() => setOpen(true)}
						/>
						<Button
							icon={<FiFilter fill="currentColor" />}
							color="secondary"
							auto
							onClick={handleFilter}
							disabled={isLoading}
						>
							Фильтр
						</Button>
					</div>
				</Grid>
				{/* <Grid xs={6} sm={4} md={2}>
				<Button color="gradient" auto ghost>
					<Text size={16} weight="semibold">
						Сгенерировать
					</Text>
				</Button>
			</Grid> */}
			</Grid.Container>
			<AnimeSelectedModal open={open} onClose={() => setOpen(false)} />
		</Col>
	);
};

export default Filters;
