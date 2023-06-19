import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const HOURS = 24;
const MINUTES = 60;
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'DD/MM/YY hh:mm';
const TIME_FORMAT = 'hh:mm';

const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');

const durationDates = (dateStart, dateEnd) => {
  const diffInTotalMinutes = Math.ceil(dayjs(dateEnd).diff(dayjs(dateStart), 'minute', true));
  const diffInHours = Math.floor(diffInTotalMinutes / MINUTES) % HOURS;
  const diffInDays = Math.floor(diffInTotalMinutes / (MINUTES * HOURS));

  if ((diffInDays === 0) && (diffInHours === 0)) {
    return dayjs.duration(diffInTotalMinutes, 'minutes').format('mm[M]');
  }
  if (diffInDays === 0) {
    return dayjs.duration(diffInTotalMinutes, 'minutes').format('HH[H] mm[M]');
  }
  return dayjs.duration(diffInTotalMinutes, 'minutes').format('DD[D] HH[H] mm[M]');
};

const getDate = (date) => dayjs(date).format(DATE_FORMAT);

const getTime = (date) => dayjs(date).format(TIME_FORMAT);

const getDateTime = (date) => dayjs(date).format(DATE_TIME_FORMAT);

const getRandomInteger = (a = 0, b = 1) => Math.floor(Math.random() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a);

const getRandomElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const checkDatesRelativeToCurrent = (dateFrom, dateTo) => dayjs(dateFrom).isBefore(dayjs()) && dayjs(dateTo).isAfter(dayjs());
const isEventPlanned = (dateFrom, dateTo) => dayjs(dateFrom).isAfter(dayjs()) || checkDatesRelativeToCurrent(dateFrom, dateTo);
const isEventPassed = (dateFrom, dateTo) => dayjs(dateTo).isBefore(dayjs()) || checkDatesRelativeToCurrent(dateFrom, dateTo);
const checkFavoriteOption = (isFavorite) => (isFavorite) ? 'event__favorite-btn--active' : '';
const isSubmitDisabledByDate = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom)) <= 0;
const capitalizeFirstSym = (str) => str[0].toUpperCase() + str.slice(1);

const filter = {
  'everything': (events) => events.map((event) => event),
  'future': (events) => events.filter((event) => isEventPlanned(event.dateFrom, event.dateTo)),
  'past': (events) => events.filter((event) => isEventPassed(event.dateFrom, event.dateTo))
};

const sortByPrice = (a, b) => b.basePrice - a.basePrice;
const sortByDuration = (a, b) => {
  const durationA = Math.ceil(dayjs(a.endDate).diff(dayjs(a.startDate, 'minute', true)));
  const durationB = Math.ceil(dayjs(b.endDate).diff(dayjs(b.startDate, 'minute', true)));
  return durationB - durationA;
};
const sortByDate = (a, b) => dayjs(a.startDate) - dayjs(b.startDate);

const isSubmitDisabledByPrice = (price) => Number(price) > 0 && Number.isInteger(Number(price));

const isSubmitDisabledByDestinationName = (name, destinations) => {
  const destinationsNames = Array.from(destinations, (dest) => dest.name);
  return destinationsNames.includes(name);
};

const SORT_TYPES = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price'
};

const USER_ACTIONS = {
  UPDATE: 'UPDATE_POINT',
  ADD: 'ADD_POINT',
  DELETE: 'DELETE_POINT',
};

const UPDATE_TYPES = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

const NEW_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const TIME_LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const addOffersPrices = (eventType, events, offers) => {
  const allOffers = offers.find(({ type }) => type === eventType).offers;
  const selected = events.map((offer) => allOffers.find(({ id }) => id === offer).price);
  return selected.reduce((sum, price) => sum + price, 0);
};

const addDestinationName = (destination, destinations) =>
  destinations.find((item) => item.id === destination).name;

export {
  getRandomInteger,
  getRandomElement,
  humanizePointDueDate,
  durationDates,
  getDate,
  getDateTime,
  getTime,
  capitalizeFirstSym,
  filter,
  sortByPrice,
  sortByDuration,
  checkFavoriteOption,
  isSubmitDisabledByDate,
  isSubmitDisabledByPrice,
  sortByDate,
  SORT_TYPES,
  FILTER_TYPES,
  USER_ACTIONS,
  UPDATE_TYPES,
  NEW_POINT,
  TIME_LIMIT,
  isSubmitDisabledByDestinationName,
  addOffersPrices,
  addDestinationName
};
