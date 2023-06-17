import { ReactElement, useEffect } from 'react';
import type { NextPageWithLayout } from './_app';
import { Layout } from '@/components/Layout';
import { Container } from '@nextui-org/react';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const Auth = dynamic(() => import('@/components/Auth'));

const AuthPage: NextPageWithLayout = () => {
	const router = useRouter();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	console.log('isAuthenticated', isAuthenticated);

	useEffect(() => {
		if (isAuthenticated) {
			router.replace('/');
		}
	}, []);

	if (isAuthenticated) return null;

	return (
		<div
			style={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyItems: 'center',
			}}
		>
			<Container style={{ maxWidth: '400px' }}>
				<Auth />
			</Container>
		</div>
	);
};

AuthPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<Head>
				<title>Вход</title>
			</Head>
			{page}
		</Layout>
	);
};

export default AuthPage;
