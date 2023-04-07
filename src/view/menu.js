import { createElement } from '../render.js';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
  <a class="trip-tabs__btn" href="#">Stats</a>
</nav>`
);

export default class MenuView {
  constructor() {
    this._element = null;
  }

  get template() {
    return createMenuTemplate();
  }

  get element() {
    this._element = this._element || createElement(this.template);
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
