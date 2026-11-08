import './FilterBar.css';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To watch' },
  { value: 'watched', label: 'Watched' },
];

function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter movies">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          className={filter === f.value ? 'filter-bar__button active' : 'filter-bar__button'}
          aria-pressed={filter === f.value}
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
