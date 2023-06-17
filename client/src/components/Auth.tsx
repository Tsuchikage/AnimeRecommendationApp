import { Button, Input, Row, Spacer, Text, Loading } from '@nextui-org/react';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { useLoginMutation, useRegisterMutation } from '@/redux/services/auth';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

interface FormValues {
	username: string;
	password: string;
}

const Auth = () => {
	const router = useRouter();

	const [type, setStype] = useState<'login' | 'register'>('login');

	const [login, { isLoading: isLoggingIn, isError: isLoginError }] =
		useLoginMutation();
	const [signUp, { isLoading: isRegistering, isError: isRegisterError }] =
		useRegisterMutation();

	const { register, handleSubmit } = useForm<FormValues>({
		defaultValues: { username: '', password: '' },
	});

	const handleOnSubmit = async (values: FormValues) => {
		if (type === 'register') {
			// @ts-ignore
			await signUp(values);
			await login(values);
			router.replace(`/`);
		} else {
			await login(values);
			router.replace('/');
		}
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			<Text
				h1
				size={32}
				css={{
					textGradient: '45deg, $blue600 -20%, $pink600 100%',
					alignSelf: 'center',
				}}
				weight="bold"
			>
				{type === 'register' ? 'Регистрация' : 'Вход'}
			</Text>
			<form
				style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
				onSubmit={handleSubmit(handleOnSubmit)}
			>
				<Input
					aria-label="username"
					placeholder="Имя пользователя"
					fullWidth
					{...register('username')}
				/>
				<Input.Password
					aria-label="password"
					placeholder="Пароль"
					visibleIcon={<FiEye fill="currentColor" />}
					hiddenIcon={<FiEyeOff fill="currentColor" />}
					fullWidth
					{...register('password')}
				/>
				{type === 'register' ? (
					<Text
						onClick={() => setStype('login')}
						size="$sm"
						color="primary"
						style={{ cursor: 'pointer' }}
					>
						Уже есть аккаунт? Войти
					</Text>
				) : (
					<Text
						onClick={() => setStype('register')}
						size="$sm"
						color="primary"
						style={{ cursor: 'pointer' }}
					>
						Нет аккаунт? Зарегистрироваться
					</Text>
				)}
				<Row justify="flex-end">
					{type === 'register' ? (
						<Button type="submit" size="sm" shadow>
							{!isRegistering ? (
								'Создать аккаунт'
							) : (
								<Loading color="currentColor" size="sm" />
							)}
						</Button>
					) : (
						<Button type="submit" size="sm" shadow>
							{!isLoggingIn ? (
								'Войти'
							) : (
								<Loading color="currentColor" size="sm" />
							)}
						</Button>
					)}
				</Row>
			</form>
		</div>
	);
};

export default Auth;
