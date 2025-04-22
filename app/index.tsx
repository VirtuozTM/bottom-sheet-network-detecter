import { Text, View } from "react-native";
import { useRef } from "react";
import { useEffect } from "react";
import BottomSheetInternetModal, {
  type BottomSheetInternetModalRef,
} from "@/components/BottomSheetInternetModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useStableNetInfo from "@/hooks/useStableNetInfo";

export default function Index() {
  const netInfo = useStableNetInfo(1000);
  const isConnected = !!netInfo?.isConnected;
  const connectionType = netInfo?.type ?? "unknown";
  const internetModalRef = useRef<BottomSheetInternetModalRef>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (netInfo === null) return;

    if (!isConnected) {
      internetModalRef.current?.dismiss();
    } else {
      internetModalRef.current?.present();
    }
  }, [isConnected]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#eeedf1",
        padding: 20,
        paddingTop: insets.top,
      }}
    >
      <Text style={{ fontSize: 35, fontWeight: "bold" }}>Network Monitor</Text>
      <Text style={{ fontSize: 16, color: "gray", marginTop: 20 }}>STATUS</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
          gap: 10,
          marginTop: 10,
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: isConnected ? "green" : "red",
            borderRadius: 5,
          }}
        />
        <Text style={{ fontSize: 16, color: "black" }}>
          {isConnected ? "Connected" : "Disconnected"}
        </Text>
      </View>

      <Text style={{ fontSize: 16, color: "gray", marginTop: 20 }}>
        CONNECTION TYPE
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
          gap: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 16, color: "black", marginLeft: 10 }}>
          {connectionType.toUpperCase()}
        </Text>
      </View>
      <BottomSheetInternetModal ref={internetModalRef} />
    </View>
  );
}
