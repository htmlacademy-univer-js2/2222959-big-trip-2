import FilterView from './view/filter';
import TripEventsPresenter from './presenter/trip-events-presenter';
import MenuView from './view/menu';
import PointsModel from './model/point-model';
import FormCreateView from './view/form-create';
import TripInfoView from './view/trip-info-view';
import { render, RenderPosition } from './framework/render';
import { generateFilter } from './mock/point';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const contentElement = mainElement.querySelector('.trip-events');
tripMainElement.querySelector('.trip-main__event-add-btn')
  .addEventListener('click', () => render(new FormCreateView(), contentElement, RenderPosition.AFTERBEGIN));

const eventsModel = new PointsModel();
const routePresenter = new TripEventsPresenter(contentElement, eventsModel);
const filters = generateFilter(eventsModel.events);

routePresenter.init();
render(new MenuView(), navigationElement);
render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(filters), filtersElement);
