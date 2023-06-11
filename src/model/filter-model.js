import Observable from '../framework/observable.js';
import { FILTER_TYPES } from '../utils.js';

export default class FilterModel extends Observable {
  #filter = FILTER_TYPES.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter = (type, filter) => {
    this.#filter = filter;
    this._notify(type, filter);
  };
}
