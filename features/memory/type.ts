type ShapeVariant = "Rectangle" | "Card";
import type { SharedValue } from "react-native-reanimated";

export interface ShapeInterface {
  x: SharedValue<number>;
  y: SharedValue<number>;
  ax: number;
  ay: number;
  vx: number;
  vy: number;
  type: ShapeVariant;
  id: number;
}

export interface RectangleInterface extends ShapeInterface {
  width: number;
  height: number;
  type: "Rectangle";
}

export interface CardInterface extends ShapeInterface {
  idx: number;
  id: number;
  type: "Card";
  width: SharedValue<number>;
  height: SharedValue<number>;
  isFlipped: SharedValue<number>;
  value: number;
}
