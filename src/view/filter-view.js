import AbstractView from '../framework/view/abstract-view';

const createFilterEvents = ({ type, name, count }, filterType) =>
  `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden"
      type="radio" name="trip-filter" value="${name}" ${type === filterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`;

const createFilterTemplate = (items, filterType) => {
  const events = items.reduce((result, filter) => result.concat(createFilterEvents(filter, filterType)), '');
  return (
    `<form class="trip-filters" action="#" method="get">
      ${events}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters;
  #currentFilter;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setChangeHandler = (callback) => {
    this._callback.change = callback;
    this.element.addEventListener('change', this.#changeHandler);
  };

  #changeHandler = (event) => {
    event.preventDefault();
    this._callback.change(event.target.value);
  };
}
