import { User } from './user';
import { api } from './api';

export type AuthResponse = {
	access_token: string;
	refresh_token: string;
	user: User;
};

export interface LoginRequest {
	username: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	password: string;
}

export const authApi = api.injectEndpoints({
	endpoints: build => ({
		login: build.mutation<AuthResponse, LoginRequest>({
			query: ({ username, password }) => {
				const payload = new URLSearchParams();
				payload.append('username', username);
				payload.append('password', password);

				return {
					url: '/api/auth/login',
					method: 'POST',
					body: payload,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				};
			},
			invalidatesTags: ['Auth'],
		}),
		register: build.mutation<AuthResponse, RegisterRequest>({
			query: credentials => ({
				url: '/api/auth/signup',
				method: 'POST',
				body: credentials,
			}),
			// invalidatesTags: ['Auth'],
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
