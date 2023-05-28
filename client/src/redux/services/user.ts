import { ListResponse, PaginationQuery, api } from './api';

export interface User {
	id: string;
	username: string;
}

export interface UserRecommendation {
	id: string;
	data: { [key: string]: string };
	search_words: string[];
	user_id: string;
	total: number;
	created_at: string;
}

export const userApi = api.injectEndpoints({
	endpoints: build => ({
		getUser: build.query<User, void>({
			query: () => `/api/users/me`,
			providesTags: ['Auth'],
		}),
		getRecommendations: build.query<
			ListResponse<UserRecommendation>,
			PaginationQuery
		>({
			query: () => '/api/users/recommendations',
			providesTags: result =>
				result
					? [
							...result.items.map(({ id }) => ({ type: 'User', id } as const)),
							{ type: 'User', id: 'RECOMMENDATIONS' },
					  ]
					: [{ type: 'User', id: 'RECOMMENDATIONS' }],
		}),
	}),
});

export const { useGetUserQuery, useGetRecommendationsQuery } = userApi;
