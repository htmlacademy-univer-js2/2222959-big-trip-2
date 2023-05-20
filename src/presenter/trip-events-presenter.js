import TripEventsView from '../view/trip-events.js';
import SortView from '../view/sort.js';
import EmptyEventsView from '../view/empty-events-view.js';
import EventPresenter from './event-presenter.js';
import { render, remove } from '../framework/render.js';
import { SORT_TYPES, sortByPrice, sortByDuration, sortByDate, update } from '../utils.js';

export default class TripEventsPresenter {
  #rootContainer;
  #eventsModel;
  #events;
  #eventsList = new TripEventsView();
  #sortComponent;
  #emptyList = new EmptyEventsView();
  #eventPresenter = new Map();
  #currentSortType = SORT_TYPES.DEFAULT;
  #initialEvents = [];

  constructor(rootContainer, eventsModel) {
    this.#rootContainer = rootContainer;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#initialEvents = [...this.#eventsModel.events];
    this.#events = [...this.#eventsModel.events].sort(sortByDate);
    this.#renderEventsList();
  };

  #renderEventsList = () => {
    if (this.#events.length) {
      this.#renderSort();
      render(this.#eventsList, this.#rootContainer);
      this.#renderEvents();
    } else {
      this.#renderEmptyList();
    }
  };

  #renderEvents = () => {
    this.#events.forEach((event) => this.#renderEvent(event));
  };

  #renderEvent = (event) => {
    const evtPresenter = new EventPresenter(
      this.#eventsList.element,
      this.#changePointHandler,
      this.#switchModeHandler
    );
    evtPresenter.init(event);
    this.#eventPresenter.set(event.id, evtPresenter);
  };

  #clearEventstList = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
  };

  #changePointHandler = (updateEvt) => {
    this.#events = update(this.#events, updateEvt);
    this.#initialEvents = update(this.#initialEvents, updateEvt);
    this.#eventPresenter.get(updateEvt.id).init(updateEvt);
  };

  #sort = (sortType) => {
    switch (sortType) {
      case SORT_TYPES.PRICE:
        this.#events.sort(sortByPrice);
        break;
      case SORT_TYPES.TIME:
        this.#events.sort(sortByDuration);
        break;
      default:
        this.#events.sort(sortByDate);
    }

    this.#currentSortType = sortType;
  };

  #sortHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sort(sortType);
    this.#clearEventstList();
    this.#renderEventsList();
  };

  #switchModeHandler = () => {
    this.#eventPresenter.forEach((presenter) => presenter.updateView());
  };

  #renderSort = () => {
    if (this.#sortComponent instanceof SortView) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#rootContainer);
    this.#sortComponent.setSortHandler(this.#sortHandler);
  };

  #renderEmptyList = () => render(this.#emptyList, this.#rootContainer);
}
