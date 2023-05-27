import { useGetUserQuery } from '../redux/services/user';

interface UseUserProps {
	skip?: boolean;
}

export const useUser = ({ skip = false }: UseUserProps = {}) => {
	const { data, isLoading, error } = useGetUserQuery(undefined, { skip });
	return { user: data, isLoading, isError: error };
};
