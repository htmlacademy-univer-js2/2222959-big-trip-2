import ApiService from './framework/api-service.js';

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
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

  updatePoint = async (event) => {
    const response = await this._load({
      url: `points/${event.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsed = await ApiService.parseResponse(response);

    return parsed;
  };

  #adaptToServer = (event) => {

    const adapted = {
      ...event,
      'base_price': event.basePrice,
      'date_from': new Date(event.startDate).toISOString(),
      'date_to': new Date(event.endDate).toISOString(),
      'is_favorite': event.isFavorite,
    };

    delete adapted.basePrice;
    delete adapted.startDate;
    delete adapted.endDate;
    delete adapted.isFavorite;

    return adapted;
  };
}
