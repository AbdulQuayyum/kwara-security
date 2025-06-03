import { useState, useEffect, useContext, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar } from 'react-native';

import BottomNavigation from '../../components/BottomNavigation';
import DrawerNavigation from "../../components/DrawerNavigation";
import { AuthContext } from '../../context/authcontext';
import { fonts } from "../../assets/fonts";
import images from '../../assets/images';
import styles from "../../styles/main";

const Cases = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const scrollViewRef = useRef(null);
    const [cases, setCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [error, setError] = useState(null);

    const fetchCases = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await axios.post('https://kwara-security-api.onrender.com/v1/admin/cases',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );
            if (response.data.success) {
                setCases(response.data.data);
                setFilteredCases(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cases:', error);
            setError('Failed to load cases');
            Alert.alert('Error', 'Failed to fetch cases');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredCases(cases);
            return;
        }

        try {
            setSearchLoading(true);
            
            const response = await axios({
                method: 'post',
                url: 'https://kwara-security-api.onrender.com/v1/admin/search',
                params: {
                    query: query.trim(),
                    type: 'cases'
                },
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                }
            });

            if (response.data.success) {
                setFilteredCases(response.data.data);
            } else {
                setFilteredCases([]);
            }
        } catch (error) {
            Alert.alert('Error', 'Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const markCaseAsViewed = async (caseID) => {
        try {
            const response = await axios.post(
                `https://kwara-security-api.onrender.com/v1/admin/cases/${caseID}/checkout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );

            if (response.data.success) {
                setFilteredCases((prevCases) =>
                    prevCases.map((caseItem) =>
                        caseItem?.caseID === caseID ? { ...caseItem, isViewed: true } : caseItem
                    )
                );
                setCases((prevCases) =>
                    prevCases.map((caseItem) =>
                        caseItem?.caseID === caseID ? { ...caseItem, isViewed: true } : caseItem
                    )
                );
                Alert.alert('Success', 'Case marked as viewed');
            }
        } catch (error) {
            console.error('Error marking case as viewed:', error);
            Alert.alert('Error', 'Failed to mark case as viewed');
        }
    };

    const resolveCase = async (caseID) => {
        try {
            const response = await axios.post(
                `https://kwara-security-api.onrender.com/v1/admin/cases/${caseID}/resolve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );

            if (response.data.success) {
                setFilteredCases((prevCases) =>
                    prevCases.map((caseItem) =>
                        caseItem?.caseID === caseID ? { ...caseItem, isResolved: true } : caseItem
                    )
                );
                setCases((prevCases) =>
                    prevCases.map((caseItem) =>
                        caseItem?.caseID === caseID ? { ...caseItem, isResolved: true } : caseItem
                    )
                );
                Alert.alert('Success', 'Case resolved successfully');
            }
        } catch (error) {
            console.error('Error resolving case:', error);
            Alert.alert('Error', 'Failed to resolve case');
        }
    };

    const resetSearch = () => {
        setSearchQuery('');
        setFilteredCases(cases);
        setError(null);
    };

    const scrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    const handleScroll = (event) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        setShowBackToTop(yOffset > 300);
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    };

    const CaseCard = ({ caseItem, index }) => {
        if (!caseItem || !caseItem.caseID) {
            return null;
        }

        return (
            <View key={index} className="w-full p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-2">{caseItem?.subject}</Text>
                <Text style={{ fontFamily: fonts.light }} className="mb-2 text-gray-600">{caseItem?.description}</Text>
                <View className="mb-3">
                    <Text style={{ fontFamily: fonts.semibold }} className="mb-1 text-[16px]">Reporter Details:</Text>
                    <Text style={{ fontFamily: fonts.light }} className="py-1 text-gray-600">Name: {caseItem?.reporter?.name}</Text>
                    <Text style={{ fontFamily: fonts.light }} className="py-1 text-gray-600">LGA: {caseItem?.reporter?.lga}</Text>
                    <Text style={{ fontFamily: fonts.light }} className="py-1 text-gray-600">Ward: {caseItem?.reporter?.ward}</Text>
                    <Text style={{ fontFamily: fonts.light }} className="py-1 text-gray-600">Community: {caseItem?.reporter?.community}</Text>
                </View>

                <Text style={{ fontFamily: fonts.light }} className="mb-2 text-gray-600">
                    Reported on {formatDateTime(caseItem?.time)}
                </Text>
                <Text style={{ fontFamily: fonts.light }} className="mb-3 text-gray-600">
                    Status: {caseItem?.isViewed ? 'Viewed' : 'Not Viewed'} | {caseItem?.isResolved ? 'Resolved' : 'Unresolved'}
                </Text>

                <View className="flex flex-row gap-x-4">
                    {!caseItem?.isViewed ? (
                        <TouchableOpacity onPress={() => markCaseAsViewed(caseItem?.caseID)} className="px-4 py-2 bg-blue-500 rounded-lg">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-white">Mark as Viewed</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity className="px-4 py-2 bg-black rounded-lg">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-white">Viewed</Text>
                        </TouchableOpacity>
                    )}
                    {!caseItem?.isResolved ? (
                        <TouchableOpacity onPress={() => resolveCase(caseItem?.caseID)} className="px-4 py-2 bg-green-500 rounded-lg">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-white">Mark as Resolved</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity className="px-4 py-2 bg-black rounded-lg">
                            <Text style={{ fontFamily: fonts.semibold }} className="text-white">Resolved</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            
            <View className="px-4 pt-4 pb-2 bg-white border-b border-gray-100">
                <View className="flex flex-row items-center justify-between w-full mb-4">
                    <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">
                        Cases
                    </Text>
                    {error && (
                        <TouchableOpacity onPress={fetchCases} className="px-3 py-1 bg-red-500 rounded">
                            <Text className="text-sm text-white">Retry</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                <View className="relative w-full px-4 border rounded border-[#414141] mb-2">
                    <TextInput value={searchQuery} onChangeText={handleSearch} placeholder='Search cases...' className="w-full text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" style={{ fontFamily: fonts.regular }}editable={!isLoading}/>
                    <TouchableOpacity className="absolute p-2 -translate-y-1/2 rounded-full right-3 top-1/2">
                        {searchLoading ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <Image source={images.search} style={{ height: 22, width: 22 }} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView ref={scrollViewRef}showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}onScroll={handleScroll}scrollEventThrottle={16}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px] mx-auto">
                    {isLoading ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-gray-50">
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={{ fontFamily: fonts.light }} className="mt-4 text-gray-600">
                                Loading cases...
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-red-50">
                            <Text style={{ fontFamily: fonts.medium }} className="mb-4 text-center text-red-600">
                                {error}
                            </Text>
                            <TouchableOpacity onPress={fetchCases} className="px-6 py-3 bg-red-500 rounded-lg">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-white">
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="w-full">
                            {filteredCases.length === 0 ? (
                                <View className="items-center justify-center w-full py-6">
                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">
                                        No cases found
                                    </Text>
                                    {searchQuery.trim() !== '' && (
                                        <TouchableOpacity onPress={resetSearch} className="px-4 py-2 mt-4 bg-blue-500 rounded-lg">
                                            <Text style={{ fontFamily: fonts.semibold }} className="text-white">
                                                Reset Search
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                <View className="flex items-center justify-center w-full py-6">
                                    {filteredCases.map((caseItem, index) => (
                                        <CaseCard key={caseItem?.caseID || index} caseItem={caseItem} index={index} />
                                    ))}
                                    <View className="flex items-center justify-center w-full py-2">
                                        {searchQuery.trim() !== '' && (
                                            <TouchableOpacity onPress={resetSearch} className="px-4 py-4 bg-blue-500 rounded-lg">
                                                <Text style={{ fontFamily: fonts.semibold }} className="text-white">
                                                    Reset Search
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {showBackToTop && (
                <TouchableOpacity onPress={scrollToTop} className="absolute p-3 bg-blue-500 rounded-full shadow-lg bottom-20 right-4" style={{ elevation: 5 }}>
                    <Text className="font-bold text-white">↑</Text>
                </TouchableOpacity>
            )}

            <DrawerNavigation />
        </SafeAreaView>
    );
};

export default Cases;