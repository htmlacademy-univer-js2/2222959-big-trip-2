import { UPDATE_TYPES } from '../utils.js';
import Observable from '../framework/observable.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];
  #offers = [];
  #destinations = [];

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get events() {
    return this.#events;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);
      this.#offers = await this.#eventsApiService.offers;
      this.#destinations = await this.#eventsApiService.destinations;
    } catch (err) {
      this.#events = [];
      this.#offers = [];
      this.#destinations = [];
    }
    this._notify(UPDATE_TYPES.INIT);
  };

  updateEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#eventsApiService.updatePoint(update);
      const updated = this.#adaptToClient(response);

      this._notify(updateType, update);
      this.#events = [
        ...this.#events.slice(0, index),
        updated,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, updated);
    } catch (err) {
      throw new Error('Can\'t update task');
    }
  };

  addEvent = (updateType, update) => {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  };

  deleteEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (event) => {
    const adapted = {
      ...event,
      basePrice: event['base_price'],
      startDate: event['date_from'],
      endDate: event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adapted['base_price'];
    delete adapted['date_from'];
    delete adapted['date_to'];
    delete adapted['is_favorite'];

    return adapted;
  };
}
