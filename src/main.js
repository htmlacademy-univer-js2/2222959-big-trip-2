import FilterView from './view/filter';
import TripEventsPresenter from './presenter/trip-events-presenter';
import MenuView from './view/menu';
import PointsModel from './model/point-model';
import FormCreateView from './view/form-create';
import TripInfoView from './view/trip-info-view';
import { render, RenderPosition } from './framework/render';


const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripMainElement = document.querySelector('.trip-main');
const navigation = headerElement.querySelector('.trip-controls__navigation');
const filters = headerElement.querySelector('.trip-controls__filters');
const content = mainElement.querySelector('.trip-events');
tripMainElement.querySelector('.trip-main__event-add-btn')
  .addEventListener('click', () => render(new FormCreateView(), content, RenderPosition.AFTERBEGIN));

const routePresenter = new TripEventsPresenter();
const eventsModel = new PointsModel();
render(new MenuView(), navigation);
render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filters);
routePresenter.init(content, eventsModel);
