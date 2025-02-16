import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

import BottomNavigation from '../../components/BottomNavigation';
import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const Home = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            setGreeting("Good Morning");
        } else if (currentHour >= 12 && currentHour < 17) {
            setGreeting("Good Afternoon");
        } else if (currentHour >= 17 && currentHour < 21) {
            setGreeting("Good Evening");
        } else {
            setGreeting("Good Night");
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-16 w-full max-w-[500px] ">
                    <View className="flex flex-col items-start gap-y-2">
                        <View className="flex flex-row items-center gap-x-2">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-xl flex flex-row items-center font-[700] text-[#0D0D0D]">
                                {greeting} {authState?.user?.name?.split(" ")[0]} <Image source={images.hi} style={{ height: 24, width: 21 }} />
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

export default Home;
