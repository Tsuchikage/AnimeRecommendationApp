import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

// 2. Call `createTheme` and pass your custom values
const lightTheme = createTheme({
	type: 'light',
	theme: {
		// colors: {...}, // optional
	},
});

const darkTheme = createTheme({
	type: 'dark',
	theme: {
		// colors: {...}, // optional
	},
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || (page => page);

	return (
		<NextThemesProvider
			defaultTheme="system"
			attribute="class"
			value={{
				light: lightTheme.className,
				dark: darkTheme.className,
			}}
		>
			<NextUIProvider>{getLayout(<Component {...pageProps} />)}</NextUIProvider>
		</NextThemesProvider>
	);

	return (
		<NextUIProvider>
			<Component {...pageProps} />
		</NextUIProvider>
	);
}
