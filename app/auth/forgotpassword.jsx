import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';

import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const ForgotPassword = () => {
    const router = useRouter();
    const [values, setValues] = useState({ email: "" });
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const handleSubmit = () => {
        const { email } = values;

        // if (!email || !password) {
        //     setError("Please fill in all fields.");
        //     return;
        // }

        // setError("");
        // console.log("Form submitted", values);
        router.navigate("/auth/resetpassword")
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
                        <View className="relative flex flex-col w-full gap-y-2">
                            <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#FFFFFF" placeholder=' ' className="w-full border rounded border-[#414141] textprimary  h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary peer transition-all appearance-none duration-500" value={values.email} onChangeText={(text) => handleChange("email", text)} />
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-primary bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                Email Address
                            </Text>
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