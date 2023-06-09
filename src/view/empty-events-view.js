import AbstractView from '../framework/view/abstract-view';
import { FILTER_TYPES } from '../utils.js';

const emptyListTextType = {
  [FILTER_TYPES.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPES.FUTURE]: 'There are no future events now',
  [FILTER_TYPES.PAST]: 'There are no past events now',
};

const createEmptyListTemplate = (filterType) => (
  `<p class="trip-events__msg">${emptyListTextType[filterType]}</p>`
);

export default class EmptyEventsView extends AbstractView {
  #filterType;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
