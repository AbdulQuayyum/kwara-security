import { useState, useContext, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index";
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const Profile = () => {
    const router = useRouter();
    const { authState, updateUserProfile } = useContext(AuthContext);
    const [fields, setFields] = useState({
        emailAddress: { value: authState?.user?.emailAddress || '', isEditing: false },
        name: { value: authState?.user?.name || '', isEditing: false },
        phoneNumber: { value: authState?.user?.phoneNumber || '', isEditing: false },
        nin: { value: authState?.user?.nin || '', isEditing: false },
        state: { value: authState?.user?.state || '', isEditing: false },
        lga: { value: authState?.user?.lga || '', isEditing: false },
        ward: { value: authState?.user?.ward || '', isEditing: false },
        community: { value: authState?.user?.community || '', isEditing: false },
    });
    const [states, setStates] = useState([]);
    const [lgas, setLgas] = useState({});
    const [dropdowns, setDropdowns] = useState({
        state: false,
        lga: false,
        ward: false,
    });

    useEffect(() => {
        axios.post('https://kwara-security-api-production.up.railway.app/v1/misc/states')
            .then(response => {
                setStates(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching states:', error);
            });
    }, []);

    const fetchLgasAndWards = () => {
        axios.post('https://kwara-security-api-production.up.railway.app/v1/misc/lgas-and-wards')
            .then(response => {
                setLgas(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching LGAs and wards:', error);
            });
    };

    useEffect(() => {
        fetchLgasAndWards();
    }, []);

    const toggleDropdown = (field) => {
        setDropdowns((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleEditToggle = (field) => {
        setFields((prev) => ({
            ...prev,
            [field]: { ...prev[field], isEditing: !prev[field].isEditing },
        }));
    };

    const handleChange = (field, value) => {
        setFields((prev) => ({
            ...prev,
            [field]: { ...prev[field], value },
        }));
    };

    const handleUpdateProfile = async () => {
        const updatedProfile = {
            emailAddress: fields.emailAddress.value,
            name: fields.name.value,
            phoneNumber: fields.phoneNumber.value,
            nin: fields.nin.value,
            state: fields.state.value,
            lga: fields.lga.value,
            ward: fields.ward.value,
            community: fields.community.value,
        };

        const result = await updateUserProfile(updatedProfile);

        if (result.success) {
            Alert.alert("Success", result.message);
        } else {
            Alert.alert("Error", result.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px] ">
                    <TouchableOpacity onPress={() => { router.back() }} >
                        <Image source={images.arrowleft} style={{ height: 30, width: 30 }} />
                    </TouchableOpacity>
                    <View className="flex flex-col items-start gap-y-2">
                        <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Profile</Text>
                    </View>
                    <View className="flex flex-col items-start w-full gap-y-8">
                        {Object.keys(fields).map((field) => (
                            <View key={field} className="flex flex-row items-end justify-between w-full">
                                <View className="flex items-start w-full gap-y-1">
                                    <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[600] leading-[21px] text-[#0D0D0D] capitalize">
                                        {field.replace(/([A-Z])/g, ' $1').trim()}
                                    </Text>
                                    {fields[field].isEditing ? (
                                        field === 'state' || field === 'lga' || field === 'ward' ? (
                                            <>
                                                <TouchableOpacity onPress={() => toggleDropdown(field)} className="w-full p-4 border rounded">
                                                    <Text style={{ fontFamily: fonts.light }}>{fields[field].value || `Select ${field}`}</Text>
                                                </TouchableOpacity>
                                                {dropdowns[field] && (
                                                    <View className="flex flex-col w-full p-2 border rounded">
                                                        {(field === 'state' ? states : field === 'lga' ? Object.keys(lgas) : lgas[fields.lga.value] || []).map((item) => (
                                                            <TouchableOpacity className="flex flex-row items-center py-2 gap-x-2" key={item} onPress={() => { handleChange(field, item); toggleDropdown(field); }}>
                                                                <View className="relative">
                                                                    <View className={`appearance-none w-5 h-5 border-2 rounded-full relative cursor-pointer border-[#000000] ${fields[field].value === item ? "bg-[#000000]" : "bg-transparent"}`}>
                                                                        {fields[field].value === item && (
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
                                            </>
                                        ) : (
                                            <TextInput style={{ fontFamily: fonts.extralight, width: "100%" }} value={fields[field].value} onChangeText={(value) => handleChange(field, value)} className="text-[14px] py-4 px-4 h-[48px] font-[400] leading-[18px] text-[#0D0D0D] border-b border-[#0D0D0D] w-full" autoFocus />
                                        )
                                    ) : (
                                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] font-[400] leading-[18px] text-[#0D0D0D]">
                                            {fields[field].value}
                                        </Text>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => handleEditToggle(field)}>
                                    <Image source={images.edit} style={{ height: 16, width: 16 }} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity className="bg-primary w-full h-[60px] flex justify-center items-center rounded-lg" onPress={handleUpdateProfile}>
                        <Text style={{ fontFamily: fonts.light }} className="text-[#FFF] font-[600] leading-[21px] text-[16px]">
                            Update Profile
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;