import AbstractView from '../framework/view/abstract-view';

const createNoPointTemplate = () => (
  '<p class="trip-events__msg">Loading...<br>Please wait</p>'
);

export default class LoadScreenView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
}
