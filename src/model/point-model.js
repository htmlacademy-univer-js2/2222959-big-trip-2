import { generatePoints } from '../mock/point.js';

const ROUTE_POINTS_COUNT = 3;

export default class PointsModel {
  #events;

  constructor() {
    this.#events = Array.from({ length: ROUTE_POINTS_COUNT }, generatePoints);
  }

  get events() {
    return this.#events;
  }
}
