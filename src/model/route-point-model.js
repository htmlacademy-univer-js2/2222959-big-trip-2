import { generateRoutePoint } from '../mock/route-point.js';

const ROUTE_POINTS_COUNT = 20;

export default class RoutePointsModel {
  constructor() {
    this.routePoints = new Array(ROUTE_POINTS_COUNT).fill().map((value, index) => generateRoutePoint(index + 1));
  }

  getRoutePoints() {
    return this.routePoints;
  }
}
