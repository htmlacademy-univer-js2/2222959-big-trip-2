import { nanoid } from 'nanoid';
import { remove, render, RenderPosition } from '../framework/render.js';
import EditingFormView from '../view/form-edit.js';
import { USER_ACTIONS, UPDATE_TYPES } from '../utils.js';

export default class NewEventPresenter {
  #eventsListContainer = null;
  #changeData = null;
  #editComponent = null;
  #destroyCallback = null;

  constructor(eventsListContainer, changeData) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editComponent !== null) {
      return;
    }

    this.#editComponent = new EditingFormView();
    this.#editComponent.setSaveHandler(this.#saveHandler);
    this.#editComponent.setDeleteHandler(this.#deleteHandler);
    this.#editComponent.setRollDownHandler(this.#clickHandler);
    render(this.#editComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    remove(this.#editComponent);
    this.#editComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #saveHandler = (event) => {
    this.#changeData(
      USER_ACTIONS.ADD,
      UPDATE_TYPES.MINOR,
      { id: nanoid(), ...event },
    );
    this.destroy();
  };

  #deleteHandler = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #clickHandler = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.destroy();
    }
  };
}
