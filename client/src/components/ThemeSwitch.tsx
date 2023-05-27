import { Button } from '@nextui-org/react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme as useNextTheme } from 'next-themes';
import { useTheme } from '@nextui-org/react';

const ThemeSwitch = () => {
	const { setTheme } = useNextTheme();
	const { isDark } = useTheme();

	const handleThemeSwitch = () => {
		setTheme(isDark ? 'light' : 'dark');
	};

	return (
		<Button
			onClick={handleThemeSwitch}
			color="secondary"
			icon={isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
			auto
			flat
			style={{ flex: 'none' }}
		/>
	);
};

export default ThemeSwitch;
