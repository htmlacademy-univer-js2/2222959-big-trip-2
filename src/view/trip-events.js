import AbstractView from '../framework/view/abstract-view';

const createTripEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripEventsView extends AbstractView {

  get template() {
    return createTripEventsTemplate();
  }
}
