import dayjs from 'dayjs';

const HOUR_MINUTES_COUNT = 60;
const TOTAL_DAY_MINUTES_COUNT = 1440;
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'DD/MM/YY hh:mm';
const TIME_FORMAT = 'hh:mm';

const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');

const duration = (dateFrom, dateTo) => {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom), 'minute', true);

  const days = Math.floor(difference / TOTAL_DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference % TOTAL_DAY_MINUTES_COUNT) / HOUR_MINUTES_COUNT);
  const restMinutes = difference % HOUR_MINUTES_COUNT;

  const daysOutput = days ? `${days}D` : '';
  const hoursOutput = restHours ? `${restHours}H` : '';
  const minutesOutput = restMinutes ? `${restMinutes}M` : '';

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};

const getDate = (date) => dayjs(date).format(DATE_FORMAT);

const getTime = (date) => dayjs(date).format(TIME_FORMAT);

const getDateTime = (date) => dayjs(date).format(DATE_TIME_FORMAT);

const getRandomInteger = (a = 0, b = 1) => Math.floor(Math.random() * (Math.floor(b) - Math.ceil(a) + 1)) + Math.ceil(a);

const getRandomElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const checkDatesRelativeToCurrent = (dateFrom, dateTo) => dateFrom.isBefore(dayjs()) && dateTo.isAfter(dayjs());
const isEventPlanned = (dateFrom, dateTo) => dateFrom.isAfter(dayjs()) || checkDatesRelativeToCurrent(dateFrom, dateTo);
const isEventPassed = (dateFrom, dateTo) => dateTo.isBefore(dayjs()) || checkDatesRelativeToCurrent(dateFrom, dateTo);
const checkFavoriteOption = (isFavorite) => (isFavorite) ? 'event__favorite-btn--active' : '';
const isSubmitDisabledByDate = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom)) <= 0;
const capitalizeFirstSym = (str) => str[0].toUpperCase() + str.slice(1);

const filter = {
  'everything': (events) => events.map((event) => event),
  'future': (events) => events.filter((event) => isEventPlanned(event.dateFrom, event.dateTo)),
  'past': (events) => events.filter((event) => isEventPassed(event.dateFrom, event.dateTo))
};

const update = (items, updatedItem) => items.map((item) => item.id === updatedItem.id ? updatedItem : item);

const sortByPrice = (a, b) => b.basePrice - a.basePrice;
const sortByDuration = (a, b) => {
  const durationA = Math.ceil(dayjs(a.endDate).diff(dayjs(a.startDate, 'minute', true)));
  const durationB = Math.ceil(dayjs(b.endDate).diff(dayjs(b.startDate, 'minute', true)));
  return durationB - durationA;
};
const sortByDate = (a, b) => dayjs(a.startDate) - dayjs(b.startDate);

const SORT_TYPES = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price'
};

export {
  getRandomInteger,
  getRandomElement,
  humanizePointDueDate,
  duration,
  getDate,
  getDateTime,
  getTime,
  capitalizeFirstSym,
  filter,
  update,
  sortByPrice,
  sortByDuration,
  checkFavoriteOption,
  isSubmitDisabledByDate,
  sortByDate,
  SORT_TYPES
};
