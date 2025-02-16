import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, DateTimePicker } from 'react-native';

import BottomNavigation from '../../components/BottomNavigation';
import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index";
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const Home = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const [greeting, setGreeting] = useState("");
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        useCurrentTime: true,
        time: new Date(),
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

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

    const handleSubmit = async () => {
        const formattedTime = formData.useCurrentTime
            ? new Date().toISOString()
            : formData.time.toISOString();

        const reportData = {
            userID: authState?.user?.userID,
            subject: formData.subject,
            description: formData.description,
            time: formattedTime,
        };

        try {
            const response = await axios.post(
                'https://kwara-security-api-production.up.railway.app/v1/user/report-case',
                reportData,
                {
                    headers: {
                        Authorization: `Bearer ${authState?.token}`,
                    },
                }
            );
            Alert.alert("Success", "Report submitted successfully");
            console.log(response.data);
        } catch (error) {
            Alert.alert("Error", "Failed to submit report");
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px] ">
                    <View className="flex flex-row items-center justify-between w-full">
                        <View className="flex flex-col items-start gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Home</Text>
                        </View>
                    </View>
                    <View className="flex flex-col items-start gap-y-2">
                        <View className="flex flex-row items-center gap-x-2">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-xl flex flex-row items-center font-[700] text-[#0D0D0D]">
                                {greeting} {authState?.user?.name?.split(" ")[0]} <Image source={images.hi} style={{ height: 24, width: 21 }} />
                            </Text>
                        </View>
                    </View>

                    {/* Report Form */}
                    <View className="flex flex-col items-start w-full">
                        <View className="flex flex-col w-full gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                Subject
                            </Text>
                            <TextInput
                                style={{ fontFamily: fonts.extralight }}
                                placeholderTextColor="#0D0D0D"
                                placeholder='Enter subject'
                                className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary"
                                value={formData.subject}
                                onChangeText={(text) => handleChange("subject", text)}
                            />
                        </View>
                    </View>

                    <View className="flex flex-col items-start w-full">
                        <View className="flex flex-col w-full gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                Description
                            </Text>
                            <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder='Enter description' className="w-full border py-4 rounded border-[#414141] text-[#0D0D0D] h-[120px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" multiline value={formData.description} onChangeText={(text) => handleChange("description", text)} />
                        </View>
                    </View>

                    <View className="flex flex-col items-start w-full">
                        <View className="flex flex-col w-full gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                Did it happen now?
                            </Text>
                            <View className="flex flex-row items-center gap-x-4">
                                <TouchableOpacity className={`px-4 py-2 rounded ${formData.useCurrentTime ? 'bg-primary' : 'bg-gray-200'}`} onPress={() => handleChange("useCurrentTime", true)}>
                                    <Text style={{ fontFamily: fonts.extralight }} className={`${formData.useCurrentTime ? "text-[#FFF]" : "text-[#0D0D0D]"}`}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={`px-4 py-2 rounded ${!formData.useCurrentTime ? 'bg-primary' : 'bg-gray-200'}`} onPress={() => handleChange("useCurrentTime", false)}>
                                    <Text style={{ fontFamily: fonts.extralight }} className={`${!formData.useCurrentTime ? "text-[#FFF]" : "text-[#0D0D0D]"}`}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {!formData.useCurrentTime && (
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    When did it happen?
                                </Text>
                                <TouchableOpacity className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-center justify-center" onPress={() => setShowDatePicker(true)}>
                                    <Text style={{ fontFamily: fonts.extralight }}>{formData.time.toLocaleString()}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={formData.time}
                                        mode="datetime"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                handleChange("time", selectedDate);
                                            }
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                    )}

                    <TouchableOpacity className="flex items-center justify-center w-full py-3 rounded bg-primary" onPress={handleSubmit}>
                        <Text style={{ fontFamily: fonts.semibold }} className="text-[#FFFFFF]">Submit Report</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

export default Home;