import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView, View, Text, ScrollView, ActivityIndicator, StatusBar, Dimensions } from 'react-native';

import DrawerNavigation from "../../components/DrawerNavigation";
import { AuthContext } from '../../context/authcontext';
import { fonts } from "../../assets/fonts";
import styles from "../../styles/main";

import { BarChart, LineChart, MultiLineChart, PieChart, ProgressChart, DonutChart } from '../../components/charts/chart';

const windowWidth = Dimensions.get('window').width;

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
    const [error, setError] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);

    const fetchAnalytics = async () => {
        if (!authState.isAuthenticated || !authState.token) {
            setIsLoading(false);
            setError('Authentication required');
            return;
        }

        if (!authState.token || typeof authState.token !== 'string' || authState.token.split('.').length !== 3) {
            setError('Invalid authentication token');
            setIsLoading(false);
            return;
        }

        try {
            const [casesResponse, usersResponse, locationsResponse, lgasResponse, wardsResponse, communitiesResponse, userCasesResponse, monthlyStatsResponse] = await Promise.all([
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/cases',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/users',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/locations',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/lgas',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/wards',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/communities',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/usercases',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                ),
                axios.post('https://kwara-security-api.onrender.com/v1/admin/analytics/monthly',
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
            
            if (monthlyStatsResponse.data.success) {
                const monthlyStats = monthlyStatsResponse.data.data;
                setMonthlyData({
                    totalCases: monthlyStats.totalCases.map(stat => ({
                        x: new Date(stat.month).toLocaleString('default', { month: 'short' }),
                        y: stat.count
                    })),
                    resolvedCases: monthlyStats.resolvedCases.map(stat => ({
                        x: new Date(stat.month).toLocaleString('default', { month: 'short' }),
                        y: stat.count
                    })),
                    pendingCases: monthlyStats.pendingCases.map(stat => ({
                        x: new Date(stat.month).toLocaleString('default', { month: 'short' }),
                        y: stat.count
                    }))
                });
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);

            if (error.response?.status === 401) {
                setError('Authentication expired. Please login again.');
                router.replace('/');
            } else {
                setError('Failed to fetch analytics data. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authState.initialized) {
            if (authState.isAuthenticated && authState.token) {
                fetchAnalytics();
            } else {
                setIsLoading(false);
                setError('Please login to view analytics');
            }
        }
    }, [authState.initialized, authState.isAuthenticated, authState.token]);

    const prepareCasesChartData = () => {
        if (!casesData) return [];
        return [
            { x: 'Resolved', y: casesData.resolvedCases, color: '#10B981' },
            { x: 'Pending', y: casesData.pendingCases, color: '#F59E0B' }
        ];
    };

    const prepareUsersChartData = () => {
        if (!usersData) return [];
        return [
            { x: 'Verified', y: usersData.verifiedUsers, color: '#10B981' },
            { x: 'Unverified', y: usersData.unverifiedUsers, color: '#F59E0B' },
            { x: 'Suspended', y: usersData.suspendedUsers, color: '#EF4444' }
        ];
    };

    const prepareTopLgasChartData = () => {
        return lgasData.slice(0, 5).map(lga => ({
            x: lga.lga,
            y: lga.totalCases,
            color: '#3B82F6'
        }));
    };

    const prepareTopWardsChartData = () => {
        return wardsData.slice(0, 5).map(ward => ({
            x: ward.ward,
            y: ward.totalCases,
            color: '#8B5CF6'
        }));
    };

    const prepareTopCommunitiesChartData = () => {
        return communitiesData.slice(0, 5).map(community => ({
            x: community.community,
            y: community.totalCases,
            color: '#EC4899'
        }));
    };

    const prepareTopUsersChartData = () => {
        return userCasesData.slice(0, 5).map(user => ({
            x: user.userName,
            y: user.totalCases,
            color: '#06B6D4'
        }));
    };

    if (!authState.initialized) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <View className="flex items-center justify-center flex-1">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{ fontFamily: fonts.light }} className="mt-4 text-gray-600">
                        Initializing...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <Stack.Screen options={{ headerShown: false }} />
                <StatusBar style="auto" backgroundColor="#FFFFFF" />
                <View className="flex items-center justify-center flex-1 px-4">
                    <Text style={{ fontFamily: fonts.semibold }} className="text-[18px] text-red-600 text-center mb-4">
                        {error}
                    </Text>
                    <Text
                        style={{ fontFamily: fonts.light }}
                        className="text-blue-600 underline"
                        onPress={() => {
                            if (authState.isAuthenticated) {
                                fetchAnalytics();
                            } else {
                                router.replace('/');
                            }
                        }}
                    >
                        {authState.isAuthenticated ? 'Try Again' : 'Go to Login'}
                    </Text>
                </View>
                <DrawerNavigation />
            </SafeAreaView>
        );
    }

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
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Cases Overview</Text>
                                <View className="flex flex-row justify-between mb-4">
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
                                
                                {casesData && (
                                  <PieChart data={prepareCasesChartData()} title="Case Status Distribution"/>
                                )}
                            </View>
                            {monthlyData && (
                                <View className="w-full p-4 rounded-lg bg-gray-50">
                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Case Trends (6 Months)</Text>
                                    <MultiLineChart title="Cases Over Time" series={[ { name: 'Total', color: '#3B82F6', data: monthlyData.totalCases }, { name: 'Resolved', color: '#10B981', data: monthlyData.resolvedCases }, { name: 'Pending', color: '#F59E0B', data: monthlyData.pendingCases } ]} xAxisLabel="Month" yAxisLabel="Cases" />
                                </View>
                            )}
                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Users Overview</Text>
                                <View className="flex flex-row justify-between mb-4">
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
                                
                                {usersData && (
                                    <View className="flex flex-row flex-wrap justify-around mt-2">
                                        <ProgressChart value={usersData.verifiedUsers} maxValue={usersData.totalUsers} title="Verified Users" color="#10B981" />
                                        <ProgressChart value={usersData.unverifiedUsers} maxValue={usersData.totalUsers} title="Unverified Users" color="#F59E0B" />
                                        <ProgressChart value={usersData.suspendedUsers} maxValue={usersData.totalUsers} title="Suspended Users" color="#EF4444"  />
                                    </View>
                                )}
                                
                                {usersData && (
                                    <PieChart
                                        data={prepareUsersChartData()}
                                        title="User Status Distribution"
                                    />
                                )}
                            </View>
                            {lgasData.length > 0 && (
                                <View className="w-full p-4 rounded-lg bg-gray-50">
                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top LGAs</Text>
                                    <BarChart data={prepareTopLgasChartData()} title="Cases by LGA" xAxisLabel="Local Government Area" yAxisLabel="Number of Cases"horizontal={windowWidth < 500} />
                                    
                                    {lgasData.map((lga, index) => (
                                        <View key={index} className="flex flex-row justify-between mb-4">
                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{lga?.lga}</Text>
                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px]">{lga?.totalCases} Cases</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                            {wardsData.length > 0 && (
                                <View className="w-full p-4 rounded-lg bg-gray-50">
                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top Wards</Text>
                                    <BarChart data={prepareTopWardsChartData()} title="Cases by Ward" xAxisLabel="Ward" yAxisLabel="Number of Cases"horizontal={windowWidth < 500}/>
                                    
                                    {wardsData.map((ward, index) => (
                                        <View key={index} className="flex flex-row justify-between mb-4">
                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{ward?.ward}</Text>
                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px]">{ward?.totalCases} Cases</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {communitiesData.length > 0 && (
                                <View className="w-full p-4 rounded-lg bg-gray-50">
                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top Communities</Text>
                                    <BarChart data={prepareTopCommunitiesChartData()} title="Cases by Community" xAxisLabel="Community" yAxisLabel="Number of Cases"horizontal={windowWidth < 500} />
                                    
                                    {communitiesData.map((community, index) => (
                                        <View key={index} className="flex flex-row justify-between mb-4">
                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{community?.community}</Text>
                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px]">{community?.totalCases} Cases</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {userCasesData.length > 0 && (
                                <View className="w-full p-4 rounded-lg bg-gray-50">
                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Top Users by Cases</Text>
                                    <BarChart data={prepareTopUsersChartData()} title="Cases Reported by User" xAxisLabel="User" yAxisLabel="Number of Cases"horizontal={true} />
                                    
                                    {userCasesData.map((user, index) => (
                                        <View key={index} className="flex flex-row justify-between mb-4">
                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">{user?.userName}</Text>
                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px]">{user?.totalCases} Cases</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View className="w-full p-4 rounded-lg bg-gray-50">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] mb-4">Locations Overview</Text>
                                {locationsData.map((lga, lgaIndex) => (
                                    <View key={lgaIndex} className="flex flex-col items-start w-full mb-6">
                                        <View className="flex flex-col items-start justify-start mb-4 gap-y-2">
                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px]">LGA: {lga?.lga}</Text>
                                            <View className="flex flex-row gap-x-4">
                                                <View className="flex flex-col items-center">
                                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Total Cases</Text>
                                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px]">{lga?.totalCasesInLGA}</Text>
                                                </View>
                                                <View className="flex flex-col items-center">
                                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Resolved</Text>
                                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] text-green-600">{lga?.resolvedCasesInLGA}</Text>
                                                </View>
                                                <View className="flex flex-col items-center">
                                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Pending</Text>
                                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[20px] text-yellow-600">{lga?.pendingCasesInLGA}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {lga?.wards.map((ward, wardIndex) => (
                                            <View key={wardIndex} className="flex flex-col items-start mb-4">
                                                <View className="flex flex-col items-start justify-start mb-2 gap-y-2">
                                                    <Text style={{ fontFamily: fonts.medium }} className="text-[16px]">Ward: {ward?.ward}</Text>
                                                    <View className="flex flex-row gap-x-4">
                                                        <View className="flex flex-col items-center">
                                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Total Cases</Text>
                                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px]">{ward?.totalCasesInWard}</Text>
                                                        </View>
                                                        <View className="flex flex-col items-center">
                                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Resolved</Text>
                                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px] text-green-600">{ward?.resolvedCasesInWard}</Text>
                                                        </View>
                                                        <View className="flex flex-col items-center">
                                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Pending</Text>
                                                            <Text style={{ fontFamily: fonts.semibold }} className="text-[18px] text-yellow-600">{ward?.pendingCasesInWard}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                {ward?.communities.map((community, communityIndex) => (
                                                    <View key={communityIndex} className="flex flex-col items-start my-2">
                                                        <View className="flex flex-col items-start justify-start gap-y-2">
                                                            <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Community: {community?.community}</Text>
                                                            <View className="flex flex-row gap-x-4">
                                                                <View className="flex flex-col items-center">
                                                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Total Cases</Text>
                                                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[16px]">{community?.totalCases}</Text>
                                                                </View>
                                                                <View className="flex flex-col items-center">
                                                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Resolved</Text>
                                                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[16px] text-green-600">{community?.resolvedCases}</Text>
                                                                </View>
                                                                <View className="flex flex-col items-center">
                                                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">Pending</Text>
                                                                    <Text style={{ fontFamily: fonts.semibold }} className="text-[16px] text-yellow-600">{community?.pendingCases}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
            <DrawerNavigation />
        </SafeAreaView>
    );
};

export default Analytics;