import { ReactNode } from 'react';
import Header from './Header';

export const Layout = ({ children }: { children: ReactNode }) => (
	<div>
		<Header />
		{children}
	</div>
);
