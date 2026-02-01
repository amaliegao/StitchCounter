import AnimatedPressable from "./AnimatedPressable";
import { Text } from "react-native";

export default function FloatingAddButton({ onPress }) {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 24,
        alignSelf: "center",
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 34, lineHeight: 34 }}>+</Text>
    </AnimatedPressable>
  );
}