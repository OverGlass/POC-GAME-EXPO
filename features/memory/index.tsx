import {
  Canvas,
  Rect,
  SkFont,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { View, StyleSheet } from "react-native";
import type { CardInterface } from "./type";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import {
  calcXCardPosition,
  calcYCardPosition,
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

const CardText = ({ card, font }: { card: CardInterface; font: SkFont }) => {
  const text = card.value.toString();
  const textWidth = font.measureText(text).width;
  const textHeight = font.getSize();
  const x = card.x.value + C.CARD_SIZE / 2 - textWidth / 2;
  const y = card.y.value + C.CARD_SIZE / 2 + textHeight / 2;
  return (
    <Text
      x={x}
      y={y}
      font={font}
      text={text}
      opacity={card.isFlipped}
      color={"white"}
    />
  );
};

const Card = ({ card }: { card: CardInterface }) => {
  const color = useDerivedValue(() => {
    console.log(card.isFlipped.value, "flipped");
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
  const flippedCards = useSharedValue(0);
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
    for (const card of cards) {
      if (isCardTouched(card, e.allTouches)) {
        flipCard(card);
      }
    }
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
