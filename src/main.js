import FilterView from './view/filter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import MenuView from './view/menu.js';
import { render } from './render.js';
import RoutePointsModel from './model/route-point-model.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const tripPresenter = new TripEventsPresenter(siteMainElement.querySelector('.trip-events'));
const routePointModel = new RoutePointsModel();

render(new FilterView(), siteHeaderElement.querySelector('.trip-controls__filters'));
render(new MenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));

tripPresenter.init(routePointModel);
