import AbstractView from '../framework/view/abstract-view';
import { addDestinationName, addOffersPrices } from '../utils.js';
import dayjs from 'dayjs';

const tripDestinationNames = (events) => {
  const tripDestinationName = events.map((event) => event.destinationName);
  const uniqueNames = Array.from(new Set(tripDestinationName));
  switch (uniqueNames.length) {
    case 1:
      return `${uniqueNames[0]}`;
    case 2:
      return `${uniqueNames[0]} &mdash; ${uniqueNames[1]}`;
    case 3:
      return `${uniqueNames[0]} &mdash; ${uniqueNames[1]} &mdash; ${uniqueNames[2]}`;
    default:
      return `${uniqueNames[0]} &mdash; ... &mdash;${uniqueNames[uniqueNames.length - 1]}`;
  }

};

const totalPrice = (events) => {
  const totalBasePrice = events.reduce((total, event) => total + event.basePrice, 0);
  const totalOffersPrice = events.reduce((total, event) => total + event.offerPrices, 0);

  return totalBasePrice + totalOffersPrice;
};

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
