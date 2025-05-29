import { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView, View, Text, Image, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';

import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const CreateAccount = () => {
    const router = useRouter();

    const [values, setValues] = useState({ name: "", state: "", emailAddress: "", community: "", ward: "", lga: "", nin: "", phoneNumber: "", password: "" });
    const [dropdowns, setDropdowns] = useState({ state: false, lga: false, ward: false });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [lgas, setLgas] = useState({});

    useEffect(() => {
        axios.post('https://kwara-security-api.onrender.com/v1/misc/states')
            .then(response => {
                setStates(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching states:', error);
            });
    }, []);

    const fetchLgasAndWards = (state) => {
        axios.post('https://kwara-security-api.onrender.com/v1/misc/lgas-and-wards')
            .then(response => {
                const allLgasAndWards = response.data.data;
                setLgas(allLgasAndWards);
            })
            .catch(error => {
                console.error('Error fetching LGAs and wards:', error);
            });
    };

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
        if (field === 'state') {
            fetchLgasAndWards(value);
        }
    };

    const validatePhoneNumber = (text) => {
        let formattedNumber = text;

        if (text.startsWith('+234') && text.length === 14) {
            formattedNumber = text;
        } else if (text.startsWith('0') && text.length === 11) {
            formattedNumber = `+234${text.slice(1)}`;
        } else {
            formattedNumber = text;
        }
        handleChange("phoneNumber", formattedNumber);
    };

    const validateNIN = (text) => {
        if (/^\d{0,11}$/.test(text)) {
            handleChange("nin", text);
        }
    };

    const toggleDropdown = (field) => {
        setDropdowns((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = () => {
        const { name, state, emailAddress, community, ward, lga, nin, phoneNumber, password } = values;

        if (!name || !state || !emailAddress || !community || !ward || !lga || !nin || !phoneNumber || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        setIsLoading(true);

        axios.post('https://kwara-security-api.onrender.com/v1/auth/create-account', values)
            .then(response => {
                if (response.data.success) {
                    Alert.alert("Success", response.data.message || "Account created successfully! Please wait for admin verification.");

                    router.navigate("/");
                } else {
                    Alert.alert("Error", response.data.error || "Failed to create account. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error creating account:', error);

                if (error.response) {
                    Alert.alert("Error", error.response.data.message || "Failed to create account. Please try again.");
                } else {
                    Alert.alert("Error", "Failed to create account. Please check your connection and try again.");
                }
            });

        setIsLoading(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-16 w-full max-w-[500px] ">
                    <View className="flex flex-col items-start gap-y-2">
                        <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-primary">Sign Up</Text>
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">
                            Sign up to report security cases in your community in one go!
                        </Text>
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-6 ">
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    Full Name
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={values.name} onChangeText={(text) => handleChange("name", text)} />
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    Email Address
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={values.emailAddress} onChangeText={(text) => handleChange("emailAddress", text)} />
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    Phone Number
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={values.phoneNumber} onChangeText={validatePhoneNumber} keyboardType="phone-pad" maxLength={14} />
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    NIN
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={values.nin} onChangeText={validateNIN} keyboardType="numeric" maxLength={11} />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => toggleDropdown("state")} className="w-full p-4 border rounded">
                            <Text style={{ fontFamily: fonts.light }}>{values.state || "Select State"}</Text>
                        </TouchableOpacity>
                        {dropdowns.state && (
                            <View className="flex flex-col w-full p-2 border rounded">
                                {states.map((item) => (
                                    <TouchableOpacity className="flex flex-row items-center py-2 gap-x-2" key={item} onPress={() => { handleChange("state", item); toggleDropdown("state"); }}>
                                        <View className="relative">
                                            <View className={`appearance-none w-5 h-5 border-2 rounded-full relative cursor-pointer  border-[#000000] ${values.state === item ? " bg-[#000000]" : " bg-transparent "}`}  >
                                                {values.state === item && (
                                                    <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold", position: "absolute", top: -2, left: 3 }}>
                                                        ✓
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <Text style={{ fontFamily: fonts.light }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {values.state && (
                            <TouchableOpacity onPress={() => toggleDropdown("lga")} className="w-full p-4 border rounded">
                                <Text style={{ fontFamily: fonts.light }}>{values.lga || "Select LGA"}</Text>
                            </TouchableOpacity>
                        )}
                        {dropdowns.lga && values.state && (
                            <View className="flex flex-col w-full p-2 border rounded">
                                {Object.keys(lgas)?.map((item) => (
                                    <TouchableOpacity className="flex flex-row items-center py-2 gap-x-2" key={item} onPress={() => { handleChange("lga", item); toggleDropdown("lga"); }}>
                                        <View className="relative">
                                            <View className={`appearance-none w-5 h-5 border-2 rounded-full relative cursor-pointer  border-[#000000] ${values.lga === item ? " bg-[#000000]" : " bg-transparent "}`}  >
                                                {values.lga === item && (
                                                    <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold", position: "absolute", top: -2, left: 3 }}>
                                                        ✓
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <Text style={{ fontFamily: fonts.light }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {values.lga && (
                            <TouchableOpacity onPress={() => toggleDropdown("ward")} className="w-full p-4 border rounded">
                                <Text style={{ fontFamily: fonts.light }}>{values.ward || "Select Ward"}</Text>
                            </TouchableOpacity>
                        )}
                        {dropdowns.ward && values.lga && (
                            <View className="flex flex-col w-full p-2 border rounded">
                                {lgas[values.lga]?.map((item) => (
                                    <TouchableOpacity className="flex flex-row items-center py-2 gap-x-2" key={item} onPress={() => { handleChange("ward", item); toggleDropdown("ward"); }}>
                                        <View className="relative">
                                            <View className={`appearance-none w-5 h-5 border-2 rounded-full relative cursor-pointer  border-[#000000] ${values.ward === item ? " bg-[#000000]" : " bg-transparent "}`}  >
                                                {values.ward === item && (
                                                    <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold", position: "absolute", top: -2, left: 3 }}>
                                                        ✓
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <Text style={{ fontFamily: fonts.light }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        <View className="flex flex-col items-start w-full">
                            <View className="flex flex-col w-full gap-y-2">
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                    Community
                                </Text>
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" value={values.community} onChangeText={(text) => handleChange("community", text)} />
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <View className="relative flex flex-col w-full gap-y-2">
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
                                <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">Sign Up</Text>
                            )}
                        </TouchableOpacity>
                        <View className="flex flex-row items-center justify-center w-full gap-x-2">
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">Already have an account?</Text>
                            <TouchableOpacity onPress={() => { router.push("/") }}>
                                <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateAccount;