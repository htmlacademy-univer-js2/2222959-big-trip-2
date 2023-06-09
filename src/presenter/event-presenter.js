import { render, replace, remove } from '../framework/render.js';
import RoutePointView from '../view/route-point.js';
import EditingFormView from '../view/form-edit';
import { USER_ACTIONS, UPDATE_TYPES, isDatesEqual } from '../utils.js';

const TYPE = {
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
  #type = TYPE.DEFAULT;

  constructor(pointList, changeData, switchType) {
    this.#eventsList = pointList;
    this.#changeData = changeData;
    this.#switchType = switchType;
  }

  init = (event) => {
    this.#event = event;
    const previousEvent = this.#component;
    const previousEventEdit = this.#editComponent;
    this.#component = new RoutePointView(event);
    this.#component.setRollUpHandler(this.#handleEditClick);
    this.#component.setFavoriteHandler(this.#handleFavoriteClick);
    this.#editComponent = new EditingFormView(event);
    this.#editComponent.setRollDownHandler(this.#handleEventClick);
    this.#editComponent.setSaveHandler(this.#saveHandler);
    this.#editComponent.setDeleteHandler(this.#deleteHandler);

    if (!previousEvent || !previousEventEdit) {
      render(this.#component, this.#eventsList);
      return;
    }

    if (this.#type === TYPE.DEFAULT) {
      replace(this.#component, previousEvent);
    }

    if (this.#type === TYPE.EDIT) {
      replace(this.#editComponent, previousEventEdit);
    }

    remove(previousEvent);
    remove(previousEventEdit);
  };

  destroy = () => {
    remove(this.#component);
    remove(this.#editComponent);
  };

  updateView = () => {
    if (this.#type !== TYPE.DEFAULT) {
      this.#editToEvent();
    }
  };

  #eventToEdit = () => {
    replace(this.#editComponent, this.#component);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#switchType();
    this.#type = TYPE.EDITING;
  };

  #editToEvent = () => {
    replace(this.#component, this.#editComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#type = TYPE.DEFAULT;
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.#editComponent.reset(this.#event);
      this.#editToEvent();
    }
  };

  #handleFavoriteClick = () => this.#changeData({...this.#event, isFavorite: !this.#event.isFavorite});
  #handleEditClick = () => this.#eventToEdit();
  #handleEventClick = () => {
    this.#editComponent.reset(this.#event);
    this.#editToEvent();
  };

  #saveHandler = (update) => {
    const isMinorUpdate = isDatesEqual(this.#event.startDate, update.startDate);
    this.#changeData(
      USER_ACTIONS.UPDATE,
      isMinorUpdate ? UPDATE_TYPES.PATCH : UPDATE_TYPES.MINOR,
      update,
    );
    this.#editToEvent();
  };

  #deleteHandler = (event) => {
    this.#changeData(
      USER_ACTIONS.DELETE,
      UPDATE_TYPES.MINOR,
      event,
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
