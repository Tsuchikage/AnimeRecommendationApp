import { Button, SwitchEvent } from '@nextui-org/react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme as useNextTheme } from 'next-themes';
import { Switch, useTheme } from '@nextui-org/react';

const ThemeSwitch = () => {
	const { setTheme } = useNextTheme();
	const { isDark } = useTheme();

	// const handleThemeSwitch = (e: SwitchEvent) => {
	// 	setTheme(e.target.checked ? 'dark' : 'light');
	// };

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
		/>
	);

	// return (
	// 	<Switch
	// 		checked={isDark}
	// 		onChange={handleThemeSwitch}
	// 		size="sm"
	// 		color="secondary"
	// 		iconOn={<FiSun />}
	// 		iconOff={<FiMoon />}
	// 	/>
	// );
};

export default ThemeSwitch;
