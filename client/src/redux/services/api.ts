import { logOut, setCredentials } from '../slices/authSlice';
import { RootState } from '../store';
import {
	createApi,
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

export interface ListResponse<T> {
	docs: T[];
	totalDocs: number;
	limit: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	page: number;
	totalPages: number;
	prevPage: number;
	nextPage: number;
	pagingCounter: number;
}

export interface PaginationQuery {
	page: number;
	limit: number;
	q?: string;
}

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:8000',
	// credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const { accessToken } = (getState() as RootState).auth;
		if (accessToken && !headers.has('Authorization')) {
			headers.set('Authorization', `Bearer ${accessToken}`);
		}
		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		// try to get a new token
		const refreshResult = (await baseQuery(
			{
				url: '/api/auth/refresh',
				headers: {
					Authorization: `Bearer ${
						(api.getState() as RootState).auth.refreshToken
					}`,
				},
			},
			api,
			extraOptions
		)) as any;

		if (refreshResult.data) {
			// store the new token
			const { auth } = api.getState() as RootState;
			api.dispatch(setCredentials({ ...auth.user, ...refreshResult.data }));

			// retry the initial query
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logOut());
		}
	}
	return result;
};

export const api = createApi({
	reducerPath: 'splitApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Auth', 'User'],
	endpoints: () => ({}),
});
