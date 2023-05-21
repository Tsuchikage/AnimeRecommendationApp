import { Navbar, Link, Text } from '@nextui-org/react';
import { Logo } from './Logo';
import UserMenu from './UserMenu';
import ThemeSwitch from './ThemeSwitch';

const Header = () => {
	const collapseItems = ['Профиль', 'Настройки', 'Выйти'];

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
			<Navbar.Content
				enableCursorHighlight
				activeColor="secondary"
				hideIn="xs"
				variant="highlight"
			>
				<Navbar.Link href="#">Главная</Navbar.Link>
				<Navbar.Link isActive href="#">
					О нас
				</Navbar.Link>
			</Navbar.Content>
			<Navbar.Content css={{ '@xs': { w: '12%', jc: 'flex-end' } }}>
				<ThemeSwitch />
				<UserMenu />
			</Navbar.Content>
			<Navbar.Collapse>
				{collapseItems.map((item, index) => (
					<Navbar.CollapseItem
						key={item}
						activeColor="secondary"
						css={{ color: index === collapseItems.length - 1 ? '$error' : '' }}
						isActive={index === 2}
					>
						<Link color="inherit" css={{ minWidth: '100%' }} href="#">
							{item}
						</Link>
					</Navbar.CollapseItem>
				))}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
