import { useState, useContext, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';

import { AuthContext } from '../context/authcontext';
import images from "../assets/images/index"
import { fonts } from "../assets/fonts";
import styles from "../styles/main";

const Login = () => {
    const router = useRouter();
    const [values, setValues] = useState({ emailAddress: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { authState, login } = useContext(AuthContext);

    useEffect(() => {
        if (authState.isAuthenticated && authState.user) {
            if (authState.user.isAdmin) {
                router.replace("/dashboard/analytics");
            } else {
                router.replace("/dashboard/home");
            }
        }
    }, [authState.isAuthenticated, authState.user]);

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const handleSubmit = async () => {
        const { emailAddress, password } = values;

        if (!emailAddress || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post('https://kwara-security-api-production.up.railway.app/v1/auth/signin', {
                emailAddress,
                password,
            });

            if (response.data.success) {
                await login(response.data.data.token);
                const waitForProfile = () => {
                    return new Promise((resolve) => {
                        const checkProfile = setInterval(() => {
                            if (authState.user) {
                                clearInterval(checkProfile);
                                resolve(authState.user);
                            }
                        }, 100);
                    });
                };

                const userProfile = await waitForProfile();
                console.log(userProfile)

                Alert.alert("Success", response.data.message || "Logged in successfully!");
                if (userProfile.isAdmin) {
                    router.navigate("/dashboard/analytics");
                } else {
                    router.navigate("/dashboard/home");
                }
            } else {
                Alert.alert("Error", response.data.error || "Failed to log in. Please try again.");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response) {
                Alert.alert("Error", error.response.data.message || "Failed to log in. Please try again.");
            } else {
                Alert.alert("Error", "Failed to log in. Please check your connection and try again.");
            }
        } finally {
            setIsLoading(false);
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
                            <Text style={{ fontFamily: fonts.semibold }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Hi, Welcome</Text>
                            <Image source={images.hi} style={{ height: 36, width: 31 }} />
                        </View>
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#0D0D0D]">
                            Welcome back! Log in to continue.
                        </Text>
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-6 ">
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    Email Address
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={values.emailAddress} onChangeText={(text) => handleChange("emailAddress", text)} />
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    Password
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full bg-transparent border rounded border-[#414141] text-[#0D0D0D] h-[60px] px-4 flex items-start focus:outline-none" secureTextEntry={!showPassword} value={values.password} onChangeText={(text) => handleChange("password", text)} />
                                <TouchableOpacity className="absolute top-12 right-4" onPress={() => setShowPassword(!showPassword)} >
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                        {showPassword ? "Hide" : "Show"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row items-center justify-end w-full">
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
                        <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" disabled={isLoading} onPress={handleSubmit}  >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">Log In</Text>
                            )}
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