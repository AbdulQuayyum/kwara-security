import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';

import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const ResetPassword = () => {
    const router = useRouter();
    const [values, setValues] = useState({ password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const handleSubmit = () => {
        const { password, confirmPassword } = values;

        // if (!email || !password) {
        //     setError("Please fill in all fields.");
        //     return;
        // }

        // setError("");
        // console.log("Form submitted", values);
        router.navigate("/dashboard/home")
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
                            <View className="relative flex flex-row items-center w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-primary h-[60px] px-4 flex items-start focus:outline-none peer transition-all appearance-none duration-500" secureTextEntry={!showPassword} value={values.password} onChangeText={(text) => handleChange("password", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Password
                                </Text>
                                <TouchableOpacity className="absolute top-1/3 right-4" onPress={() => setShowPassword(!showPassword)} >
                                    {showPassword ? <Image source={images.eyeclose} style={{ height: 24, width: 24}} /> : <Image source={images.eyeopen} style={{ height: 24, width: 24}} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="relative flex flex-row items-center w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-primary h-[60px] px-4 flex items-start focus:outline-none peer transition-all appearance-none duration-500" secureTextEntry={!showConfirmPassword} value={values.confirmPassword} onChangeText={(text) => handleChange("confirmPassword", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Confirm Password
                                </Text>
                                <TouchableOpacity className="absolute top-1/3 right-4" onPress={() => setShowConfirmPassword(!showConfirmPassword)} >
                                    {showConfirmPassword ? <Image source={images.eyeclose} style={{ height: 24, width: 24}} /> : <Image source={images.eyeopen} style={{ height: 24, width: 24}} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {error ? (
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#FF0000]">
                                {error}
                            </Text>
                        ) : null}
                    </View>
                    <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" onPress={handleSubmit}  >
                        <Text style={{ fontFamily: fonts.light }} className="text-[#FFF] font-[600] leading-[21px] text-[16px]">Update Password</Text>
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