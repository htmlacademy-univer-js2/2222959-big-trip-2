import AbstractView from '../framework/view/abstract-view';


const createNewEventButton = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewEventButton extends AbstractView {

  get template() {
    return createNewEventButton();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (event) => {
    event.preventDefault();
    this._callback.click();
  };
}
