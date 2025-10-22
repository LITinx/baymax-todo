import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";

interface AnimatedTrashIconProps {
  progress: SharedValue<number>;
  size?: number;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const AnimatedTrashIcon = ({ progress, size = 24 }: AnimatedTrashIconProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.2, 1]);

    return {
      transform: [{ scale }],
    };
  });

  const lidAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, -3]);
    const rotateZ = interpolate(progress.value, [0, 1], [0, -15]);

    return {
      transform: [{ translateY }, { rotateZ: `${rotateZ}deg` }],
    };
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatedSvg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={animatedStyle}
      >
        {/* Trash can body */}
        <Rect
          x="5"
          y="7"
          width="14"
          height="13"
          rx="1"
          fill="#ef4444"
          stroke="#dc2626"
          strokeWidth="1"
        />

        {/* Vertical lines inside trash */}
        <Path
          d="M9 9v8M12 9v8M15 9v8"
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Animated handle */}
        <Animated.View style={[lidAnimatedStyle, { position: "absolute" }]}>
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Animated lid */}
        <Animated.View style={[lidAnimatedStyle, { position: "absolute" }]}>
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Rect
              x="4"
              y="6"
              width="16"
              height="2"
              rx="1"
              fill="#ef4444"
              stroke="#dc2626"
              strokeWidth="1"
            />
          </Svg>
        </Animated.View>
      </AnimatedSvg>
    </View>
  );
};

export default AnimatedTrashIcon;
