import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '../services/user';
import { AuthResponse, authApi } from '../services/auth';

type AuthState = {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
};

const initialState = {
	user: null,
	accessToken: null,
	refreshToken: null,
} as AuthState;

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<AuthResponse>) => {
			const { user, access_token, refresh_token } = action.payload;
			state.user = user;
			state.accessToken = access_token;
			state.refreshToken = refresh_token;
		},
		logOut: () => initialState,
	},
	extraReducers: builder => {
		builder
			.addMatcher(authApi.endpoints.login.matchPending, (state, action) => {})
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
				const { user, access_token, refresh_token } = action.payload;
				state.user = user;
				state.accessToken = access_token;
				state.refreshToken = refresh_token;
			})
			.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {});
	},
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
	Boolean(state.auth.accessToken);
