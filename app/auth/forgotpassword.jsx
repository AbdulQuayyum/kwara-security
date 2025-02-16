import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';

import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const ForgotPassword = () => {
    const router = useRouter();
    const [values, setValues] = useState({ phoneNumber: "" });
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const validatePhoneNumber = (text) => {
        if (text.startsWith('+234') && text.length === 14) {
            handleChange("phoneNumber", text);
        } else if (text.length === 11 && !text.startsWith('+234')) {
            handleChange("phoneNumber", `+234${text}`);
        }
    };

    const handleSubmit = async () => {
        const { phoneNumber } = values;

        if (!phoneNumber) {
            setError("Please enter your phone number.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "https://kwara-security-api-production.up.railway.app/v1/auth/forgot-password",
                { phoneNumber }
            );

            if (response.data.success) {
                Alert.alert("Success", `${response.data.message || "Password reset link has been sent to your phone number."}`);
                router.navigate("/auth/resetpassword");
            } else {
                Alert.alert("Error", `${response.data.error || "Failed to send reset link. Please try again."}`);
            }
        } catch (error) {
            if (error.response) {
                Alert.alert("Error", `${error.response.data.error || "Something went wrong. Please try again."}`);
            } else if (error.request) {
                Alert.alert("Error", "Network error. Please check your connection.");
            } else {
                Alert.alert("Error", "An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-16 w-full max-w-[500px] ">
                    <View className="flex flex-col items-start gap-y-2">
                        <View className="flex flex-row items-end gap-x-2">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-[36px] font-[700] leading-[43px] textprimary ">Forgot password?</Text>
                        </View>
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] textprimary ">
                            No worries, we’ll help you reset it.
                        </Text>
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-6 ">
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col items-start w-full">
                                <View className="flex flex-col w-full gap-y-2">
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                        Phone Number
                                    </Text>
                                    <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={values.phoneNumber} onChangeText={validatePhoneNumber} keyboardType="phone-pad" maxLength={14} />
                                </View>
                            </View>
                        </View>
                        {error ? (
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#FF0000]">
                                {error}
                            </Text>
                        ) : null}
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-4">
                        <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" onPress={handleSubmit}  >
                            <Text style={{ fontFamily: fonts.light }} className="text-[#FFF] font-[600] leading-[21px] text-[16px]">Send Reset Link</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex flex-row items-center justify-center w-full gap-x-2">
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] textprimary ">Remember your password?</Text>
                        <TouchableOpacity onPress={() => { router.push("/") }}>
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[700] leading-[18px] text-primary">Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ForgotPassword;