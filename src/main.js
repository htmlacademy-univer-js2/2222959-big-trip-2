import FilterView from './view/filter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import MenuView from './view/menu.js';
import PointsModel from './model/point-model.js';
import { render } from './render.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const tripPresenter = new TripEventsPresenter(siteMainElement.querySelector('.trip-events'));
const pointModel = new PointsModel();

render(new FilterView(), siteHeaderElement.querySelector('.trip-controls__filters'));
render(new MenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));

tripPresenter.init(pointModel);
