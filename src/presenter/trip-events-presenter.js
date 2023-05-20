import TripEventsView from '../view/trip-events.js';
import SortView from '../view/sort.js';
import EmptyEventsView from '../view/empty-events-view.js';
import EventPresenter from './event-presenter.js';
import { render } from '../framework/render';
import { update } from '../utils';


export default class TripEventsPresenter {
  #rootContainer = null;
  #eventsModel = null;
  #events = null;
  #eventsList = new TripEventsView();
  #sortComponent = new SortView();
  #emptyList = new EmptyEventsView();
  #eventPresenter = new Map();

  constructor(rootContainer, eventsModel) {
    this.#rootContainer = rootContainer;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    this.#renderEventsList();
  }

  #renderEventsList = () => {
    if (this.#events.length) {
      this.#renderSort();
      render(this.#eventsList, this.#rootContainer);
      this.#renderEvents();
    } else {
      this.#renderEmptyList();
    }
  }

  #renderEvents = () => {
    this.#events.array.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent = (event) => {
    const evtPresenter = new EventPresenter(
      this.#emptyList.element,
      this.#changePointHandler,
      this.#switchModeHandler
    );
    evtPresenter.init(event);
    this.#eventPresenter.set(event.id, evtPresenter);
  }

  #changePointHandler = (updateEvt) => {
    this.#events = update(this.#events, updateEvt);
    this.#eventPresenter.get(updateEvt.id).init(updateEvt);
  }

  #switchModeHandler = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => render(this.#sortComponent, this.#rootContainer);
  #renderEmptyList = () => render(this.#emptyList, this.#rootContainer);
}
