import { useAppSelector } from '@/redux/hooks';
import {
	useGenerateContentBasedRecsMutation,
	useGenerateItemBasedRecsMutation,
} from '@/redux/services/recommendations';
import { Modal, Button, Text, Radio, Loading } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface RecommendationOptionsModalProps {
	open: boolean;
	onClose: () => void;
}

const RecommendationOptionsModal = ({
	open,
	onClose,
}: RecommendationOptionsModalProps) => {
	const router = useRouter();

	const [checked, setChecked] = useState('item');

	const selected = useAppSelector(state => state.recommendations.selected);

	const [getItemBasedRec, { isLoading: isItemBasedLoading }] =
		useGenerateItemBasedRecsMutation();

	const [getContentBasedRec, { isLoading: isContentBasedLoading }] =
		useGenerateContentBasedRecsMutation();

	const handleCreateRecommendations = async () => {
		let res: any;
		switch (checked) {
			case 'item':
				res = await getItemBasedRec({
					search_words: selected,
					count: 10,
				});
				break;
			case 'content':
				res = await getContentBasedRec({
					search_words: selected,
					count: 10,
				});
				break;
		}

		setTimeout(() => {
			router.push(`/recommendations/${res.data.id}`);
		}, 1000);
	};

	return (
		<Modal
			closeButton
			aria-labelledby="modal-title"
			open={open}
			onClose={onClose}
		>
			<Modal.Header>
				<Text id="modal-title" size={18}>
					Выберите тип рекомендации
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Radio.Group
					orientation="horizontal"
					value={checked}
					onChange={setChecked}
				>
					<Radio value="item" color="primary">
						Item-Based
					</Radio>
					<Radio value="content" color="primary">
						Content-Based
					</Radio>
				</Radio.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={handleCreateRecommendations}
					disabled={!checked || isContentBasedLoading || isItemBasedLoading}
					auto
				>
					{isContentBasedLoading || isItemBasedLoading ? (
						<Loading color="currentColor" size="sm" />
					) : (
						'Сгенерировать'
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RecommendationOptionsModal;
