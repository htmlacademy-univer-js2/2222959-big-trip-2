import EventsView from '../view/trip-events.js';
import RoutePointView from '../view/route-point.js';
import FormEditView from '../view/form-edit.js';
import SortView from '../view/sort.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  constructor(tripContainer) {
    this.eventsList = new EventsView();
    this.tripContainer = tripContainer;
  }

  init(pointsModel) {
    this.pointsModel = pointsModel;
    this.routePoints = [...this.pointsModel.getPoints()];

    render(new SortView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new FormEditView(this.routePoints[0]), this.eventsList.getElement());

    this.routePoints.forEach((routePoint) => render(new RoutePointView(routePoint), this.eventsList.getElement()));
  }
}
