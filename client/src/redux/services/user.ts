import { api } from './api';

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
	}),
});

export const { useGetUserQuery } = userApi;
