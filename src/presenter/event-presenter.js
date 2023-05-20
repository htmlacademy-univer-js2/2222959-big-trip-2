import { render, replace, remove } from '../framework/render.js';
import TripEventsView from '../view/trip-events.js';
import EditingFormView from '../view/form-edit';

const Type = {
  DEFAULT: 'default',
  EDIT: 'edit'
};

export default class EventPresenter {
  #eventsList;
  #changeData;
  #switchType;
  #component;
  #editComponent;
  #event;
  #type = Type.DEFAULT;

  constructor(pointList, changeData, switchType) {
    this.#eventsList = pointList;
    this.#changeData = changeData;
    this.#switchType = switchType;
  }

  init = (event) => {
    this.#event = event;
    const previousEvent = this.#component;
    const previousEventEdit = this.#editComponent;
    this.#component = new TripEventsView(event);
    this.#component.setRollUpHandler(this.#handleEditClick);
    this.#component.setFavoriteHandler(this.#handleFavoriteClick);
    this.#editComponent = new EditingFormView(event);
    this.#editComponent.setRollDownHandler(this.#handleEventClick);
    this.#editComponent.setSaveHandler(this.#handleEventClick);


    if (!previousEvent || !previousEventEdit) {
      render(this.#component, this.#eventsList);
      return;
    }

    if (this.#type === Type.DEFAULT) {
      replace(this.#component, previousEvent);
    }

    if (this.#type === Type.EDIT) {
      replace(this.#editComponent, previousEventEdit);
    }

    remove(previousEvent);
    remove(previousEventEdit);
  }

  destroy = () => {
    remove(this.#component);
    remove(this.#editComponent);
  }

  updateView = () => {
    if (this.#type !== Type.DEFAULT) {
      this.#editToEvent();
    }
  }

  #eventToEdit = () => {
    replace(this.#editComponent, this.#component);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#switchType();
    this.#type = Type.EDITING;
  };

  #editToEvent = () => {
    replace(this.#editComponent, this.#component);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#type = Type.DEFAULT;
  }

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.#editToEvent();
    }
  }

  #handleFavoriteClick = () => this.#changeData({...this.#event, isFavorite: !this.#event.isFavorite});
  #handleEditClick = () => this.#eventToEdit();
  #handleEventClick = () => this.#editToEvent();
}
