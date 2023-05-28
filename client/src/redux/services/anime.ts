import { ListResponse, PaginationQuery, api } from './api';

export type AnimeType = 'OVA' | 'Music' | 'Movie' | 'TV' | 'Special' | 'ONA';

export type AnimeGenre =
	| 'Ecchi'
	| 'Erotica'
	| 'Fantasy'
	| 'Horror'
	| 'Gourmet'
	| 'Girls Love'
	| 'Avant Garde'
	| 'Slice of Life'
	| 'Award Winning'
	| 'Mystery'
	| 'Sci-Fi'
	| 'Action'
	| 'Drama'
	| 'Supernatural'
	| 'Comedy'
	| 'Boys Love'
	| 'Suspense'
	| 'Hentai'
	| 'Adventure'
	| 'Sports'
	| 'Romance';

export interface Anime {
	id: string;
	anime_id: string;
	title: string;
	title_japanese: string;
	cover?: string;
	type?: AnimeType;
	episodes?: number;
	airing?: boolean;
	aired_from?: string;
	aired_to?: string;
	duration?: string;
	synopsis?: string;
	producers?: string[];
	studios?: string[];
	genres?: AnimeGenre[];
}

export const animeApi = api.injectEndpoints({
	endpoints: build => ({
		listAnime: build.query<ListResponse<Anime>, PaginationQuery>({
			query: ({ page = 1, size = 50, ...rest }) => ({
				url: `/api/anime`,
				params: { page, size, ...rest },
			}),
		}),
	}),
});

export const { useListAnimeQuery } = animeApi;
