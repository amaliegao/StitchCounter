import { useRef } from "react";
import { Animated, Pressable } from "react-native";

export default function AnimatedPressable({ style, children, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={style} {...props}>
        {children}
      </Pressable>
    </Animated.View>
  );
}