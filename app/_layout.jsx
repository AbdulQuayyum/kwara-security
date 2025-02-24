import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
import { View, Text, Modal } from "react-native";
import * as Network from 'expo-network';

import { AuthProvider } from "../context/authcontext";
import "../styles/index.css";

const NetworkErrorModal = ({ isVisible }) => (
  <Modal animationType="fade" transparent={true} visible={isVisible}>
    <View className="items-center justify-center flex-1 bg-black/50">
      <View className="bg-white p-6 rounded-xl w-[80%] items-center">
        <Text className="mb-2 text-lg font-semibold text-red-500">No Internet Connection</Text>
        <Text className="text-center text-gray-600 font-regular">
          Please check your internet connection and try again.
        </Text>
      </View>
    </View>
  </Modal>
);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    black: require("../assets/fonts/Nunito-Black.ttf"),
    extrabold: require("../assets/fonts/Nunito-ExtraBold.ttf"),
    bold: require("../assets/fonts/Nunito-Bold.ttf"),
    semibold: require("../assets/fonts/Nunito-SemiBold.ttf"),
    medium: require("../assets/fonts/Nunito-Medium.ttf"),
    regular: require("../assets/fonts/Nunito-Regular.ttf"),
    light: require("../assets/fonts/Nunito-Light.ttf"),
    extralight: require("../assets/fonts/Nunito-ExtraLight.ttf")
  });

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    checkNetworkStatus();

    const intervalId = setInterval(checkNetworkStatus, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsOffline(!networkState.isConnected || !networkState.isInternetReachable);
    } catch (error) {
      console.error('Error checking network status:', error);
      setIsOffline(true);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NetworkErrorModal isVisible={isOffline} />
      <Stack />
    </AuthProvider>
  );
}