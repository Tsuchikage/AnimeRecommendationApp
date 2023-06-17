import { useAppDispatch } from '@/redux/hooks';
import { logOut } from '@/redux/slices/authSlice';
import { Navbar, Avatar, Dropdown } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const UserMenu = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleLogout = (key: string) => {
		if (key === 'logout') {
			dispatch(logOut());
			router.replace('/auth');
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
						src="https://storage.yandexcloud.net/anime/avatar_empty.webp"
					/>
				</Dropdown.Trigger>
			</Navbar.Item>
			<Dropdown.Menu
				aria-label="User menu actions"
				color="secondary"
				onAction={actionKey => handleLogout(actionKey as string)}
				disabledKeys={['profile', 'settings']}
			>
				<Dropdown.Item key="profile">Профиль</Dropdown.Item>
				<Dropdown.Item key="settings">Настройки</Dropdown.Item>
				<Dropdown.Item key="logout" withDivider color="error">
					Выйти
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default UserMenu;
