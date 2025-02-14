import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';

import images from "../../assets/images/index"
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const CreateAccount = () => {
    const router = useRouter();

    const [values, setValues] = useState({ name: "", state: "", emailAddress: "", community: "", ward: "", lga: "", nin: "", phoneNumber: "", password: "" });
    const [dropdowns, setDropdowns] = useState({ state: false, lga: false, ward: false });
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };

    const toggleDropdown = (field) => {
        setDropdowns((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const states = ["Lagos", "Ogun", "Abuja", "Kano"]; // Example states
    const lgas = { "Lagos": ["Ikeja", "Surulere"], "Ogun": ["Abeokuta", "Sagamu"] }; // Example LGAs
    const wards = { "Ikeja": ["Ward 1", "Ward 2"], "Abeokuta": ["Ward A", "Ward B"] }; // Example Wards

    const handleSubmit = () => {
        const { name, state, emailAddress } = values;

        if (!name || !state || !emailAddress) {
            setError("Please fill in all fields.");
            return;
        }

        if (!acceptedTerms) {
            setError("You must accept the terms and conditions.");
            return;
        }

        setError("");
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
                        <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-primary">Sign Up</Text>
                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">
                            Sign up to report security cases in your community in one go!
                        </Text>
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-6 ">
                        <View className="flex flex-col items-start w-full">
                            <View className="relative flex flex-col w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary peer transition-all appearance-none duration-500" value={values.name} onChangeText={(text) => handleChange("name", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D] bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Full Name
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full">
                            <View className="relative flex flex-col w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary peer transition-all appearance-none duration-500" value={values.emailAddress} onChangeText={(text) => handleChange("emailAddress", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D] bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Email Address
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full">
                            <View className="relative flex flex-col w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary peer transition-all appearance-none duration-500" value={values.phoneNumber} onChangeText={(text) => handleChange("phoneNumber", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D] bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Phone Number
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-col items-start w-full">
                            <View className="relative flex flex-col w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary peer transition-all appearance-none duration-500" value={values.nin} onChangeText={(text) => handleChange("nin", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D] bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    NIN
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => toggleDropdown("state")} className="border p-4 rounded w-full">
                            <Text style={{ fontFamily: fonts.light }}>{values.state || "Select State"}</Text>
                        </TouchableOpacity>
                        {dropdowns.state && (
                            <View className="border rounded p-2 w-full flex flex-col">
                                {states.map((item) => (
                                    <TouchableOpacity className="w-full py-2" key={item} onPress={() => { handleChange("state", item); toggleDropdown("state"); }}>
                                        <Text style={{ fontFamily: fonts.light }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {values.state && (
                            <TouchableOpacity onPress={() => toggleDropdown("lga")} className="border p-4 rounded w-full">
                                <Text style={{ fontFamily: fonts.light }}>{values.lga || "Select LGA"}</Text>
                            </TouchableOpacity>
                        )}
                        {dropdowns.lga && values.state && (
                            <View className="border rounded p-2 w-full flex flex-col">
                                {lgas[values.state]?.map((item) => (
                                    <TouchableOpacity className="w-full py-2" key={item} onPress={() => { handleChange("lga", item); toggleDropdown("lga"); }}>
                                        <Text style={{ fontFamily: fonts.light }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {values.lga && (
                            <TouchableOpacity onPress={() => toggleDropdown("ward")} className="border p-4 rounded w-full">
                                <Text style={{ fontFamily: fonts.light }}>{values.ward || "Select Ward"}</Text>
                            </TouchableOpacity>
                        )}
                        {dropdowns.ward && values.lga && (
                            <View className="border rounded p-2 w-full flex flex-col">
                                {wards[values.lga]?.map((item) => (
                                    <TouchableOpacity className="w-full py-2" key={item} onPress={() => { handleChange("ward", item); toggleDropdown("ward"); }}>
                                        <Text style={{ fontFamily: fonts.light }}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        <View className="flex flex-col items-start w-full">
                            <View className="relative flex flex-col w-full gap-y-2">
                                <TextInput style={{ fontFamily: fonts.extralight }} placeholderTextColor="#0D0D0D" placeholder=' ' className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary peer transition-all appearance-none duration-500" value={values.community} onChangeText={(text) => handleChange("community", text)} />
                                <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D] bg-[#FFF] absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-4 peer-focus:px-2 peer-focus:text-[#8A8A8A] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                                    Community
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
                        <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} className="flex flex-row items-center gap-x-2">
                            <View className="relative">
                                <View className={`appearance-none w-5 h-5 border-2 rounded-full relative cursor-pointer border-[#00B15F] ${acceptedTerms ? " bg-[#00B15F]" : " bg-transparent "}`}  >
                                    {acceptedTerms && (
                                        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold", position: "absolute", top: -2, left: 3 }}>
                                            ✓
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-primary">
                                I accept the terms and privacy policies.
                            </Text>
                        </TouchableOpacity>

                        {error ? (
                            <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#FF0000]">
                                {error}
                            </Text>
                        ) : null}
                    </View>

                    <View className="flex flex-col items-start w-full gap-y-4">
                        <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" onPress={handleSubmit}  >
                            <Text style={{ fontFamily: fonts.light }} className="text-[#FFF] font-[600] leading-[21px] text-[16px]">Sign Up</Text>
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