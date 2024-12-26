import { CardInterface } from "./type";
import type { TouchData } from "react-native-gesture-handler";
import * as C from "./constants";
import { withSequence, withTiming, Easing } from "react-native-reanimated";

export const calcXCardPosition = (idx: number) => {
  return C.CARD_DEFAULT_POSITION * (idx % C.CARDS_ROW_LENGTH);
};

export const calcYCardPosition = (idx: number) => {
  return C.CARD_DEFAULT_POSITION * Math.floor(idx / C.CARDS_ROW_LENGTH) + 100;
};

export const calcXCardPositionWorklet = (idx: number) => {
  "worklet";
  return C.CARD_DEFAULT_POSITION * (idx % C.CARDS_ROW_LENGTH);
};

export const isCardTouched = (card: CardInterface, touches: TouchData[]) => {
  "worklet";
  const { x, y } = card;
  const firstTouch = touches[0];
  const { x: touchX, y: touchY } = firstTouch;
  if (!firstTouch) return false;
  const isInX = touchX > x.value && touchX < x.value + C.CARD_SIZE;
  const isInY = touchY > y.value && touchY < y.value + C.CARD_SIZE;
  return isInX && isInY;
};

export const flipCard = (card: CardInterface) => {
  "worklet";
  const duration = 300;
  const defaultXPosition = calcXCardPositionWorklet(card.idx);
  if (card.x.value !== defaultXPosition) {
    return;
  }
  card.isFlipped.value = withTiming(card.isFlipped.value > 0 ? 0 : 1, {
    duration: duration,
    easing: Easing.cubic,
  });
  card.width.value = withSequence(
    withTiming(-C.CARD_SIZE, {
      duration: duration,
      easing: Easing.cubic,
    }),
    withTiming(C.CARD_SIZE, { duration: 0 }),
  );
  card.x.value = withSequence(
    withTiming(defaultXPosition + C.CARD_SIZE, {
      duration,
      easing: Easing.cubic,
    }),
    withTiming(defaultXPosition, { duration: 0 }),
  );
};

type TWENTY_LENGTH_ARRAY = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export function generateAndShuffleArray(): TWENTY_LENGTH_ARRAY {
  // Create an array from 1 to 10
  const array = Array.from({ length: 10 }, (_, i) => i + 1);
  // Duplicate the array
  const doubledArray = array.concat(array) as TWENTY_LENGTH_ARRAY;

  // Function to shuffle the array
  for (let i = doubledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [doubledArray[i], doubledArray[randomIndex]] = [
      doubledArray[randomIndex],
      doubledArray[i],
    ];
  }

  return doubledArray;
}
