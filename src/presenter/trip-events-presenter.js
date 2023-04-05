import EventView from '../view/trip-events.js';
import RoutePointView from '../view/route-point.js';
import FormEditView from '../view/form-edit';
import SortView from '../view/sort.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  constructor(tripContainer) {
    this.eventsList = new EventView();
    this.tripContainer = tripContainer;
  }

  init(RoutePointsModel) {
    this.RoutePointsModel = RoutePointsModel;
    this.boardRoutePoints = [...this.routePointsModel.getRoutePoints()];

    render(new SortView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new FormEditView(this.boardRoutePoints[0]), this.eventsList.getElement());

    this.boardRoutePoints.forEach((routePoint) => render(new RoutePointView(routePoint), this.eventsList.getElement()));
  }
}
