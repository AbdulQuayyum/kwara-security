import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const ResetPassword = () => {
    const router = useRouter();
    const [values, setValues] = useState({ token: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const handleSubmit = async () => {
        const { token, password, confirmPassword } = values;
        if (!token || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        setIsLoading(true);

        const requestBody = {
            token,
            newPassword: password,
        };

        try {
            const response = await axios.post('https://kwara-security-api.onrender.com/v1/auth/reset-password', requestBody);

            if (response.data.success) {
                Alert.alert("Success", "Your password has been reset successfully.");
                router.navigate("/");
            } else {
                setError(response.data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                setError(error.response.data.message || "Failed to reset password. Please try again.");
            } else {
                setError("Failed to reset password. Please check your connection and try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#0D0D0D" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-16 w-full max-w-[500px] ">
                    <View className="flex flex-col items-start gap-y-2">
                        <View className="flex flex-row items-end gap-x-2">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-[36px] font-[700] leading-[43px] text-primary">Reset password</Text>
                        </View>
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">
                            Enter your new password to regain access.
                        </Text>
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-4 ">
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary">
                                    Token
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-primary h-[60px] px-4 flex items-start focus:outline-none" value={values.token} onChangeText={(text) => handleChange("token", text)} keyboardType="numeric" />
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary">
                                    Password
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-primary h-[60px] px-4 flex items-start focus:outline-none" secureTextEntry={!showPassword} value={values.password} onChangeText={(text) => handleChange("password", text)} />
                                <TouchableOpacity className="absolute top-12 right-4" onPress={() => setShowPassword(!showPassword)} >
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                        {showPassword ? "Hide" : "Show"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary">
                                    Confirm Password
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-primary h-[60px] px-4 flex items-start focus:outline-none" secureTextEntry={!showConfirmPassword} value={values.confirmPassword} onChangeText={(text) => handleChange("confirmPassword", text)} />
                                <TouchableOpacity className="absolute top-12 right-4" onPress={() => setShowConfirmPassword(!showConfirmPassword)} >
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                        {showConfirmPassword ? "Hide" : "Show"}
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
                    <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" disabled={isLoading} onPress={handleSubmit}>
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">Update Password</Text>
                        )}
                    </TouchableOpacity>
                    <View className="flex flex-row items-center justify-center w-full gap-x-2">
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">Remember your password?</Text>
                        <TouchableOpacity onPress={() => { router.push("/") }}>
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[700] leading-[18px] text-primary">Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ResetPassword;