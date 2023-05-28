import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelected } from '@/redux/slices/recommendations';
import { Button, Modal, Table, Text } from '@nextui-org/react';
import { useState } from 'react';

interface AnimeSelectedListProps {
	open: boolean;
	onClose: () => void;
}

const AnimeSelectedModal = ({ open, onClose }: AnimeSelectedListProps) => {
	const [list, setList] = useState<any>([]);

	const selected = useAppSelector(state => state.recommendations.selected);
	const dispatch = useAppDispatch();

	const handleRemoveSelected = () => {
		if (list === 'all') {
			dispatch(setSelected([]));
		} else {
			const toRemove: string[] = Array.from(list);
			dispatch(setSelected(selected.filter(el => !toRemove.includes(el))));
		}
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
					Выбранные аниме
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Table
					aria-label="Example static collection table with multiple selection"
					css={{
						height: 'auto',
						minWidth: '100%',
					}}
					selectionMode="multiple"
					color="secondary"
					compact
					onSelectionChange={setList}
					selectedKeys={list}
				>
					<Table.Header>
						<Table.Column>НАЗВАНИЕ</Table.Column>
					</Table.Header>
					<Table.Body>
						{selected.map(anime => (
							<Table.Row key={anime}>
								<Table.Cell>{anime}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button
					disabled={list && (list.size <= 0 || selected.length === 0)}
					auto
					flat
					color="error"
					onPress={handleRemoveSelected}
				>
					Удалить выбранное
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AnimeSelectedModal;
