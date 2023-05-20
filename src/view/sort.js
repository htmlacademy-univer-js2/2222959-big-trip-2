import AbstractView from '../framework/view/abstract-view';
import { SORT_TYPES } from '../utils.js';

const createSortTemplate = (sortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SORT_TYPES.DEFAULT}" ${sortType === SORT_TYPES.DEFAULT ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-day">Day</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SORT_TYPES.TIME}" ${sortType === SORT_TYPES.PRICE ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-time">Time</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SORT_TYPES.PRICE}" ${sortType === SORT_TYPES.PRICE ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-price">Price</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`
);

export default class SortView extends AbstractView {
  #sortType;

  constructor(sortType) {
    super();
    this.#sortType = sortType;
  }

  get template() {
    return createSortTemplate(this.#sortType);
  }

  setSortHandler = (callback) => {
    this._callback.sort = callback;
    this.element.addEventListener('click', this.#sortHandler);
  };

  #sortHandler = (e) => {
    if (e.target.type !== 'radio') {
      return;
    }
    e.preventDefault();
    this._callback.sort(e.target.dataset.sortType);
  };
}
