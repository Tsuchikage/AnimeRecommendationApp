import { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { Layout } from '@/components/Layout';

const Home: NextPageWithLayout = () => {
	return <div>Home</div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
