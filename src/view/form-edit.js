import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { DESTINATION_NAMES, destinations, OFFERS, offersByType } from '../mock/point';
import { getDateTime, isSubmitDisabledByDate, isSubmitDisabledByPrice, NEW_POINT } from '../utils';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


const createDestionationsOptionsTemplate = (destins) =>
  destins.reduce((result, destin) =>
    result.concat(`<option value="${destin}"></option>\n`), '');

const renderDestinationPictures = (pictures) => pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const renderOffers = (offers, type) => {
  const availableOffers = offersByType.find((item) => (item.type === type)).offers;
  const allOffers = availableOffers.map((offer) => OFFERS.find((item) => item.id === offer.id));

  return allOffers.reduce((result, offer) => result.concat(
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-${offer.id}" 
        type="checkbox" name="event-offer-${offer.title.split(' ').pop()}"  ${offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  ), '');
};

const createEditingFormTemplate = ({ destination, type, basePrice, dateFrom, dateTo, offers }) =>
  `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">selectedDestination
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations[destination].name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestionationsOptionsTemplate(DESTINATION_NAMES)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}">
                  </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabledByDate(dateFrom, dateTo) ? '' : 'disabled'} ${isSubmitDisabledByPrice(basePrice) ? '' : 'disabled'}>Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${renderOffers(offers, type)}
            </div>
          </section>
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinations[destination].description}</p>
            <div class="event__photos-container">
                        <div class="event__photos-tape">
                        ${renderDestinationPictures(destinations[destination].pictures)}
                        </div>
                      </div>
          </section>
        </section>
      </form>
  </li>`;

export default class EditingFormView extends AbstractStatefulView {
  #startDatepicker;
  #stopDatepicker;

  constructor(event = NEW_POINT) {
    super();
    this._state = EditingFormView.parseEvent(event);
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setStopDatepicker(this._state.startDate);
  }

  get template () {
    return createEditingFormTemplate(this._state);
  }

  reset = (event) =>  this.updateElement(EditingFormView.parseEvent(event));

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSaveHandler(this._callback.save);
    this.setRollDownHandler(this._callback.rollDown);
    this.#setStartDatepicker();
    this.#setStopDatepicker();
    this.setDeleteHandler(this._callback.deleteClick);
  };

  #setStartDatepicker = () => {
    this.#startDatepicker = flatpickr(
      this.element.querySelector('[name = "event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        onChange: this.#startDateChangeHandler
      },
    );
  };

  setDeleteHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  };

  #deleteHandler = (event) => {
    event.preventDefault();
    this._callback.deleteClick(EditingFormView.parseState(this._state));
  };

  #startDateChangeHandler = ([userStartDate]) => {
    this.updateElement({
      startDate: userStartDate,
    });
  };

  #setStopDatepicker = () => {
    const startDate = this._state.dateFrom;
    this.#stopDatepicker = flatpickr(
      this.element.querySelector('[name = "event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        onChange: this.#endDateChangeHandler,
        disable: [
          function (date) {
            return date < startDate;
          }
        ]
      },
    );
  };

  #endDateChangeHandler = ([userEndDate]) => {
    this.updateElement({
      endDate: userEndDate,
    });
  };

  setRollDownHandler = (callback) => {
    this._callback.rollDown = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollDownHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeToggleHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerToggleHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceToggleHandler);
  };

  #priceToggleHandler = (e) => {
    e.preventDefault();
    this.updateElement({
      basePrice: e.target.value
    });
  };

  #destinationToggleHandler = (e) => {
    e.preventDefault();
    if (e.rarget.value !== '') {
      const findDestinationIndex = destinations.findIndex((item) => (item.name === e.target.value));
      if (findDestinationIndex !== -1) {
        this.updateElement({
          selectedDestination: destinations.find((item) => (item.name === e.target.value)),
        });
      }
    }
  };

  #typeToggleHandler = (e) => {
    if (!e.target.matches('input[name=event-type]')) {
      return;
    }
    const typeValue = e.target.value;
    e.preventDefault();
    this.updateElement({
      type: typeValue,
      offers: [],
      availableOffers: offersByType.find((item) => (item.type === typeValue)).offers
    });
  };

  #offerToggleHandler = (e) => {
    if (e.target.tagName.toLowerCase() !== 'label') {
      return;
    }
    e.preventDefault();
    const clickedElementInput = e.target.closest('div').childNodes[1];
    const selectedOffers = this._state.offers;
    const clickedOffer = parseInt((clickedElementInput.id).match(/\d+/g), 10);
    const clickedOfferId = selectedOffers.indexOf(clickedOffer);

    if (clickedOfferId === -1) {
      selectedOffers.push(clickedOffer);
    } else {
      selectedOffers.splice(clickedOfferId, 1);
    }
    const updatedSelectedOffers = selectedOffers;
    this.updateElement({
      offers: updatedSelectedOffers
    });
  };

  #rollDownHandler = (e) => {
    e.preventDefault();
    this._callback.rollDown();
  };

  setSaveHandler = (callback) => {
    this._callback.save = callback;
    this.element.querySelector('form').addEventListener('submit', this.#saveHandler);
  };

  #saveHandler = (e) => {
    e.preventDefault();
    this._callback.save(EditingFormView.parseState(this._state));
  };

  removeElement = () => {
    super.removeElement();
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#stopDatepicker) {
      this.#stopDatepicker.destroy();
      this.#stopDatepicker = null;
    }
  };

  static parseEvent = (event) => ({
    ...event,
    selectedDestination: destinations.find((item) => (item.id === event.destination)),
    availableOffers: offersByType.find((item) => (item.type === event.type)).offers,
    selectedOffers: event.offers
  });

  static parseState = (state) => {
    const event = { ...state, destination: state.selectedDestination.id };
    delete event.selectedDestination;
    delete event.availableOffersId;
    return event;
  };
}
