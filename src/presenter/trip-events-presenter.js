import EventView from '../view/trip-events.js';
import RoutePointView from '../view/route-point.js';
import FormCreateView from '../view/form-create';
import FormEditView from '../view/form-edit';
import SortView from '../view/sort.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  constructor() {
    this.eventsList = new EventView();
  }

  init(tripContainer) {
    this.tripContainer = tripContainer;

    render(new SortView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new FormEditView(), this.eventsList.getElement());

    Array.from({ length: 3 }, () => new RoutePointView())
      .forEach((point) => render(point, this.eventsList.getElement()));

    render(new FormCreateView(), this.eventsList.getElement());
  }
}
