import { Dimensions } from "react-native";
const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export const WINDOW_WIDTH = windowWidth;
export const WINDOW_HEIGHT = windowHeight;
export const CARDS_ROW_LENGTH = 4;
export const CARDS_TOTAL = 20;
export const CARD_DEFAULT_POSITION = WINDOW_WIDTH / CARDS_ROW_LENGTH;
export const CARD_GAP = 20;
export const CARD_SIZE =
  CARD_DEFAULT_POSITION - CARD_GAP / (CARDS_ROW_LENGTH - 1);
