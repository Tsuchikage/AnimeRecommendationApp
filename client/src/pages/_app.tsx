import '@/styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/use-user';

const lightTheme = createTheme({ type: 'light', theme: {} });
const darkTheme = createTheme({ type: 'dark', theme: {} });

let persistor = persistStore(store);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
	auth?: boolean;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || (page => page);

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<NextThemesProvider
						defaultTheme="system"
						attribute="class"
						value={{
							light: lightTheme.className,
							dark: darkTheme.className,
						}}
					>
						<NextUIProvider>
							{Component.auth ? (
								<Auth>{getLayout(<Component {...pageProps} />)}</Auth>
							) : (
								getLayout(<Component {...pageProps} />)
							)}
						</NextUIProvider>
					</NextThemesProvider>
				</PersistGate>
			</Provider>
		</>
	);
}

function Auth({ children }: { children: any }) {
	const router = useRouter();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const { user, isLoading } = useUser({ skip: !isAuthenticated });

	if (!isAuthenticated) {
		router.replace('/auth');
		return null;
	}

	if (isLoading) {
		return null;
	}

	if (!user) {
		router.replace('/auth');
		return null;
	}

	return children;
}
