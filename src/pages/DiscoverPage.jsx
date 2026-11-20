import { useSearchParams } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import ItemList from '../components/ItemList';
import Icon from '../components/Icon';

const suggestions = ['Океан Ельзи', 'Один в каное', 'ДахаБраха', 'The Hardkiss'];

export default function DiscoverPage() {
  const [parameters, setParameters] = useSearchParams();
  const query = parameters.get('q')?.trim() || 'Океан Ельзи';

  function handleSearch(value) {
    setParameters({ q: value });
  }

  return (
    <>
      <section className="discovery-hero">
        <div className="hero-copy">
          <p className="eyebrow">ЗВУЧИТЬ ПО-ТВОЄМУ</p>
          <h1>
            Знайди свій
            <br />
            <span>наступний ритм.</span>
          </h1>
          <p className="hero-description">
            Відкривай нові композиції, зберігай улюблене
            <br className="desktop-break" /> та збирай плейлисти під будь-який настрій.
          </p>
          <span className="hero-tag">
            <Icon name="music" />
            Музика, яку обираєш ти
          </span>
        </div>
        <div className="record-scene" aria-hidden="true">
          <div className="record-sleeve">
            <span>луна.</span>
            <div className="sleeve-wave" />
            <small>ТВІЙ ВЛАСНИЙ РИТМ</small>
          </div>
          <div className="vinyl-record">
            <div className="record-label">
              <Icon name="music" />
              <span>луна</span>
            </div>
          </div>
          <div className="floating-note">♫</div>
        </div>
      </section>
      <section className="search-section" aria-labelledby="search-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow muted">ВІДКРИВАЙ НОВЕ</p>
            <h2 id="search-heading">Що послухаємо сьогодні?</h2>
          </div>
          <span className="section-aside">Пошук у каталозі iTunes</span>
        </div>
        <SearchForm
          key={query}
          initialQuery={parameters.get('q') || ''}
          onSearch={handleSearch}
        />
        <div className="suggestions">
          <span>Спробуй:</span>
          {suggestions.map((suggestion) => {
            return (
              <button
                type="button"
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      </section>
      <section aria-labelledby="results-heading" className="results-section">
        <div className="section-heading">
          <h2 id="results-heading">
            {parameters.has('q') ? `Результати: «${query}»` : 'Українське звучання'}
          </h2>
          <span className="section-aside">Знайди те, що відгукується</span>
        </div>
        <ItemList query={query} />
      </section>
    </>
  );
}
