import { getRandomInteger, getRandomElement, filter } from '../utils';
import dayjs from 'dayjs';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const OFFER_TITLES = ['Upgrade to a business class', 'Switch to comfort', 'Rent a car', 'Add breakfast', 'Order taxi', 'Add luggage'];
const DESTINATION_NAMES = ['London', 'New York ', 'Sydney', 'Tokyo', 'Toronto'];
const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];

const ElementsCount = { MIN: 1, MAX: 4 };
const PictureNumber = { MIN: 0, MAX: 10 };
const Price = { MIN: 100, MAX: 1000 };

const generateDescription = () => {
  let description = '';
  for (let i = 0; i < getRandomInteger(ElementsCount.MIN, ElementsCount.MAX); i++) {
    description += ` ${getRandomElement(DESCRIPTIONS)}`;
  }
  return description;
};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomInteger(PictureNumber.MIN, PictureNumber.MAX)}`,
  description: generateDescription(),
});

const generateDestination = (id) => ({
  id,
  description: generateDescription(),
  name: DESTINATION_NAMES[id],
  pictures: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}, generatePicture),
});

const destinations = DESTINATION_NAMES.map((_, index) => generateDestination(index));
const generateOffer = (id, pointType) => ({
  id,
  title: pointType,
  price: getRandomInteger(Price.MIN, Price.MAX)
});

const generateOffersByType = (pointType) => ({
  type: pointType,
  offers: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}).map((_, index) => generateOffer(index + 1, pointType)),
});

const offersByType = Array.from({length: POINT_TYPES.length}).map((value, index) => generateOffersByType(POINT_TYPES[index]));

const generateOffersArray = () => OFFER_TITLES.map((title, index) => (
  {
    id: index + 1,
    title,
    price: getRandomInteger(50, 300)
  })
);

const OFFERS = generateOffersArray();


const generatePoints = (id) => {
  const offersByTypePoint = getRandomElement(offersByType);
  const allOfferIdsByTypePoint = offersByTypePoint.offers.map((offer) => offer.id);
  return {
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: dayjs().add(getRandomInteger(-3, 0), 'day').add(getRandomInteger(-2, 0), 'hour').add(getRandomInteger(-59, 0), 'minute'),
    dateTo: dayjs().add(getRandomInteger(0, 2), 'hour').add(getRandomInteger(0, 59), 'minute'),
    destination: getRandomElement(destinations).id,
    id,
    isFavorite: Boolean(getRandomInteger()),
    offers: Array.from({length: getRandomInteger(0, allOfferIdsByTypePoint.length)}).map(() => allOfferIdsByTypePoint[getRandomInteger(0, allOfferIdsByTypePoint.length - 1)]),
    type: offersByTypePoint.type,
  };
};

const generateFilter = (events) => Object.entries(filter).map(
  ([name, eventsFilter]) => ({
    name,
    count: eventsFilter(events).length
  })
);

export { generatePoints, generateFilter, destinations, offersByType, OFFERS, DESTINATION_NAMES };
