import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setFilters } from '@/redux/slices/recommendations';
import { Dropdown, Grid } from '@nextui-org/react';
import { useMemo } from 'react';

const TypeFilter = () => {
	const types = ['OVA', 'Music', 'Movie', 'TV', 'Special', 'ONA'];
	const filters = useAppSelector(state => state.recommendations.filters);
	const dispatch = useAppDispatch();

	const selectedValue = useMemo(() => {
		const array: string[] = filters.type ?? [];
		return array.length > 2
			? `${array.length} выбрано`
			: array.join(', ').replaceAll('_', ' ');
	}, [filters.type]);

	const handleSelect = (v: any) => {
		dispatch(setFilters({ ...filters, type: Array.from(v) }));
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
				selectedKeys={filters.type}
				onSelectionChange={(v: any) => handleSelect(v)}
				css={{ maxH: '260px' }}
			>
				{types.map(type => (
					<Dropdown.Item key={type}>{type}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};

const GenreFilter = () => {
	const genres = [
		'Ecchi',
		'Erotica',
		'Fantasy',
		'Horror',
		'Gourmet',
		'Girls Love',
		'Avant Garde',
		'Slice of Life',
		'Award Winning',
		'Mystery',
		'Sci-Fi',
		'Action',
		'Drama',
		'Supernatural',
		'Comedy',
		'Boys Love',
		'Suspense',
		'Hentai',
		'Adventure',
		'Sports',
		'Romance',
	];
	const filters = useAppSelector(state => state.recommendations.filters);
	const dispatch = useAppDispatch();

	const selectedValue = useMemo(() => {
		const array: string[] = filters.genre ?? [];
		return array.length > 2
			? `${array.length} выбрано`
			: array.join(', ').replaceAll('_', ' ');
	}, [filters.genre]);

	const handleSelect = (v: any) => {
		dispatch(setFilters({ ...filters, genre: Array.from(v) }));
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
				selectedKeys={filters.genre}
				onSelectionChange={(v: any) => handleSelect(v)}
				css={{ maxH: '260px', width: '100%' }}
			>
				{genres.map(genre => (
					<Dropdown.Item key={genre}>{genre}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};

const Filters = () => {
	return (
		<Grid.Container gap={1} css={{ p: 0 }}>
			<Grid xs={6} sm={4} md={2}>
				<TypeFilter />
			</Grid>
			<Grid xs={6} sm={4} md={2}>
				<GenreFilter />
			</Grid>
		</Grid.Container>
	);
};

export default Filters;
