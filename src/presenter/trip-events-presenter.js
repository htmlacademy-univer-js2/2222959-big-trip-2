import TripEventsView from '../view/trip-events.js';
import RoutePointView from '../view/route-point.js';
import FormEditView from '../view/form-edit.js';
import SortView from '../view/sort.js';
import EmptyEventsView from '../view/empty-events-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripEventsPresenter {
  constructor() {
    this._rootContainer = null;
    this._eventsModel = null;
    this._events = null;
    this._eventList = new TripEventsView();
  }

  _renderEvent(event) {
    const eventComponent = new RoutePointView(event);
    const eventEditComponent = new FormEditView(event);


    const editToEvent = () => {
      this._eventList.element.replaceChild(eventComponent.element, eventEditComponent.element);
    };

    const eventToEdit = () => {
      this._eventList.element.replaceChild(eventEditComponent.element, eventComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        editToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      eventToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      editToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      editToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(eventComponent, this._eventList.element);
  }

  init(tripContainer, pointsModel) {
    this._rootContainer = tripContainer;
    this._eventsModel = pointsModel;
    this._events = [...this._eventsModel.events];
    render(this._eventList, this._rootContainer);
    this._events.forEach((event) => this._renderEvent(event));
    if (this._events.length) {
      render(new SortView(), this._rootContainer, RenderPosition.AFTERBEGIN);
      this._events.forEach((event) => this._renderEvent(event));
    } else {
      render(new EmptyEventsView(), this._rootContainer);
    }
  }
}
