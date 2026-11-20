export function formatDuration(milliseconds) {
  const seconds = Math.floor((milliseconds || 0) / 1000);
  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

export function validatePlaylist(values, playlists, currentId) {
  const name = values.name.trim();

  if (name.length < 2 || name.length > 60) {
    return 'Назва має містити від 2 до 60 символів.';
  }

  const duplicate = playlists.some((playlist) => {
    return (
      playlist.id !== currentId &&
      playlist.name.toLocaleLowerCase('uk') === name.toLocaleLowerCase('uk')
    );
  });

  if (duplicate) {
    return 'Плейлист із такою назвою вже існує.';
  }

  if (values.description.trim().length > 250) {
    return 'Опис має містити не більше 250 символів.';
  }

  return '';
}
