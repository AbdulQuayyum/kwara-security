import { useState, useEffect, useContext, useRef } from 'react';
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
    const scrollViewRef = useRef(null);
    const [cases, setCases] = useState([]);
    const [editingCaseId, setEditingCaseId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [editForm, setEditForm] = useState({ subject: "", description: "" });
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authState?.user?.userID) {
            fetchUserCases();
        }
    }, [authState?.user?.userID]);

    const fetchUserCases = async () => {
        try {
            setFetchLoading(true);
            setError(null);
            
            const response = await axios.post(
                `https://kwara-security-api.onrender.com/v1/user/user-cases/${authState.user.userID}`,
                {},
                { headers: { Authorization: `Bearer ${authState?.token}` } }
            );
            if (response.data.success) {
                setCases(response.data.data);
            }
        } catch (error) {
            setError('Failed to load cases');
            Alert.alert("Error", "Failed to fetch cases");
            console.error(error);
        } finally {
            setFetchLoading(false);
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
                editForm, 
                { headers: { Authorization: `Bearer ${authState?.token}` } }
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

    const cancelEdit = () => {
        setEditingCaseId(null);
        setEditForm({ subject: "", description: "" });
    };

    const scrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    const handleScroll = (event) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        setShowBackToTop(yOffset > 300);
    };

    const CaseCard = ({ caseItem }) => {
        if (!caseItem || !caseItem.caseID) {
            return null;
        }

        return (
            <View className="flex flex-col items-start w-full border border-[#414141] rounded p-4 mb-4 bg-white shadow-sm">
                {editingCaseId === caseItem.caseID ? (
                    <View className="flex flex-col items-start w-full gap-y-4">
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                Subject
                            </Text>
                            <TextInput style={{ fontFamily: fonts.extralight }} placeholder="Subject" value={editForm.subject} onChangeText={(text) => handleEditChange("subject", text)} className="w-full border rounded border-[#414141] text-[#0D0D0D] h-[60px] bg-transparent px-4 py-2 flex items-start focus:outline-none focus:border-primary" />
                        </View>
                        <View className="flex flex-col items-start w-full gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[16px] font-[500] leading-[21px] text-[#0D0D0D]">
                                Description
                            </Text>
                            <TextInput style={{ fontFamily: fonts.extralight }} placeholder="Description" value={editForm.description} onChangeText={(text) => handleEditChange("description", text)} multiline className="w-full border rounded border-[#414141] h-[60px] text-[#0D0D0D] py-2 bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" />
                        </View>
                        <View className="flex flex-row w-full gap-x-4">
                            <TouchableOpacity className="flex h-[60px] items-center justify-center flex-1 py-2 rounded bg-primary" disabled={isLoading} onPress={() => handleEditSubmit(caseItem.caseID)}>
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">Save</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="flex h-[60px] items-center justify-center flex-1 py-2 rounded bg-gray-500" 
                                disabled={isLoading} 
                                onPress={cancelEdit}
                            >
                                <Text style={{ fontFamily: fonts.light }} className="text-[#FFFFFF] font-[600] leading-[21px] text-[16px]">Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
                            <TouchableOpacity onPress={() => handleEditToggle(caseItem)}>
                                <Image source={images.edit} style={{ height: 16, width: 16 }} />
                            </TouchableOpacity>
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
                        <View className="flex flex-row items-center justify-between w-full">
                            <View className="flex flex-row gap-x-2">
                                <View className="px-2 py-1 bg-gray-100 rounded">
                                    <Text style={{ fontFamily: fonts.light }} className="text-sm">
                                        Status: {caseItem.isViewed ? 'Viewed' : 'Not Viewed'}
                                    </Text>
                                </View>
                                {caseItem.isResolved && (
                                    <View className="px-2 py-1 bg-green-100 rounded">
                                        <Text style={{ fontFamily: fonts.light }} className="text-sm text-green-600">
                                            Resolved
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {caseItem.isViewed && (
                                <Image source={images.mark} style={{ height: 24, width: 24 }} />
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            
            <View className="px-4 pt-4 pb-2 bg-white border-b border-gray-100">
                <View className="flex flex-row items-center justify-between w-full mb-4">
                    <TouchableOpacity onPress={() => { router.back() }}>
                        <Image source={images.arrowleft} style={{ height: 30, width: 30 }} />
                    </TouchableOpacity>
                    {error && (
                        <TouchableOpacity onPress={fetchUserCases} className="px-3 py-1 bg-red-500 rounded">
                            <Text className="text-sm text-white">Retry</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                <View className="flex flex-col items-start w-full pb-2 gap-y-2">
                    <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">
                        My Cases
                    </Text>
                    <Text style={{ fontFamily: fonts.light }} className="text-xl flex flex-row items-start text-[#0D0D0D]">
                        {cases?.length > 0 ? `You have reported ${cases?.length} case${cases.length > 1 ? "s" : ""}, well done` : "You haven't reported any cases yet"}
                    </Text>
                </View>
            </View>

            <ScrollView ref={scrollViewRef}showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}onScroll={handleScroll}scrollEventThrottle={16}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px] mx-auto">
                    {fetchLoading ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-gray-50">
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={{ fontFamily: fonts.light }} className="mt-4 text-gray-600">
                                Loading your cases...
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-red-50">
                            <Text style={{ fontFamily: fonts.medium }} className="mb-4 text-center text-red-600">
                                {error}
                            </Text>
                            <TouchableOpacity onPress={fetchUserCases} className="px-6 py-3 bg-red-500 rounded-lg">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-white">
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="w-full">
                            {cases.length === 0 ? (
                                <View className="items-center justify-center w-full py-6">
                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">
                                        No cases found
                                    </Text>
                                </View>
                            ) : (
                                cases.map((caseItem) => (
                                    <CaseCard key={caseItem.caseID} caseItem={caseItem} />
                                ))
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {showBackToTop && (
                <TouchableOpacity onPress={scrollToTop} className="absolute p-3 bg-blue-500 rounded-full shadow-lg bottom-6 right-4" style={{ elevation: 5 }}>
                    <Text className="font-bold text-white">↑</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default MyCases;