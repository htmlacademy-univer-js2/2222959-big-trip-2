import AbstractView from '../framework/view/abstract-view';
import { addDestinationName, addOffersPrices } from '../utils.js';
import dayjs from 'dayjs';

const tripDestinationNames = (events) => {
  const destinationNames = events.map((event) => event.destinationName);
  switch (destinationNames.length) {
    case 1:
      return `${destinationNames[0]}`;
    case 2:
      return `${destinationNames[0]} &mdash; ${destinationNames[1]}`;
    case 3:
      return `${destinationNames[0]} &mdash; ${destinationNames[1]} &mdash; ${destinationNames[2]}`;
    default:
      return `${destinationNames[0]} &mdash; ... &mdash;${destinationNames[destinationNames.length - 1]}`;
  }
};

const totalPrice = (events) =>
  events.reduce((total, { basePrice, offerPrices }) =>
    total + basePrice + offerPrices, 0);

const tripDates = (events) => {
  const startTripDate = events[0].dataFrom;
  const endTripDate = events[events.length - 1].dateTo;

  if (dayjs(startTripDate).month() === dayjs(endTripDate).month()) {
    return `${dayjs(startTripDate).format('MMM D')}&nbsp;&mdash;&nbsp;${dayjs(endTripDate).format('DD')}`;
  }

  return `${dayjs(startTripDate).format('MMM D')}&nbsp;&mdash;&nbsp;${dayjs(endTripDate).format('MMM D')}`;
};

const createTripInfoTemplate = (events, offers, destinations) => {
  const tripEvents = events.map((event) => ({
    ...event,
    offerPrices: addOffersPrices(event.type, event.offers, offers),
    destinationName: addDestinationName(event.destination, destinations)
  }));
  
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${tripDestinationNames(tripEvents)}</h1>
              <p class="trip-info__dates">${tripDates(tripEvents)}</p>
            </div>
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice(tripEvents)}</span>
            </p>
          </section>`;
};

export default class TripInfoView extends AbstractView {
  #events = null;
  #offers = null;
  #destinations = null;

  constructor(events, offers, destinations) {
    super();
    this.#events = events;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#offers, this.#destinations);
  }
}
