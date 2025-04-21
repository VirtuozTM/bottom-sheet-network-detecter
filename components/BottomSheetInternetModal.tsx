import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Platform,
  type ViewStyle,
  type StyleProp,
  Text,
  View,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_CONFIGS,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { GlobeX, WifiX } from "phosphor-react-native";
import { StatusBar } from "expo-status-bar";

export type BottomSheetInternetModalRef = {
  present: () => void;
  dismiss: () => void;
};

export type BottomSheetInternetModalProps = {
  style?: StyleProp<ViewStyle>;
  bottomInset?: number;
  horizontalInset?: number;
};

const BottomSheetInternetModalRef = forwardRef<
  BottomSheetInternetModalRef,
  BottomSheetInternetModalProps
>(({ style, bottomInset = 20, horizontalInset = 24 }, ref) => {
  const height = useSharedValue(0);
  const transform = useSharedValue(0);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [showGlobeIcon, setShowGlobeIcon] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const handleClose = useCallback(() => {
    transform.value = height.value;
    bottomSheetRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transform]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height:
        Platform.OS === "ios"
          ? withSpring(height.value, ANIMATION_CONFIGS)
          : withTiming(height.value, {
              duration: ANIMATION_DURATION,
              easing: ANIMATION_EASING,
            }),
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            Platform.OS === "ios"
              ? withSpring(transform.value, ANIMATION_CONFIGS)
              : withTiming(transform.value, {
                  duration: ANIMATION_DURATION,
                  easing: ANIMATION_EASING,
                }),
        },
      ],
    };
  });

  const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
    <>
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="none"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      />
      <StatusBar style="dark" />
    </>
  );

  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showGlobeIcon ? 0 : 1),
    };
  });

  const globeIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showGlobeIcon ? 1 : 0),
      position: "absolute",
    };
  });

  const renderContent = useCallback(() => {
    return (
      <Animated.View
        style={styles.animatedView}
        entering={FadeIn}
        exiting={FadeOut}
        onLayout={(e: { nativeEvent: { layout: { height: any } } }) => {
          const measuredHeight = e.nativeEvent.layout.height;
          height.value = measuredHeight;
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            padding: 16,
            marginBottom: 10,
          }}
        >
          <View style={{ position: "relative", width: 90, height: 90 }}>
            <Animated.View style={iconStyle}>
              <WifiX size={90} />
            </Animated.View>
            <Animated.View style={[globeIconStyle, { top: 0 }]}>
              <GlobeX size={90} />
            </Animated.View>
          </View>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
          >
            No Internet Connectivity
          </Text>
          <Text style={{ fontSize: 16, color: "gray", textAlign: "center" }}>
            Please check your internet connection to continue using the app
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "black",
            width: "100%",
            padding: 10,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <Text style={{ fontSize: 14, color: "white", fontWeight: "bold" }}>
            Waiting for internet connection...
          </Text>
        </View>
      </Animated.View>
    );
  }, [handleClose, height]);

  return (
    <BottomSheetModal
      detached
      ref={bottomSheetRef}
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      android_keyboardInputMode="adjustResize"
      style={{ marginHorizontal: horizontalInset }}
      handleStyle={styles.bottomSheetHandle}
      containerStyle={styles.bottomSheetContainer}
      backgroundStyle={styles.bottomSheetBackground}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView
        style={[styles.bottomSheetView, { paddingBottom: bottomInset }]}
      >
        <Animated.View
          style={[styles.contentContainer, style, containerAnimatedStyle]}
        >
          <Animated.View style={[styles.animatedBox, animatedStyle]}>
            {renderContent()}
          </Animated.View>
        </Animated.View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
  },
  animatedBox: {
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  animatedView: {
    flex: 1,
    position: "absolute",
    width: "100%",
  },
  bottomSheetContainer: {
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  bottomSheetBackground: {
    borderRadius: 0,
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  bottomSheetHandle: {
    display: "none",
  },
  bottomSheetView: {
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    marginTop: "auto",
  },
});

BottomSheetInternetModalRef.displayName = "BottomSheetInternetModal";

export default BottomSheetInternetModalRef;
