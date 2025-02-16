import { useState, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index";
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const ChangePassword = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext)
    const [values, setValues] = useState({ currentPassword: "", newPassword: "" });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const handleSubmit = async () => {
        const { currentPassword, newPassword } = values;
        if (!newPassword || !newPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword !== newPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        const requestBody = {
            currentPassword: currentPassword,
            newPassword: newPassword,
        };

        try {
            const response = await axios.post('https://kwara-security-api-production.up.railway.app/v1/auth/change-password', requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${authState?.token}`,
                    },
                }
            );

            if (response.data.success) {
                Alert.alert("Success", "Your password has been changed successfully.");
                router.navigate("/dashboard/home");
            } else {
                setError(response.data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                setError(error.response.data.message || "Failed to change password. Please try again.");
            } else {
                setError("Failed to change password. Please check your connection and try again.");
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px] ">
                    <TouchableOpacity onPress={() => { router.back() }} >
                        <Image source={images.arrowleft} style={{ height: 30, width: 30 }} />
                    </TouchableOpacity>
                    <View className="flex flex-col items-start gap-y-2">
                        <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Change Password</Text>
                    </View>
                    <View className="flex flex-col items-start w-full gap-y-4 ">
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary">
                                    Current Password
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-primary h-[60px] px-4 flex items-start focus:outline-none" secureTextEntry={!showCurrentPassword} value={values.currentPassword} onChangeText={(text) => handleChange("currentPassword", text)} />
                                <TouchableOpacity className="absolute top-12 right-4" onPress={() => setShowCurrentPassword(!showCurrentPassword)} >
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                        {showCurrentPassword ? "Hide" : "Show"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary">
                                    New Password
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-primary h-[60px] px-4 flex items-start focus:outline-none" secureTextEntry={!showNewPassword} value={values.newPassword} onChangeText={(text) => handleChange("newPassword", text)} />
                                <TouchableOpacity className="absolute top-12 right-4" onPress={() => setShowNewPassword(!showNewPassword)} >
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                        {showNewPassword ? "Hide" : "Show"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {error ? (
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#FF0000]">
                                {error}
                            </Text>
                        ) : null}
                    </View>
                    <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" onPress={handleSubmit}>
                        <Text style={{ fontFamily: fonts.light }} className="text-[#FFF] font-[600] leading-[21px] text-[16px]">Change Password</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePassword;
