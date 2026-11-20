import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemList from '../components/ItemList';
import { searchTracks } from '../services/musicApi';
import { renderWithMusic } from '../test/renderWithMusic';
import { tracks } from '../test/fixtures';

jest.mock('../services/musicApi');

beforeEach(() => {
  searchTracks.mockReset();
  searchTracks.mockResolvedValue(tracks);
});

test('рендерить список без помилок та показує п’ять композицій', async () => {
  renderWithMusic(<ItemList />);

  const list = await screen.findByRole('list', { name: 'Список композицій' });

  expect(within(list).getAllByRole('listitem')).toHaveLength(5);
  expect(screen.getByRole('heading', { name: 'Обійми' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Світанок' })).toBeInTheDocument();
});

test('показує «Завантаження...» до завершення асинхронного запиту', async () => {
  let resolveRequest;
  searchTracks.mockImplementationOnce(() => {
    return new Promise((resolve) => {
      resolveRequest = resolve;
    });
  });

  renderWithMusic(<ItemList />);

  expect(screen.getByRole('status')).toHaveTextContent('Завантаження...');
  expect(screen.queryByRole('list')).not.toBeInTheDocument();

  await act(async () => {
    resolveRequest(tracks);
  });

  expect(await screen.findByRole('list')).toBeInTheDocument();
  expect(screen.queryByText('Завантаження...')).not.toBeInTheDocument();
});

test('показує повідомлення про помилку сервера', async () => {
  searchTracks.mockRejectedValueOnce(new Error('Помилка сервера'));

  renderWithMusic(<ItemList />);

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Помилка завантаження даних',
  );
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

test('повторно завантажує композиції після помилки', async () => {
  const user = userEvent.setup();
  searchTracks.mockRejectedValueOnce(new Error('Немає з’єднання'));

  renderWithMusic(<ItemList />);
  await user.click(await screen.findByRole('button', { name: 'Спробувати ще раз' }));

  expect(await screen.findByRole('list')).toBeInTheDocument();
  expect(searchTracks).toHaveBeenCalledTimes(2);
});

test('пояснює, що за запитом немає результатів', async () => {
  searchTracks.mockResolvedValueOnce([]);

  renderWithMusic(<ItemList query="Невідома композиція" />);

  expect(await screen.findByText('Нічого не знайдено')).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

test('не замінює нові результати запізнілою відповіддю попереднього запиту', async () => {
  let resolveOldRequest;
  searchTracks.mockImplementationOnce(() => {
    return new Promise((resolve) => {
      resolveOldRequest = resolve;
    });
  });
  searchTracks.mockResolvedValueOnce([tracks[1]]);

  const view = renderWithMusic(<ItemList query="Старий запит" />);
  view.rerender(<ItemList query="Новий запит" />);

  expect(await screen.findByRole('heading', { name: 'Човен' })).toBeInTheDocument();

  await act(async () => {
    resolveOldRequest([tracks[0]]);
  });

  expect(screen.queryByRole('heading', { name: 'Обійми' })).not.toBeInTheDocument();
});

test('скасовує запит і показує помилку після 15 секунд очікування', async () => {
  jest.useFakeTimers();
  searchTracks.mockImplementationOnce((query, signal) => {
    return new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => {
        reject(new DOMException('Запит скасовано', 'AbortError'));
      });
    });
  });

  const view = renderWithMusic(<ItemList />);

  try {
    expect(screen.getByRole('status')).toHaveTextContent('Завантаження...');

    await act(async () => {
      jest.advanceTimersByTime(15000);
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Помилка завантаження даних');
    expect(searchTracks.mock.calls[0][1].aborted).toBe(true);
  } finally {
    view.unmount();
    jest.useRealTimers();
  }
});
