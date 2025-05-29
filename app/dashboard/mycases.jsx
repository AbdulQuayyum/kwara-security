import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { AuthContext } from '../../context/authcontext';
import images from "../../assets/images/index";
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const MyCases = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const [cases, setCases] = useState([]);
    const [editingCaseId, setEditingCaseId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editForm, setEditForm] = useState({ subject: "", description: "" });

    useEffect(() => {
        if (authState?.user?.userID) {
            fetchUserCases();
        }
    }, [authState?.user?.userID]);

    const fetchUserCases = async () => {
        try {
            const response = await axios.post(
                `https://kwara-security-api.onrender.com/v1/user/user-cases/${authState.user.userID}`,
                {},
                { headers: { Authorization: `Bearer ${authState?.token}` } }
            );
            if (response.data.success) {
                setCases(response.data.data);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch cases");
            console.error(error);
        }
    };

    const handleEditToggle = (caseItem) => {
        setEditingCaseId(caseItem.caseID);
        setEditForm({
            subject: caseItem.subject,
            description: caseItem.description
        });
    };

    const handleEditChange = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditSubmit = async (caseId) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `https://kwara-security-api.onrender.com/v1/user/cases/${caseId}/update`,
                editForm, { headers: { Authorization: `Bearer ${authState?.token}` } }
            );
            if (response.data.success) {
                Alert.alert("Success", "Case updated successfully");
                setEditingCaseId(null);
                fetchUserCases();
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update case");
            console.error(error);
        } finally {
            setIsLoading(false);
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
                    <View className="flex flex-col items-start w-full gap-y-2">
                        <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">My Cases</Text>
                    </View>
                    <Text style={{ fontFamily: fonts.light }} className="text-xl flex flex-row items-start text-[#0D0D0D]">
                        {cases?.length > 0 ? `You have reported ${cases?.length} case${cases.length > 1 ? "s" : ""}, well done` : "You haven't reported any cases yet"}
                    </Text>
                    {cases.map((caseItem) => (
                        <View key={caseItem.caseID} className="flex flex-col items-start w-full border border-[#414141] rounded p-4 mb-4">
                            {editingCaseId === caseItem.caseID ? (
                                <View className="flex flex-col items-start w-full gap-y-4">
                                    <View className="flex flex-col items-start w-full gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                            Subject
                                        </Text>
                                        <TextInput style={{ fontFamily: fonts.extralight }} placeholder="Subject" value={editForm.subject} onChangeText={(text) => handleEditChange("subject", text)} className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4  py-2 flex items-start focus:outline-none focus:border-primary" />
                                    </View>
                                    <View className="flex flex-col items-start w-full gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                            Description
                                        </Text>
                                        <TextInput style={{ fontFamily: fonts.extralight }} placeholder="Description" value={editForm.description} onChangeText={(text) => handleEditChange("description", text)} multiline className="w-full border rounded border-[#414141] h-[60px] text-[#0D0D0D] py-2 bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" />
                                    </View>
                                    <TouchableOpacity className="flex h-[60px] items-center justify-center w-full py-2 rounded bg-primary" disabled={isLoading} onPress={() => handleEditSubmit(caseItem.caseID)}>
                                        {isLoading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">Save</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="flex flex-col items-start w-full gap-y-4">
                                    <View className="flex flex-row items-center justify-between w-full">
                                        <View className="flex flex-col items-start gap-y-2">
                                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                                Subject
                                            </Text>
                                            <Text style={{ fontFamily: fonts.light }} className="text-[18px] text-[#0D0D0D]">
                                                {caseItem.subject}
                                            </Text>
                                        </View>
                                        {/* <TouchableOpacity onPress={() => handleEditToggle(caseItem)}>
                                            <Image source={images.edit} style={{ height: 16, width: 16 }} />
                                        </TouchableOpacity> */}
                                    </View>
                                    <View className="flex flex-col items-start w-full gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                            Description
                                        </Text>
                                        <Text style={{ fontFamily: fonts.extralight }} className="text-[14px] text-[#0D0D0D] mt-2">
                                            {caseItem.description}
                                        </Text>
                                    </View>
                                    <View className="flex flex-col items-start w-full gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                            Time of incident
                                        </Text>
                                        <Text style={{ fontFamily: fonts.extralight }} className="text-[12px] text-[#0D0D0D] mt-2">
                                            {new Date(caseItem.time).toLocaleString()}
                                        </Text>
                                    </View>
                                    {caseItem.isViewed && (
                                        <View className="flex items-end justify-end w-full">
                                            <Image source={images.mark} style={{ height: 24, width: 24, marginTop: 8 }} />
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MyCases;