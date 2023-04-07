import { generatePoints } from '../mock/point.js';

const ROUTE_POINTS_COUNT = 3;

export default class PointsModel {
  constructor() {
    this.routePoints = new Array(ROUTE_POINTS_COUNT).fill().map((value, index) => generatePoints(index + 1));
  }

  getPoints() {
    return this.routePoints;
  }
}