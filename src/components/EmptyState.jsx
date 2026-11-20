import Icon from './Icon';

export default function EmptyState({ title, children, icon = 'music' }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} />
      </span>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
