import ApiService from './framework/api-service.js';

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class EventsApiService extends ApiService {
  get events() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }


  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  updateEvent = async (event) => {
    const response = await this._load({
      url: `points/${event.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return ApiService.parseResponse(response);
  };

  addEvent = async (event) => {
    const response = await this._load({
      url: 'points',
      method: METHOD.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return ApiService.parseResponse(response);
  };

  deleteEvent = async (event) => {
    const response = await this._load({
      url: `points/${event.id}`,
      method: METHOD.DELETE,
    });
    return response;
  };

  #adaptToServer = (event) => {
    const adapted = {
      ...event,
      'base_price': event.basePrice,
      'date_from': new Date(event.dateFrom).toISOString(),
      'date_to': new Date(event.dateTo).toISOString(),
      'is_favorite': event.isFavorite,
    };

    delete adapted.basePrice;
    delete adapted.dateFrom;
    delete adapted.dateTo;
    delete adapted.isFavorite;

    return adapted;
  };
}
