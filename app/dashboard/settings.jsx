import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

import BottomNavigation from '../../components/BottomNavigation';
import DrawerNavigation from "../../components/DrawerNavigation";
import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";
import routes from '../../routes';

const Settings = () => {
    const router = useRouter();
    const { authState, logout } = useContext(AuthContext);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#0D0D0D" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-10 w-full max-w-[500px] ">
                    <View className="flex flex-row items-center justify-between w-full">
                        <View className="flex flex-col items-start gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Settings</Text>
                        </View>
                    </View>
                    <View className="flex flex-col items-start w-full">
                        <View className="flex flex-col items-start w-full gap-y-6">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[700] leading-[21px] text-[#0D0D0D]">Profile</Text>
                            <TouchableOpacity className="flex flex-row items-center justify-between w-full" onPress={() => { router.push(routes.profile) }}>
                                <View className="flex flex-row items-center gap-x-4">
                                    <View style={{ height: 52, width: 52, backgroundColor: "#F4F4F4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Image source={images.profile} style={{ height: 22, width: 22 }} />
                                    </View>
                                    <View className="flex items-start gap-y-1">
                                        <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[600] leading-[21px] text-[#0D0D0D]">
                                            {authState?.user?.name}
                                        </Text>
                                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#0D0D0D]">
                                            {authState?.user?.emailAddress}
                                        </Text>
                                    </View>
                                </View>
                                <Image source={images.carretright} style={{ height: 18, width: 18 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="flex flex-col items-start w-full">
                        <View className="flex flex-col items-start w-full gap-y-6">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[700] leading-[21px] text-[#0D0D0D]">Profile</Text>
                            <TouchableOpacity className="flex flex-row items-center justify-between w-full" onPress={() => { router.push(routes.mycases) }}>
                                <View className="flex flex-row items-center gap-x-4">
                                    <View style={{ height: 52, width: 52, backgroundColor: "#F4F4F4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Image source={images.reportedcases} style={{ height: 22, width: 22 }} />
                                    </View>
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[600] leading-[21px] text-[#0D0D0D]">
                                        Reported Cases
                                    </Text>
                                </View>
                                <Image source={images.carretright} style={{ height: 18, width: 18 }} />
                            </TouchableOpacity>
                            <TouchableOpacity className="flex flex-row items-center justify-between w-full" onPress={() => { router.push(routes.changepassword) }}>
                                <View className="flex flex-row items-center gap-x-4">
                                    <View style={{ height: 52, width: 52, backgroundColor: "#F4F4F4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Image source={images.changepassword} style={{ height: 22, width: 22 }} />
                                    </View>
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[600] leading-[21px] text-[#0D0D0D]">
                                        Change Password
                                    </Text>
                                </View>
                                <Image source={images.carretright} style={{ height: 18, width: 18 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-[#F4F4F4] flex-row w-full h-[60px] flex justify-center items-center gap-2 rounded-lg" onPress={() => { logout() }}  >
                        <Image source={images.logout} style={{ height: 24, width: 24 }} />
                        <Text style={{ logout: fonts.light }} className="text-[#FE0F0B] font-[600] leading-[21px] text-[16px]">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* <BottomNavigation /> */}
            <DrawerNavigation />
        </SafeAreaView>
    );
};

export default Settings;
