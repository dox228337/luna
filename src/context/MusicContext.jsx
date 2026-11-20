import { createContext, useContext, useEffect, useReducer, useState } from 'react';

export const STORAGE_KEY = 'luna-music-library-v1';
const MusicContext = createContext(null);

function isTrack(track) {
  return (
    track !== null &&
    typeof track === 'object' &&
    typeof track.id === 'string' &&
    typeof track.title === 'string' &&
    typeof track.artist === 'string' &&
    typeof track.album === 'string' &&
    typeof track.artwork === 'string' &&
    typeof track.url === 'string' &&
    Number.isFinite(track.duration) &&
    track.duration >= 0
  );
}

function initialLibrary() {
  const emptyLibrary = { favorites: [], playlists: [] };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return emptyLibrary;
    }

    const library = JSON.parse(saved);

    if (!Array.isArray(library.favorites) || !Array.isArray(library.playlists)) {
      return emptyLibrary;
    }

    return {
      favorites: library.favorites.filter(isTrack),
      playlists: library.playlists
        .filter((playlist) => {
          return (
            playlist !== null &&
            typeof playlist.id === 'string' &&
            typeof playlist.name === 'string' &&
            typeof playlist.description === 'string' &&
            Array.isArray(playlist.tracks)
          );
        })
        .map((playlist) => {
          return { ...playlist, tracks: playlist.tracks.filter(isTrack) };
        }),
    };
  } catch {
    return emptyLibrary;
  }
}

function libraryReducer(state, action) {
  switch (action.type) {
    case 'toggle-favorite': {
      const exists = state.favorites.some((track) => track.id === action.track.id);
      let favorites;

      if (exists) {
        favorites = state.favorites.filter((track) => track.id !== action.track.id);
      } else {
        favorites = [...state.favorites, action.track];
      }

      return { ...state, favorites };
    }
    case 'create-playlist':
      return { ...state, playlists: [...state.playlists, action.playlist] };
    case 'update-playlist':
      return {
        ...state,
        playlists: state.playlists.map((playlist) => {
          if (playlist.id === action.id) {
            return { ...playlist, ...action.values };
          }

          return playlist;
        }),
      };
    case 'delete-playlist':
      return {
        ...state,
        playlists: state.playlists.filter((playlist) => playlist.id !== action.id),
      };
    case 'add-track':
      return {
        ...state,
        playlists: state.playlists.map((playlist) => {
          const alreadyAdded = playlist.tracks.some(
            (track) => track.id === action.track.id,
          );

          if (playlist.id === action.id && !alreadyAdded) {
            return { ...playlist, tracks: [...playlist.tracks, action.track] };
          }

          return playlist;
        }),
      };
    case 'remove-track':
      return {
        ...state,
        playlists: state.playlists.map((playlist) => {
          if (playlist.id === action.id) {
            return {
              ...playlist,
              tracks: playlist.tracks.filter((track) => track.id !== action.trackId),
            };
          }

          return playlist;
        }),
      };
    default:
      return state;
  }
}

export function MusicProvider({ children }) {
  const [library, dispatch] = useReducer(libraryReducer, undefined, initialLibrary);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
      setStorageError('');
    } catch {
      setStorageError(
        'Не вдалося зберегти зміни. Перевірте, чи доступне сховище браузера.',
      );
    }
  }, [library]);

  function toggleFavorite(track) {
    dispatch({ type: 'toggle-favorite', track });
  }

  function createPlaylist(values) {
    const id = crypto.randomUUID();
    const playlist = { id, ...values, tracks: [] };

    dispatch({ type: 'create-playlist', playlist });
    return id;
  }

  function updatePlaylist(id, values) {
    dispatch({ type: 'update-playlist', id, values });
  }

  function deletePlaylist(id) {
    dispatch({ type: 'delete-playlist', id });
  }

  function addTrack(id, track) {
    dispatch({ type: 'add-track', id, track });
  }

  function removeTrack(id, trackId) {
    dispatch({ type: 'remove-track', id, trackId });
  }

  const value = {
    ...library,
    storageError,
    toggleFavorite,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrack,
    removeTrack,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error('Компонент має бути всередині MusicProvider.');
  }

  return context;
}
