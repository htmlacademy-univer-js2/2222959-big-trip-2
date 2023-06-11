import MenuView from './view/menu-view.js';
import PointsModel from './model/point-model.js';
import NewEventButtonView from './view/event-btn-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/info-presenter';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import FilterModel from './model/filter-model.js';
import EventsApiService from './events-api.js';
import { render } from './framework/render.js';

const AUTHORIZATION = 'Basic by2t8unK3gCMhlK';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const contentElement = mainElement.querySelector('.trip-events');

const filterModel = new FilterModel();
const eventsModel = new PointsModel(new EventsApiService(END_POINT, AUTHORIZATION));
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);
const routePresenter = new TripEventsPresenter(contentElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, eventsModel);
export const newEventButtonComponent = new NewEventButtonView();


const closeNewEventFormHandler = () => {
  newEventButtonComponent.element.disabled = false;
};

const openNewEventFormHandler = () => {
  routePresenter.createEvent(closeNewEventFormHandler);
  newEventButtonComponent.element.disabled = true;
};

render(newEventButtonComponent, tripMainElement);
newEventButtonComponent.setClickHandler(openNewEventFormHandler);

filterPresenter.init();
routePresenter.init();
eventsModel.init()
  .finally(() => {
    render(newEventButtonComponent, tripMainElement);
    newEventButtonComponent.setClickHandler(openNewEventFormHandler);
  });
render(new MenuView(), navigationElement);
tripInfoPresenter.init();
