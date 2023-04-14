import TripEventsView from '../view/trip-events.js';
import RoutePointView from '../view/route-point.js';
import FormEditView from '../view/form-edit.js';
import SortView from '../view/sort.js';
import EmptyEventsView from '../view/empty-events-view.js';
import { render, RenderPosition, replace } from '../framework/render';

export default class TripEventsPresenter {
  #rootContainer = null;
  #eventsModel = null;
  #events = null;
  #eventsList = new TripEventsView();

  #renderEvent = (event) => {
    const eventComponent = new RoutePointView(event);
    const eventEditComponent = new FormEditView(event);

    const editToEvent = () => replace(eventEditComponent, eventComponent);
    const eventToEdit = () => replace(eventComponent, eventEditComponent);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        editToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.setRollUpHandler(() => {
      eventToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.setRollDownHandler(() => {
      editToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.setSaveHandler(() => {
      editToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(eventComponent, this.#eventsList.element);
  };

  init = (tripContainer, pointsModel) => {
    this.#rootContainer = tripContainer;
    this.#eventsModel = pointsModel;
    this.#events = [...this.#eventsModel.events];
    render(this.#eventsList, this.#rootContainer);
    this.#events.forEach((event) => this.#renderEvent(event));
    if (this.#events.length) {
      render(new SortView(), this.#rootContainer, RenderPosition.AFTERBEGIN);
      this.#events.forEach((event) => this.#renderEvent(event));
    } else {
      render(new EmptyEventsView(), this.#rootContainer);
    }
  }
}
