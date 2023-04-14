import { createElement } from '../render.js';

const createTripInfoTemplate = () => (
  `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  </p>
</section>`
);

export default class TripInfoView {
  constructor() {
    this._element = null;
  }

  get template() {
    return createTripInfoTemplate();
  }

  get element() {
    this._element = this._element || createElement(this.template);
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}