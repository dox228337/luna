import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MusicProvider, STORAGE_KEY } from '../context/MusicContext';

export function renderWithMusic(element, { route = '/', library } = {}) {
  if (library) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }

  function Providers({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <MusicProvider>{children}</MusicProvider>
      </MemoryRouter>
    );
  }

  return render(element, { wrapper: Providers });
}
