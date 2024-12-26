import {
  Canvas,
  Rect,
  SkFont,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { View, StyleSheet } from "react-native";
import type { CardInterface } from "./type";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  calcXCardPosition,
  calcYCardPosition,
  deckCard,
  flipCard,
  generateAndShuffleArray,
  isCardTouched,
} from "./logic";
import * as C from "./constants";
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from "react-native-gesture-handler";

import { setAnimatedTimeout, clearAnimatedTimeout } from "./utils";

const CardText = ({ card, font }: { card: CardInterface; font: SkFont }) => {
  const text = card.value.toString();
  const textWidth = font.measureText(text).width;
  const textHeight = font.getSize();
  const x = useDerivedValue(
    () => card.x.value + C.CARD_SIZE / 2 - textWidth / 2,
  );
  const y = useDerivedValue(
    () => card.y.value + C.CARD_SIZE / 2 + textHeight / 2,
  );

  const opacity = useDerivedValue(() =>
    interpolate(card.isFlipped.value, [0.5, 1], [0, 1]),
  );
  return (
    <Text
      x={x}
      y={y}
      font={font}
      text={text}
      opacity={opacity}
      color={"white"}
    />
  );
};

const Card = ({ card }: { card: CardInterface }) => {
  const color = useDerivedValue(() => {
    return card.isFlipped.value > 0.5 ? "red" : "white";
  });
  return (
    <Rect
      x={card.x}
      y={card.y}
      width={card.width}
      height={card.height}
      color={color}
    ></Rect>
  );
};

export function Memory() {
  const flippedCards = useSharedValue<number[]>([]);
  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 24);
  const shuffleArray = generateAndShuffleArray();
  const cards: CardInterface[] = Array(C.CARDS_TOTAL)
    .fill(0)
    .map((_, idx) => {
      return {
        id: idx,
        idx: idx,
        value: shuffleArray[idx],
        x: useSharedValue(calcXCardPosition(idx)),
        y: useSharedValue(calcYCardPosition(idx)),
        width: useSharedValue(C.CARD_SIZE),
        height: useSharedValue(C.CARD_SIZE),
        type: "Card",
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        isFlipped: useSharedValue(0),
      };
    });

  const gesture = Gesture.Tap().onTouchesUp((e) => {
    let timeoutID: number | null = null;
    for (const card of cards) {
      if (isCardTouched(card, e.allTouches)) {
        if (card.isFlipped.value < 1 && flippedCards.value.length < 2) {
          flipCard(card);
          flippedCards.value = [...flippedCards.value, card.id];
        }
      }
    }

    if (flippedCards.value.length === 2) {
      const [first, second] = flippedCards.value.map((id) =>
        cards.find((x) => x.id === id),
      );
      if (!first || !second) throw new Error("Should have card in map");
      if (first.value === second.value) {
        setAnimatedTimeout(() => {
          deckCard(first);
          deckCard(second);
        }, 1000);
      } else {
        timeoutID = setAnimatedTimeout(() => {
          flipCard(first);
          flipCard(second);
        }, 1000);
      }
      flippedCards.value = [];
    }
    return () => {
      if (timeoutID) clearAnimatedTimeout(timeoutID);
    };
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <Canvas style={{ flex: 1 }}>
            {cards.map((x) => (
              <Card card={x} key={x.id} />
            ))}
            {font
              ? cards.map((x) => <CardText card={x} key={x.id} font={font} />)
              : null}
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000",
  },
});
