import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SafeAreaView, View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';

import BottomNavigation from '../../components/BottomNavigation';
import { AuthContext } from '../../context/authcontext';
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

const Analytics = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const [casesData, setCasesData] = useState(null);
    const [usersData, setUsersData] = useState(null);
    const [locationsData, setLocationsData] = useState([]);
    const [lgasData, setLgasData] = useState([]);
    const [wardsData, setWardsData] = useState([]);
    const [communitiesData, setCommunitiesData] = useState([]);
    const [userCasesData, setUserCasesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const [
                casesResponse,
                usersResponse,
                locationsResponse,
                lgasResponse,
                wardsResponse,
                communitiesResponse,
                userCasesResponse
            ] = await Promise.all([
                axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/analytics/cases',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/analytics/users',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/analytics/locations',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/analytics/lgas',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/analytics/wards',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/analytics/communities',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/analytics/usercases',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                )
            ]);

            if (casesResponse.data.success) setCasesData(casesResponse.data.data);
            if (usersResponse.data.success) setUsersData(usersResponse.data.data);
            if (locationsResponse.data.success) setLocationsData(locationsResponse.data.data);
            if (lgasResponse.data.success) setLgasData(lgasResponse.data.data);
            if (wardsResponse.data.success) setWardsData(wardsResponse.data.data);
            if (communitiesResponse.data.success) setCommunitiesData(communitiesResponse.data.data);
            if (userCasesResponse.data.success) setUserCasesData(userCasesResponse.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            Alert.alert('Error', 'Failed to fetch analytics data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px]">
                    <View className="flex flex-row items-center justify-between w-full">
                        <View className="flex flex-col items-start gap-y-2">
                            <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">Analytics</Text>
                        </View>
                    </View>

                    {isLoading ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-gray-50">
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : (
                        <>
                            {/* Cases Overview */}
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Cases Overview</Text>
                                <View className="flex flex-row justify-between">
                                    <View className="flex flex-col items-start flex-1 gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Total Cases</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px]">{casesData?.totalCases || 0}</Text>
                                    </View>
                                    <View className="flex flex-col items-start flex-1 gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Resolved</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px] text-green-600">{casesData?.resolvedCases || 0}</Text>
                                    </View>
                                    <View className="flex flex-col items-start flex-1 gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Pending</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px] text-yellow-600">{casesData?.pendingCases || 0}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Users Overview */}
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Users Overview</Text>
                                <View className="flex flex-row justify-between">
                                    <View className="flex flex-col items-start flex-1 gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Total Users</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px]">{usersData?.totalUsers || 0}</Text>
                                    </View>
                                    <View className="flex flex-col items-start flex-1 gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Verified</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px] text-green-600">{usersData?.verifiedUsers || 0}</Text>
                                    </View>
                                    <View className="flex flex-col items-start flex-1 gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Unverified</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px] text-yellow-600">{usersData?.unverifiedUsers || 0}</Text>
                                    </View>
                                    <View className="flex flex-col items-start flex-1 gap-y-2">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Suspended</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px] text-red-600">{usersData?.suspendedUsers || 0}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Locations Overview</Text>
                                {locationsData.map((location, index) => (
                                    <View key={index} className="flex flex-col justify-between mb-4">
                                        <View className="flex flex-row flex-1 mb-4">
                                            <View className="flex flex-col items-start flex-1 gap-y-2">
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">LGA:</Text>
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{location?.lga}</Text>
                                            </View>
                                            <View className="flex flex-col items-start flex-1 gap-y-2">
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Ward:</Text>
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{location?.ward}</Text>
                                            </View>
                                            <View className="flex flex-col items-start flex-1 gap-y-2">
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Community:</Text>
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{location?.community}</Text>
                                            </View>
                                        </View>
                                        <View key={index} className="flex flex-row justify-between mb-4">
                                            <View className="flex flex-col items-start flex-1 gap-y-2">
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Total Cases</Text>
                                                <Text style={{ fontFamily: fonts.semibold }} className="text-[24px]">{location?.totalCases}</Text>
                                            </View>
                                            <View className="flex flex-col items-start flex-1 gap-y-2">
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Resolved</Text>
                                                <Text style={{ fontFamily: fonts.semibold }} className="text-[24px] text-green-600">{location?.resolvedCases}</Text>
                                            </View>
                                            <View className="flex flex-col items-start flex-1 gap-y-2">
                                                <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Pending</Text>
                                                <Text style={{ fontFamily: fonts.semibold }} className="text-[24px] text-yellow-600">{location?.pendingCases}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top LGAs</Text>
                                {lgasData.map((lga, index) => (
                                    <View key={index} className="flex flex-row justify-between mb-4">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{lga?.lga}</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px]">{lga?.totalCases} Cases</Text>
                                    </View>
                                ))}
                            </View>
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top Wards</Text>
                                {wardsData.map((ward, index) => (
                                    <View key={index} className="flex flex-row justify-between mb-4">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{ward?.ward}</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px]">{ward?.totalCases} Cases</Text>
                                    </View>
                                ))}
                            </View>
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top Communities</Text>
                                {communitiesData.map((community, index) => (
                                    <View key={index} className="flex flex-row justify-between mb-4">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{community?.community}</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px]">{community?.totalCases} Cases</Text>
                                    </View>
                                ))}
                            </View>
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top Users by Cases</Text>
                                {userCasesData.map((user, index) => (
                                    <View key={index} className="flex flex-row justify-between mb-4">
                                        <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{user?.userName}</Text>
                                        <Text style={{ fontFamily: fonts.semibold }} className="text-[24px]">{user?.totalCases} Cases</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

export default Analytics;