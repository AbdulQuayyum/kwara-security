import { Stack } from "expo-router";
import { useFonts } from "expo-font";

import { AuthProvider } from "../context/authcontext";
import "../styles/index.css";

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}