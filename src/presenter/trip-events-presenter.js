import TripEventsView from '../view/trip-events.js';
import SortView from '../view/sort.js';
import NoEventsView from '../view/no-events-view.js';
import LoadScreenView from '../view/load-screen-view.js';
import EventPresenter from './event-presenter.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SORT_TYPES, UPDATE_TYPES, USER_ACTIONS, FILTER_TYPES, sortByPrice, sortByDuration, sortByDate, filter, TIME_LIMIT } from '../utils.js';
import NewEventPresenter from './new-event-presenter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import ErrorScreenView from '../view/error-screen-view.js';
import { newEventButtonComponent } from '../main.js';

export default class TripEventsPresenter {
  #rootContainer;
  #eventsModel;
  #filterModel;
  #sortComponent = null;
  #loadComponent = new LoadScreenView();
  #errorComponent = new ErrorScreenView();
  #isLoading = true;
  #isError = false;
  #eventsList = new TripEventsView();
  #emptyList = null;
  #eventPresenter = new Map();
  #newEventPresenter;
  #currentSortType = SORT_TYPES.DEFAULT;
  #filterType = FILTER_TYPES.EVERYTHING;
  #uiBlocker = new UiBlocker(TIME_LIMIT.LOWER_LIMIT, TIME_LIMIT.UPPER_LIMIT);

  constructor(rootContainer, eventsModel, filterModel) {
    this.#rootContainer = rootContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#newEventPresenter = new NewEventPresenter(this.#eventsList.element, this.#actionHandler);
    this.#eventsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get offers() {
    return this.#eventsModel.offers;
  }

  get destinations() {
    return this.#eventsModel.destinations;
  }

  init = () => {
    this.#render();
  };

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SORT_TYPES.PRICE:
        return filteredEvents.sort(sortByPrice);
      case SORT_TYPES.TIME:
        return filteredEvents.sort(sortByDuration);
      default:
        return filteredEvents.sort(sortByDate);
    }
  }

  createEvent = (callback) => {
    this.#currentSortType = SORT_TYPES.DEFAULT;
    this.#filterModel.setFilter(UPDATE_TYPES.MAJOR, FILTER_TYPES.EVERYTHING);
    this.#newEventPresenter.init(callback, this.offers, this.destinations);
  };

  #renderEvents = (events) => {
    events.forEach((event) => this.#renderEvent(event));
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsList.element,
      this.#actionHandler, this.#switchModeHandler);
    eventPresenter.init(event, this.offers, this.destinations);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #actionHandler = (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case USER_ACTIONS.UPDATE:
        this.#eventPresenter.get(update.id).setSaving();
        try {
          this.#eventsModel.updateEvent(updateType, update);
        } catch (err) {
          this.#eventPresenter.get(update.id).setAborting();
        }
        break;
      case USER_ACTIONS.ADD:
        this.#newEventPresenter.setSave();
        try {
          this.#eventsModel.addEvent(updateType, update);
        } catch (err) {
          this.#newEventPresenter.setAborte();
        }
        break;
      case USER_ACTIONS.DELETE:
        this.#eventPresenter.get(update.id).setDeleting();
        try {
          this.#eventsModel.deleteEvent(updateType, update);
        } catch (err) {
          this.#eventPresenter.get(update.id).setAborting();
        }
        break;
      default:
        throw new Error(`Action Type ${actionType} is undefined.`);
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPES.PATCH:
        this.#eventPresenter.get(data.id).init(data);
        break;
      case UPDATE_TYPES.MINOR:
        this.#clear();
        this.#render();
        break;
      case UPDATE_TYPES.MAJOR:
        this.#clear({ resetSortType: true });
        this.#render();
        break;
      case UPDATE_TYPES.INIT:
        this.#isLoading = false;
        remove(this.#loadComponent);
        this.#render();
        break;
      case UPDATE_TYPES.ERROR:
        this.#isLoading = false;
        this.#isError = true;
        remove(this.#loadComponent);
        this.#render();
        break;
      default:
        throw new Error(`Update of ${updateType} is undefined. Try again`);
    }
  };

  #sortHandler = (type) => {
    if (this.#currentSortType === type) {
      return;
    }
    this.#currentSortType = type;
    this.#clear();
    this.#render();
  };

  #switchModeHandler = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.updateView());
  };

  #renderSort = () => {
    if (this.#sortComponent instanceof SortView) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#rootContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortHandler(this.#sortHandler);
  };

  #renderEmptyList = () => {
    this.#emptyList = new NoEventsView(this.#filterType);
    render(this.#emptyList, this.#rootContainer);
  };

  #render = () => {
    const events = this.events;
    render(this.#eventsList, this.#rootContainer);
    if (this.#isLoading) {
      this.#renderLoad();
      return;
    }

    if (this.#isError) {
      this.#renderError();
      newEventButtonComponent.element.disabled = true;
      return;
    }

    if (!events.length) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderEvents(events);
  };

  #renderLoad = () => {
    render(this.#loadComponent, this.#rootContainer);
  };

  #renderError = () => {
    render(this.#errorComponent, this.#rootContainer);
  };

  #clear = ({ resetSortType = false } = {}) => {
    this.#newEventPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#emptyList);
    remove(this.#loadComponent);

    if (this.#emptyList) {
      remove(this.#emptyList);
    }

    if (resetSortType) {
      this.#currentSortType = SORT_TYPES.DEFAULT;
    }
  };
}
