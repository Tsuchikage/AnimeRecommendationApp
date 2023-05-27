import { ReactNode } from 'react';
import Header from './Header';
import { Container } from '@nextui-org/react';

export const Layout = ({ children }: { children: ReactNode }) => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			height: '100vh',
		}}
	>
		<Header />
		<Container
			css={{ padding: '12px', height: '100%', '@xs': { padding: '24px' } }}
			fluid
		>
			{children}
		</Container>
	</div>
);
