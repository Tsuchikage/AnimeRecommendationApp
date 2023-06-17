import { ListResponse, PaginationQuery, api } from './api';
import { Recommendation } from './recommendations';

export interface User {
	id: string;
	username: string;
}

export const userApi = api.injectEndpoints({
	endpoints: build => ({
		getUser: build.query<User, void>({
			query: () => `/api/users/me`,
			providesTags: ['Auth'],
		}),
		getRecommendations: build.query<
			ListResponse<Recommendation>,
			PaginationQuery
		>({
			query: ({ page = 1, size = 50, ...rest }) => ({
				url: `/api/users/recommendations`,
				params: { page, size, ...rest },
			}),
			providesTags: result =>
				result
					? [
							...result.items.map(({ id }) => ({ type: 'User', id } as const)),
							{ type: 'User', id: 'RECOMMENDATIONS' },
					  ]
					: [{ type: 'User', id: 'RECOMMENDATIONS' }],
		}),
		// listAnime: build.query<ListResponse<Anime>, PaginationQuery>({
		// 	query: ({ page = 1, size = 50, ...rest }) => ({
		// 		url: `/api/anime`,
		// 		params: { page, size, ...rest },
		// 	}),
		// }),
	}),
});

export const { useGetUserQuery, useGetRecommendationsQuery } = userApi;
