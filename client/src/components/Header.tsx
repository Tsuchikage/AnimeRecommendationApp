import { Navbar, Text, Link as NextUILink } from '@nextui-org/react';
import { Logo } from './Logo';
import UserMenu from './UserMenu';
import ThemeSwitch from './ThemeSwitch';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import Link from 'next/link';

const Header = () => {
	const router = useRouter();

	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const navigation = [
		{
			label: 'Главная',
			href: '/',
		},
		{
			label: 'Мои рекомендации',
			href: '/recommendations',
		},
	];

	return (
		<Navbar isBordered maxWidth="fluid" variant="sticky">
			<Navbar.Toggle showIn="xs" />
			<Navbar.Brand
				as="a"
				css={{ '@xs': { w: '12%', cursor: 'pointer' } }}
				hideIn="xs"
				href="/"
			>
				<Logo />
				<Text b>APP</Text>
			</Navbar.Brand>
			{isAuthenticated && (
				<Navbar.Content
					enableCursorHighlight
					activeColor="secondary"
					hideIn="xs"
					variant="highlight"
				>
					{navigation.map(item => (
						<Navbar.Link
							// @ts-ignore
							as={Link}
							key={item.href}
							href={item.href}
							isActive={item.href === router.pathname}
							css={{ cursor: 'pointer' }}
						>
							{item.label}
						</Navbar.Link>
					))}
				</Navbar.Content>
			)}
			<Navbar.Content css={{ '@xs': { w: '12%', jc: 'flex-end' } }}>
				<ThemeSwitch />
				{isAuthenticated && <UserMenu />}
			</Navbar.Content>
			{isAuthenticated && (
				<Navbar.Collapse>
					{navigation.map(item => (
						<Navbar.CollapseItem
							key={item.href}
							activeColor="secondary"
							isActive={item.href === router.pathname}
						>
							<NextUILink color="inherit" css={{ minWidth: '100%' }} href="#">
								{item.label}
							</NextUILink>
						</Navbar.CollapseItem>
					))}
				</Navbar.Collapse>
			)}
		</Navbar>
	);
};

export default Header;
