import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppRoutes } from '../App';
import { searchTracks } from '../services/musicApi';
import { STORAGE_KEY } from '../context/MusicContext';
import { tracks, playlist } from '../test/fixtures';
import { renderWithMusic } from '../test/renderWithMusic';

jest.mock('../services/musicApi');

beforeEach(() => {
  searchTracks.mockReset();
  searchTracks.mockResolvedValue(tracks);
});

test('оновлює результати після введення пошукового запиту', async () => {
  const user = userEvent.setup();
  renderWithMusic(<AppRoutes />);
  await screen.findByRole('heading', { name: 'Обійми' });
  searchTracks.mockResolvedValueOnce([tracks[1]]);

  await user.type(screen.getByRole('searchbox'), 'Один в каное');
  await user.click(screen.getByRole('button', { name: 'Знайти музику' }));

  expect(await screen.findByRole('heading', { name: 'Човен' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Обійми' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(searchTracks).toHaveBeenLastCalledWith('Один в каное', expect.any(AbortSignal));
});

test('не надсилає порожній пошуковий запит', async () => {
  const user = userEvent.setup();
  renderWithMusic(<AppRoutes />);
  await screen.findByRole('list');

  await user.click(screen.getByRole('button', { name: 'Знайти музику' }));

  expect(screen.getByRole('alert')).toHaveTextContent('Введіть щонайменше 2 символи');
  expect(searchTracks).toHaveBeenCalledTimes(1);
});

test('читає пошуковий запит з адреси сторінки', async () => {
  renderWithMusic(<AppRoutes />, { route: '/?q=ДахаБраха' });

  await screen.findByRole('list');

  expect(screen.getByRole('searchbox')).toHaveValue('ДахаБраха');
  expect(searchTracks).toHaveBeenCalledWith('ДахаБраха', expect.any(AbortSignal));
});

test('показує збережене обране після повторного монтування застосунку', async () => {
  const user = userEvent.setup();
  const view = renderWithMusic(<AppRoutes />);

  await user.click(
    await screen.findByRole('button', { name: 'Додати до обраного: Обійми' }),
  );
  view.unmount();
  renderWithMusic(<AppRoutes />, { route: '/favorites' });

  expect(screen.getByRole('heading', { name: 'Обійми' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Обране' })).toBeInTheDocument();
});

test('створює плейлист, редагує його та підтверджує видалення', async () => {
  const user = userEvent.setup();
  renderWithMusic(<AppRoutes />, { route: '/playlists' });

  await user.click(screen.getByRole('button', { name: 'Новий плейлист' }));
  await user.type(screen.getByLabelText(/Назва плейлиста/), 'Ранкова кава');
  await user.type(screen.getByLabelText('Опис'), 'Для гарного початку дня');
  await user.click(screen.getByRole('button', { name: 'Створити', exact: true }));

  expect(
    screen.getByRole('heading', { level: 1, name: 'Ранкова кава' }),
  ).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).playlists).toHaveLength(1);

  await user.click(screen.getByRole('button', { name: 'Редагувати', exact: true }));
  await user.clear(screen.getByLabelText(/Назва плейлиста/));
  await user.type(screen.getByLabelText(/Назва плейлиста/), 'Тихий ранок');
  await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

  expect(
    screen.getByRole('heading', { level: 1, name: 'Тихий ранок' }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Видалити плейлист' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Відновити його буде неможливо');
  await user.click(screen.getByRole('button', { name: 'Скасувати видалення' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Видалити плейлист' }));
  await user.click(screen.getByRole('button', { name: 'Так, видалити' }));

  expect(
    screen.getByRole('heading', { level: 1, name: 'Мої плейлисти' }),
  ).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).playlists).toHaveLength(0);
});

test('переносить композицію з пошуку в плейлист і видаляє її з добірки', async () => {
  const user = userEvent.setup();
  renderWithMusic(<AppRoutes />, {
    library: { favorites: [], playlists: [playlist] },
  });

  await user.click(
    await screen.findByRole('button', { name: 'Додати до плейлиста: Обійми' }),
  );
  await user.click(screen.getByRole('button', { name: 'Додати', exact: true }));
  await user.click(screen.getByRole('link', { name: playlist.name }));

  expect(screen.getByRole('heading', { name: 'Обійми' })).toBeInTheDocument();
  expect(screen.getByText(/Загальна тривалість: 3:45/)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Видалити з плейлиста: Обійми' }));

  expect(screen.queryByRole('list')).not.toBeInTheDocument();
  expect(screen.getByText('Додай першу композицію')).toBeInTheDocument();
});

test('показує картку створеного плейлиста в бібліотеці', () => {
  renderWithMusic(<AppRoutes />, {
    route: '/playlists',
    library: { favorites: [], playlists: [playlist] },
  });

  const main = screen.getByRole('main');
  expect(within(main).getByRole('heading', { name: playlist.name })).toBeInTheDocument();
  expect(within(main).getByText('Композицій: 0')).toBeInTheDocument();
});

test('обробляє відсутній плейлист', () => {
  renderWithMusic(<AppRoutes />, { route: '/playlists/missing' });

  expect(screen.getByText('Плейлист не знайдено')).toBeInTheDocument();
});

test('показує сторінку для невідомого маршруту', () => {
  renderWithMusic(<AppRoutes />, { route: '/unknown-page' });

  expect(screen.getByText('Ця сторінка загубила ритм')).toBeInTheDocument();
});

test('не падає через пошкоджені дані LocalStorage', () => {
  localStorage.setItem(STORAGE_KEY, '{пошкоджені дані');
  renderWithMusic(<AppRoutes />, { route: '/favorites' });

  expect(screen.getByText('Тут буде твоя улюблена музика')).toBeInTheDocument();
});

test('відкидає пошкоджені композиції та залишає коректні збережені дані', () => {
  renderWithMusic(<AppRoutes />, {
    route: '/favorites',
    library: {
      favorites: [tracks[0], null, { ...tracks[1], album: { invalid: true } }],
      playlists: [null, playlist],
    },
  });

  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: 'Обійми' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).playlists).toHaveLength(1);
});

test('попереджає про недоступне сховище та залишає інтерфейс доступним', () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Сховище переповнене');
  });

  renderWithMusic(<AppRoutes />, { route: '/favorites' });

  expect(screen.getByRole('alert')).toHaveTextContent('Не вдалося зберегти зміни');
  expect(screen.getByRole('heading', { level: 1, name: 'Обране' })).toBeInTheDocument();
});
