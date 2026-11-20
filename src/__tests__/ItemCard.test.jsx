import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemCard from '../components/ItemCard';
import { STORAGE_KEY } from '../context/MusicContext';
import { renderWithMusic } from '../test/renderWithMusic';
import { playlist, tracks } from '../test/fixtures';

test('структура картки відповідає збереженому snapshot', () => {
  const { asFragment } = renderWithMusic(
    <ul>
      <ItemCard track={tracks[0]} index={0} />
    </ul>,
  );

  expect(asFragment()).toMatchSnapshot();
});

test('додає композицію до обраного та видаляє її повторним натисканням', async () => {
  const user = userEvent.setup();
  renderWithMusic(
    <ul>
      <ItemCard track={tracks[0]} index={0} />
    </ul>,
  );

  await user.click(screen.getByRole('button', { name: 'Додати до обраного: Обійми' }));

  expect(
    screen.getByRole('button', { name: 'Видалити з обраного: Обійми' }),
  ).toHaveAttribute('aria-pressed', 'true');
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).favorites).toHaveLength(1);

  await user.click(screen.getByRole('button', { name: 'Видалити з обраного: Обійми' }));

  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).favorites).toHaveLength(0);
});

test('додає композицію до вибраного плейлиста без дублікатів', async () => {
  const user = userEvent.setup();
  renderWithMusic(
    <ul>
      <ItemCard track={tracks[0]} index={0} />
    </ul>,
    {
      library: { favorites: [], playlists: [playlist] },
    },
  );

  await user.click(screen.getByRole('button', { name: 'Додати до плейлиста: Обійми' }));
  expect(screen.getByRole('combobox', { name: 'Плейлист' })).toHaveValue(playlist.id);
  await user.click(screen.getByRole('button', { name: 'Додати', exact: true }));

  expect(screen.getByRole('status')).toHaveTextContent('Композицію додано до плейлиста.');
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).playlists[0].tracks).toHaveLength(
    1,
  );

  await user.click(screen.getByRole('button', { name: 'Додати до плейлиста: Обійми' }));

  expect(screen.getByText(/Композиція вже є в усіх плейлистах/)).toBeInTheDocument();
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
});

test('пропонує створити плейлист, якщо бібліотека порожня', async () => {
  const user = userEvent.setup();
  renderWithMusic(
    <ul>
      <ItemCard track={tracks[0]} index={0} />
    </ul>,
  );

  await user.click(screen.getByRole('button', { name: 'Додати до плейлиста: Обійми' }));

  expect(screen.getByText(/Спочатку створіть плейлист/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Перейти до плейлистів' })).toHaveAttribute(
    'href',
    '/playlists',
  );
});

test('посилання на джерело належить відповідній композиції', () => {
  renderWithMusic(
    <ul>
      <ItemCard track={tracks[0]} index={0} />
    </ul>,
  );

  const card = screen.getByRole('listitem');
  expect(within(card).getByRole('link')).toHaveAttribute('href', tracks[0].url);
  expect(within(card).getByText('3:45')).toBeInTheDocument();
});
