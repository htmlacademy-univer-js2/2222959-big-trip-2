import AbstractView from '../framework/view/abstract-view';

const createErrorTemplate = () => (
  '<p class="trip-events__msg error">Something went wrong.<br>Try again later</p>'
);

export default class ErrorScreenView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}
