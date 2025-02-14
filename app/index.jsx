import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';

import images from "../assets/images/index"
import { fonts } from "../assets/fonts";
import styles from "../styles/main";

const Login = () => {
    const router = useRouter();
    const [values, setValues] = useState({ emailAddress: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const handleSubmit = () => {
        const { emailAddress, password } = values;

        // if (!emailAddress || !password) {
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
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-16 w-full max-w-[500px] ">
                    <View className="flex flex-col items-start gap-y-2">
                        <View className="flex flex-row items-end gap-x-2">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Hi, Welcome</Text>
                            <Image source={images.hi} style={{ height: 36, width: 31 }} />
                        </View>
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#0D0D0D]">
                            Welcome back! Log in to continue.
                        </Text>
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-6 ">
                        <View className="flex flex-col items-start w-full">
                            <View className="relative flex flex-col w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary peer transition-all appearance-none duration-500" value={values.emailAddress} onChangeText={(text) => handleChange("emailAddress", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D] bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Email Address
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="relative flex flex-row items-center w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-[#0D0D0D] h-[60px] px-4 flex items-start focus:outline-none peer transition-all appearance-none duration-500" secureTextEntry={!showPassword} value={values.password} onChangeText={(text) => handleChange("password", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D] bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Password
                                </Text>
                                <TouchableOpacity className="absolute top-1/3 right-4" onPress={() => setShowPassword(!showPassword)} >
                                    {showPassword ? <Image source={images.eyeclose} style={{ height: 24, width: 24 }} /> : <Image source={images.eyeopen} style={{ height: 24, width: 24 }} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row items-center justify-between w-full">
                            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} className="flex flex-row items-center gap-x-2">
                                <View className="relative">
                                    <View className={`appearance-none w-5 h-5 border-2 rounded-full relative cursor-pointer border-[#00B15F] ${rememberMe ? " bg-[#00B15F]" : " bg-transparent "}`}  >
                                        {rememberMe && (
                                            <Text style={{ color: "#0D0D0D", fontSize: 14, fontWeight: "bold", position: "absolute", top: -2, left: 3 }}>
                                                ✓
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#0D0D0D]">
                                    Remember me
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { router.push("/auth/forgotpassword") }}>
                                <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#EC221F]">Forgot Password</Text>
                            </TouchableOpacity>
                        </View>

                        {error ? (
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#FF0000]">
                                {error}
                            </Text>
                        ) : null}
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-4">
                        <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" onPress={handleSubmit}  >
                            <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">Log In</Text>
                        </TouchableOpacity>
                        <View className="flex flex-row items-center justify-center w-full gap-x-2">
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#0D0D0D]">Don't have an account?</Text>
                            <TouchableOpacity onPress={() => { router.push("/auth/createaccount") }}>
                                <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;