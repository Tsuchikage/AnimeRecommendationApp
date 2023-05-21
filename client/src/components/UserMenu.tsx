import { Navbar, Avatar, Dropdown } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const UserMenu = () => {
	const router = useRouter();

	const handleLogout = (key: string) => {
		if (key === 'logout') {
			console.log('Logging out...');
		} else return;
	};

	return (
		<Dropdown placement="bottom-right">
			<Navbar.Item>
				<Dropdown.Trigger>
					<Avatar
						bordered
						as="button"
						color="secondary"
						size="md"
						src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					/>
				</Dropdown.Trigger>
			</Navbar.Item>
			<Dropdown.Menu
				aria-label="User menu actions"
				color="secondary"
				onAction={actionKey => handleLogout(actionKey as string)}
			>
				<Dropdown.Item key="profile">
					<Link href="/profile">Профиль</Link>
				</Dropdown.Item>
				<Dropdown.Item key="settings">
					<Link href="/settings">Настройки</Link>
				</Dropdown.Item>
				<Dropdown.Item key="logout" withDivider color="error">
					Выйти
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default UserMenu;
