import Icon from './Icon';
import ItemCard from './ItemCard';

export default function TrackList({ tracks, playlistId }) {
  return (
    <div className={`track-list ${playlistId ? 'editable-track-list' : ''}`}>
      <div className="track-list-heading" aria-hidden="true">
        <span>№</span>
        <span className="composition-heading">КОМПОЗИЦІЯ</span>
        <span className="album-heading">АЛЬБОМ</span>
        <Icon name="clock" />
        <span />
      </div>
      <ul className="tracks" aria-label="Список композицій">
        {tracks.map((track, index) => {
          return (
            <ItemCard
              key={track.id}
              track={track}
              index={index}
              playlistId={playlistId}
            />
          );
        })}
      </ul>
    </div>
  );
}
