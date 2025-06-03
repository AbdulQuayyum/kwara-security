import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { addToQueue, processQueue } from '../../utilities/offlinequeue';
import BottomNavigation from '../../components/BottomNavigation';
import DrawerNavigation from "../../components/DrawerNavigation";
import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index";
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const Home = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const [greeting, setGreeting] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        useCurrentTime: true
    });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected && state.isInternetReachable);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isOnline && authState.isAuthenticated) {
            processQueue(authState.token).then(count => {
                if (count > 0) {
                    Alert.alert("Success", `${count} offline reports were successfully submitted`);
                }
            }).catch(error => {
                console.error('Error processing queue:', error);
            });
        }
    }, [isOnline, authState.isAuthenticated]);

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

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.subject.trim()) {
            Alert.alert("Error", "Please enter a subject");
            return false;
        }
        if (!formData.description.trim()) {
            Alert.alert("Error", "Please enter a description");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!authState?.isAuthenticated) {
            console.log('User not authenticated');
            Alert.alert("Error", "You need to be authenticated to submit reports");
            return;
        }

        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        const generateSimpleId = () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        };

        const reportData = {
            userID: authState.user.userID,
            subject: formData.subject.trim(),
            description: formData.description.trim(),
            time: new Date().toISOString(),
            localId: generateSimpleId()
        };

        setIsLoading(true);

        try {
            if (isOnline) {
                const response = await axios.post(
                    'https://kwara-security-api.onrender.com/v1/user/report-case',
                    reportData,
                    {
                        headers: {
                            'Authorization': `Bearer ${authState.token}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 15000,
                    }
                );

                if (response.data?.success) {
                    // console.log('Success response received');
                    Alert.alert("Success", "Report submitted successfully");
                    setFormData({
                        subject: "",
                        description: "",
                        useCurrentTime: true
                    });
                } else {
                    // console.log('Success field is false or missing');
                    throw new Error(response.data?.message || "Server returned unsuccessful response");
                }
            } else {
                console.log('Saving offline...');

                if (typeof addToQueue !== 'function') {
                    throw new Error("Offline queue function is not available");
                }

                const added = await addToQueue(reportData);
                // console.log('Added to queue:', added);

                if (added) {
                    Alert.alert("Report Saved", "Your report has been saved and will be submitted when you're back online");
                    setFormData({
                        subject: "",
                        description: "",
                        useCurrentTime: true
                    });
                } else {
                    throw new Error("Failed to save report offline");
                }
            }
        } catch (error) {
            console.error('Submit error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack
            });

            let errorMessage = "Failed to submit report";

            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = "Network error: Please check your connection";
            } else {
                errorMessage = error.message || "Unknown error occurred";
            }

            Alert.alert("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px]">
                    <View className="flex flex-row items-center justify-between w-full">
                        <View className="flex flex-col items-start gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Home</Text>
                        </View>
                        <View className={`px-2 py-1 rounded-full ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
                            <Text className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                {isOnline ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex flex-col items-start gap-y-2">
                        <View className="flex flex-row items-center gap-x-2">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-xl flex flex-row items-center font-[700] text-[#0D0D0D]">
                                {greeting} {authState?.user?.name?.split(" ")[0]}
                                <Image source={images.hi} style={{ height: 24, width: 21, marginLeft: 8 }} />
                            </Text>
                        </View>
                    </View>

                    <View className="flex flex-col items-start w-full">
                        <View className="flex flex-col w-full gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                 Case Title (What is the case about?)
                            </Text>
                            <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder='E.g. Suspicious activity near my home' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={formData.subject} onChangeText={(text) => handleChange("subject", text)} editable={!isLoading} />
                        </View>
                    </View>

                    <View className="flex flex-col items-start w-full">
                        <View className="flex flex-col w-full gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                Case Description (Please provide full details)
                            </Text>
                            <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder='Provide details like location, time, individuals involved, and what happened.' className="w-full border py-4 rounded border-[#414141] text-[#0D0D0D] justify-start h-[120px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" multilinetextAlignVertical="top" value={formData.description} onChangeText={(text) => handleChange("description", text)} editable={!isLoading} />
                        </View>
                    </View>

                    <TouchableOpacity className={`w-full h-[60px] flex justify-center items-center rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-primary'}`} disabled={isLoading} onPress={handleSubmit} activeOpacity={0.7} >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">
                                Submit Report
                            </Text>
                        )}
                    </TouchableOpacity>

                    {!isOnline && (
                        <View className="w-full p-3 bg-yellow-100 rounded-lg">
                            <Text className="text-sm text-center text-yellow-800">
                                You're currently offline. Reports will be saved locally and submitted when connection is restored.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <DrawerNavigation />
        </SafeAreaView>
    );
};

export default Home;