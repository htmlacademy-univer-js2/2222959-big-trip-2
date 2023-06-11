import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDateTime, isSubmitDisabledByDate, isSubmitDisabledByPrice, isSubmitDisabledByDestinationName, NEW_POINT } from '../utils';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';


const createDestionationsOptionsTemplate = (destins) =>
  destins.reduce((result, destin) =>
    result.concat(`<option value="${destin}"></option>\n`), '');

const renderDestinationPictures = (pictures) => pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const renderOffers = (eventOffers, offers) =>
  offers.reduce((result, offer) => result.concat(
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-${offer.id}" 
        type="checkbox" name="event-offer-${offer.title.split(' ').pop()}"  ${eventOffers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  ), '');

const findOffersForType = (eventType, allOffers) =>
  allOffers.find(({ type }) => type === eventType).offers;

const createListTemplate = (offers) =>
  offers.map(({ type }) =>
    `<div class="event__type-item">
      <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" 
        name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">
        ${type}
      </label>
    </div>`).join('\n');

const createEditingFormTemplate = ({ id, destination, type, basePrice, dateFrom, dateTo, offers, isDisabled, isSaving, isDeleting }, allOffers, allDestinations) => {
  const allOffersForType = findOffersForType(type, allOffers);
  const deleting = isDeleting ? 'Deleting...' : 'Delete';
  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createListTemplate(allOffers)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name ? he.encode(destination.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${createDestionationsOptionsTemplate(allDestinations)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}" ${isDisabled ? 'disabled' : ''}>
                  </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabledByDate(dateFrom, dateTo) ? '' : 'disabled'} ${isSubmitDisabledByPrice(basePrice) ? '' : 'disabled'} ${isSubmitDisabledByDestinationName(destination.name, allDestinations) ? '' : 'disabled'}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset">${id ? deleting : 'Cancel'}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers ${!allOffersForType.length ? 'visually-hidden' : ''}">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${renderOffers(offers, allOffersForType)}
            </div>
          </section>
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container">
                        <div class="event__photos-tape">
                        ${destination.pictures ? renderDestinationPictures(destination.pictures) : ''}
                        </div>
                      </div>
          </section>
        </section>
      </form>
  </li>`;
};

export default class EditingFormView extends AbstractStatefulView {
  #allOffers;
  #allDestinations;
  #startDatepicker;
  #stopDatepicker;

  constructor(event = NEW_POINT, allOffers, allDestinations) {
    super();
    this._state = EditingFormView.parseEvent(event, allOffers, allDestinations);
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setStopDatepicker();
  }

  get template () {
    return createEditingFormTemplate(this._state, this.#allOffers, this.#allDestinations);
  }

  reset = (event, allOffers, allDestinations) =>  this.updateElement(EditingFormView.parseEvent(event, allOffers, allDestinations));

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSaveHandler(this._callback.save);
    this.setRollDownHandler(this._callback.rollDown);
    this.#setStartDatepicker();
    this.#setStopDatepicker();
    this.setDeleteHandler(this._callback.delete);
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
    this._callback.delete = callback;
    this.element.querySelector('form').addEventListener('reset', this.#deleteHandler);
  };

  #deleteHandler = (event) => {
    event.preventDefault();
    this._callback.delete(EditingFormView.parseState(this._state, this.#allDestinations));
  };

  #startDateChangeHandler = ([userStartDate]) => {
    this.updateElement({
      startDate: dayjs(userStartDate),
    });
  };

  #setStopDatepicker = () => {
    const startDate = dayjs(this._state.dateFrom).subtract(1, 'days');
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
      endDate: dayjs(userEndDate),
    });
  };

  setRollDownHandler = (callback) => {
    this._callback.rollDown = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollDownHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeToggleHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerToggleHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceToggleHandler);
  };

  #priceToggleHandler = (e) => {
    e.preventDefault();
    this.updateElement({
      basePrice: parseInt(e.target.value, 10)
    });
  };

  #destinationToggleHandler = (e) => {
    e.preventDefault();
    this.updateElement({
      selectedDestinationName: e.target.value,
    });
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
      availableOffers: this.#allOffers.find((item) => (item.type === typeValue)).offers
    });
  };

  #offerToggleHandler = (e) => {
    e.preventDefault();
    const selectedOffers = [...this._state.offers];
    const clickedOfferId = parseInt(e.target.id.match(/\d+/), 10);

    if (e.target.checked) {
      selectedOffers.push(clickedOfferId);
    } else {
      selectedOffers.splice(selectedOffers.indexOf(clickedOfferId), 1);
    }
    this.updateElement({ offers: selectedOffers });
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
    this._callback.save(EditingFormView.parseState(this._state, this.#allDestinations));
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

  static parseEvent = (event, allOffers, allDestinations) => ({
    ...event,
    selectedDestination: allDestinations.find((item) => (item.id === event.destination)),
    availableOffers: allOffers.find((item) => (item.type === event.type)).offers,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseState = (state, destinations) => {
    const event = {
      ...state,
      destination: destinations.find((item) => (item.name === state.selectedDestination.name)).id
    };
    delete event.selectedDestination;
    delete event.availableOffers;
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  };
}
