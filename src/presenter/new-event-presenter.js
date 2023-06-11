
import { remove, render, RenderPosition } from '../framework/render.js';
import EditingFormView from '../view/edit-form.js';
import { USER_ACTIONS, UPDATE_TYPES } from '../utils.js';

export default class NewEventPresenter {
  #eventsListContainer = null;
  #changeData = null;
  #editComponent = null;
  #destroyCallback = null;
  #offers = null;
  #destinations = null;

  constructor(eventsListContainer, changeData) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#destroyCallback = callback;

    if (this.#editComponent !== null) {
      return;
    }

    this.#editComponent = new EditingFormView(undefined, this.#offers, this.#destinations);
    this.#editComponent.setSaveHandler(this.#saveHandler);
    this.#editComponent.setDeleteHandler(this.#deleteHandler);
    this.#editComponent.setRollDownHandler(this.#clickHandler);
    render(this.#editComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyHandler);
  };

  destroy = () => {
    if (this.#editComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    remove(this.#editComponent);
    this.#editComponent = null;

    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  setSave = () => this.#editComponent.updateElement({ isDisabled: true, isSaving: true });

  setAborte = () => {
    const resetFormState = () => {
      this.#editComponent.updateElement({ isDisabled: false, isSaving: false, isDeleting: false });
    };

    this.#editComponent.shake(resetFormState);
  };

  #saveHandler = (event) => this.#changeData(USER_ACTIONS.ADD, UPDATE_TYPES.MINOR, event);

  #deleteHandler = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #clickHandler = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #escKeyHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.destroy();
    }
  };
}
