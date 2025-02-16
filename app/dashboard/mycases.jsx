import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

import BottomNavigation from '../../components/BottomNavigation';
import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const MyCases = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px] ">
                    <View className="flex flex-row items-center justify-between w-full">
                        <View className="flex flex-col items-start gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">My Cases</Text>
                        </View>
                    </View>
                    <View className="flex flex-col items-start gap-y-2">
                        <View className="flex flex-row items-center gap-x-2">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-xl flex flex-row items-center font-[700] text-[#0D0D0D]">
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MyCases;
