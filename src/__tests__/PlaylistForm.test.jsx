import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlaylistForm from '../components/PlaylistForm';
import { renderWithMusic } from '../test/renderWithMusic';
import { playlist } from '../test/fixtures';

test('відхиляє порожню назву плейлиста', async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();
  renderWithMusic(<PlaylistForm onSave={onSave} onCancel={jest.fn()} />);

  await user.click(screen.getByRole('button', { name: 'Створити', exact: true }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Назва має містити від 2 до 60 символів.',
  );
  expect(onSave).not.toHaveBeenCalled();
});

test('не дозволяє однакові назви незалежно від регістру', async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();
  renderWithMusic(<PlaylistForm onSave={onSave} onCancel={jest.fn()} />, {
    library: { favorites: [], playlists: [playlist] },
  });

  await user.type(screen.getByLabelText(/Назва плейлиста/), '  ВЕЧІРНЄ МІСТО  ');
  await user.click(screen.getByRole('button', { name: 'Створити', exact: true }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Плейлист із такою назвою вже існує.',
  );
  expect(onSave).not.toHaveBeenCalled();
});

test('зберігає поточну назву під час редагування та обрізає зайві пробіли', async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();
  renderWithMusic(
    <PlaylistForm playlist={playlist} onSave={onSave} onCancel={jest.fn()} />,
    {
      library: { favorites: [], playlists: [playlist] },
    },
  );

  await user.clear(screen.getByLabelText('Опис'));
  await user.type(screen.getByLabelText('Опис'), '  Новий опис  ');
  await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

  expect(onSave).toHaveBeenCalledWith({ name: playlist.name, description: 'Новий опис' });
});

test('викликає скасування без збереження даних', async () => {
  const user = userEvent.setup();
  const onCancel = jest.fn();
  const onSave = jest.fn();
  renderWithMusic(<PlaylistForm onSave={onSave} onCancel={onCancel} />);

  await user.click(screen.getByRole('button', { name: 'Скасувати' }));

  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onSave).not.toHaveBeenCalled();
});
