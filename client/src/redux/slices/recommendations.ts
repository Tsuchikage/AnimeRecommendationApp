import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AnimeGenre, AnimeType } from '../services/anime';

type Filters = {
	type?: AnimeType[];
	genre?: AnimeGenre[];
	q?: string;
};

type RecommendationsState = {
	filters: Filters;
	selected: string[];
};

const initialState = {
	filters: {},
	selected: [],
} as RecommendationsState;

const recommendationsSlice = createSlice({
	name: 'recommendations',
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<Filters>) => {
			state.filters = action.payload;
		},
		setSelected: (state, action: PayloadAction<string[]>) => {
			state.selected = action.payload;
		},
		setSearch: (state, action: PayloadAction<string>) => {
			state.filters.q = action.payload;
		},
		addAnime: (state, action: PayloadAction<string>) => {
			state.selected.push(action.payload);
		},
		removeAnime: (state, action: PayloadAction<string>) => {
			state.selected = state.selected.filter(el => el !== action.payload);
		},
		clearFilters: state => {
			state.filters = initialState.filters;
		},
		clearSelected: state => {
			state.selected = initialState.selected;
		},
	},
});

export const {
	setFilters,
	setSearch,
	setSelected,
	addAnime,
	removeAnime,
	clearFilters,
	clearSelected,
} = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
