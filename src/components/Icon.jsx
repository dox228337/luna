const paths = {
  music:
    'M9 18V5l12-2v13M9 8l12-2M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Zm12-2a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  playlist: 'M4 5h16M4 11h10M4 17h7M19 12v9M15 17h8',
  plus: 'M12 5v14M5 12h14',
  clock: 'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  close: 'm6 6 12 12M6 18 18 6',
};

export default function Icon({ name, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.music} />
    </svg>
  );
}
