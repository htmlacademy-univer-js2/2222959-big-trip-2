import { render, remove, replace } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { filter, FILTER_TYPES, UPDATE_TYPES } from '../utils.js';

export default class FilterPresenter {
  #filterContainer;
  #filterModel;
  #eventsModel;
  #filterComponent;

  constructor(filterContainer, filterModel, eventsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const events = this.#eventsModel.events;

    return [
      {
        type: FILTER_TYPES.EVERYTHING,
        name: 'everything',
        count: filter[FILTER_TYPES.EVERYTHING](events).length,
      },
      {
        type: FILTER_TYPES.FUTURE,
        name: 'future',
        count: filter[FILTER_TYPES.FUTURE](events).length,
      },
      {
        type: FILTER_TYPES.PAST,
        name: 'past',
        count: filter[FILTER_TYPES.PAST](events).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const previousFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setChangeHandler(this.#filterChangeHandler);

    if (!previousFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  };

  #modelEventHandler = () => {
    this.init();
  };

  #filterChangeHandler = (type) => {
    if (this.#filterModel.filter === type) {
      return;
    }

    this.#filterModel.setFilter(UPDATE_TYPES.MAJOR, type);
  };
}
