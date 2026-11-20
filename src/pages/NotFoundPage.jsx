import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFoundPage() {
  return (
    <EmptyState title="Ця сторінка загубила ритм">
      <p>Сторінку за цією адресою не знайдено.</p>
      <Link className="button primary" to="/">
        На головну
      </Link>
    </EmptyState>
  );
}
