import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar } from 'react-native';

import DrawerNavigation from "../../components/DrawerNavigation";
import { AuthContext } from '../../context/authcontext';
import { fonts } from "../../assets/fonts";
import images from '../../assets/images';
import styles from "../../styles/main";

const Users = () => {
    const router = useRouter();
    const { authState } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [processingUsers, setProcessingUsers] = useState(new Set());
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApiError = (error, defaultMessage) => {
        console.error('API Error:', error);
        
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error;
            
            switch (status) {
                case 401:
                    Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
                    router.push('/');
                    break;
                case 403:
                    Alert.alert('Access Denied', 'You do not have permission to perform this action.');
                    break;
                case 404:
                    Alert.alert('Not Found', 'The requested resource was not found.');
                    break;
                case 429:
                    Alert.alert('Rate Limited', 'Too many requests. Please try again later.');
                    break;
                case 500:
                    Alert.alert('Server Error', 'Internal server error. Please try again later.');
                    break;
                default:
                    Alert.alert('Error', message || `Server error (${status}). Please try again.`);
            }
        } else if (error.request) {
            Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection and try again.');
        } else {
            Alert.alert('Error', defaultMessage || 'An unexpected error occurred.');
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!authState?.token) {
                throw new Error('No authentication token available');
            }

            const response = await axios.post('https://kwara-security-api.onrender.com/v1/admin/users',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000
                }
            );

            if (response.data && response.data.data) {
                setUsers(response.data.data);
                setFilteredUsers(response.data.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError('Failed to load users');
            handleApiError(error, 'Failed to fetch users');
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setFilteredUsers(users);
            return;
        }

        try {
            setSearchLoading(true);
            
            if (!authState?.token) {
                throw new Error('No authentication token available');
            }

            const response = await axios({
                method: 'post',
                url: 'https://kwara-security-api.onrender.com/v1/admin/search',
                params: {
                    query: query.trim(),
                    type: 'users'
                },
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                    'Content-Type': 'application/json',
                },
                timeout: 8000
            });

            if (response.data && response.data.data) {
                setFilteredUsers(response.data.data);
            } else {
                setFilteredUsers([]);
            }
        } catch (error) {
            handleApiError(error, 'Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const toggleUserStatus = async (userId, isSuspended) => {
        if (!userId) {
            Alert.alert('Error', 'Invalid user ID');
            return;
        }

        try {
            if (!authState?.token) {
                throw new Error('No authentication token available');
            }

            await axios.post(
                `https://kwara-security-api.onrender.com/v1/admin/users/${userId}/suspend`,
                { isSuspended: !isSuspended },
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 8000,
                }
            );
            
            await fetchUsers();
            Alert.alert('Success', `User ${isSuspended ? 'unsuspended' : 'suspended'} successfully`);
        } catch (error) {
            handleApiError(error, 'Failed to update user status');
        }
    };

    const verifyUser = async (userId) => {
        if (!userId) {
            Alert.alert('Error', 'Invalid user ID');
            return;
        }

        if (processingUsers.has(userId)) {
            return;
        }

        try {
            setProcessingUsers(prev => new Set([...prev, userId]));
            
            if (!authState?.token) {
                throw new Error('No authentication token available');
            }

            const response = await axios.post(
                `https://kwara-security-api.onrender.com/v1/admin/users/${userId}/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 8000,
                }
            );
            
            await fetchUsers();
            
            Alert.alert('Success', response.data.message || 'User verified successfully');
            
        } catch (error) {
            if (error.response?.status === 400 && 
                error.response?.data?.message?.toLowerCase().includes('already verified')) {
                Alert.alert('Info', 'User is already verified');
                await fetchUsers();
            } else {
                handleApiError(error, 'Failed to verify user');
            }
        } finally {
            setProcessingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const resetSearch = () => {
        setSearchQuery('');
        setFilteredUsers(users);
        setError(null);
    };

    const UserCard = ({ user }) => {
        if (!user || !user.userID) {
            return null;
        }

        return (
            <View className="w-full p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                    <Text style={{ fontFamily: fonts.medium }} className="text-lg">
                        {user.name || 'Unknown User'}
                    </Text>
                    <View className="flex-row gap-2">
                        {!user.isVerified && (
                            <TouchableOpacity  onPress={() => verifyUser(user.userID)}  className={`px-3 py-1 rounded ${processingUsers.has(user.userID) ? 'bg-blue-300' : 'bg-blue-500'}`} disabled={loading || processingUsers.has(user.userID)}>
                                <Text className="text-white">
                                    {processingUsers.has(user.userID) ? 'Verifying...' : 'Verify'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => toggleUserStatus(user.userID, user.isSuspended)} className={`${user.isSuspended ? 'bg-green-500' : 'bg-red-500'} px-3 py-1 rounded`}disabled={loading}>
                            <Text className="text-white">
                                {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontFamily: fonts.light }} className="py-2 text-gray-600">
                    Email address: {user.emailAddress || 'Not provided'}
                </Text>
                <Text style={{ fontFamily: fonts.light }} className="py-2 text-gray-600">
                    Phone Number: {user.phoneNumber || 'Not provided'}
                </Text>
                <View className="flex-row flex-wrap mt-2">
                    {user.state && (
                        <View className="px-2 py-1 mb-2 mr-2 bg-gray-100 rounded">
                            <Text style={{ fontFamily: fonts.light }} className="text-sm">
                                {user.state}
                            </Text>
                        </View>
                    )}
                    {user.lga && (
                        <View className="px-2 py-1 mb-2 mr-2 bg-gray-100 rounded">
                            <Text style={{ fontFamily: fonts.light }} className="text-sm">
                                {user.lga}
                            </Text>
                        </View>
                    )}
                    {user.ward && (
                        <View className="px-2 py-1 mb-2 mr-2 bg-gray-100 rounded">
                            <Text style={{ fontFamily: fonts.light }} className="text-sm">
                                {user.ward}
                            </Text>
                        </View>
                    )}
                    {user.community && (
                        <View className="px-2 py-1 mb-2 mr-2 bg-gray-100 rounded">
                            <Text style={{ fontFamily: fonts.light }} className="text-sm">
                                {user.community}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View className="flex flex-col items-start gap-y-6 w-full max-w-[500px]">
                    <View className="flex flex-row items-center justify-between w-full">
                        <Text style={{ fontFamily: fonts.light }} className="text-[36px] font-[700] leading-[43px] text-[#0D0D0D]">
                            Users
                        </Text>
                        {error && (
                            <TouchableOpacity onPress={fetchUsers} className="px-3 py-1 bg-red-500 rounded">
                                <Text className="text-sm text-white">Retry</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <View className="relative w-full px-4 border rounded border-[#414141]">
                        <TextInput value={searchQuery} onChangeText={handleSearch} placeholder='Search users...' className="w-full text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" style={{ fontFamily: fonts.regular }}editable={!loading} />
                        <TouchableOpacity className="absolute p-2 -translate-y-1/2 rounded-full right-3 top-1/2">
                            {searchLoading ? (
                                <ActivityIndicator size="small" color="#0000ff" />
                            ) : (
                                <Image source={images.search} style={{ height: 22, width: 22 }} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-gray-50">
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={{ fontFamily: fonts.light }} className="mt-4 text-gray-600">
                                Loading users...
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-red-50">
                            <Text style={{ fontFamily: fonts.medium }} className="mb-4 text-center text-red-600">
                                {error}
                            </Text>
                            <TouchableOpacity onPress={fetchUsers} className="px-6 py-3 bg-red-500 rounded-lg">
                                <Text style={{ fontFamily: fonts.semibold }} className="text-white">
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="w-full">
                            {filteredUsers.length === 0 ? (
                                <View className="items-center justify-center w-full py-6">
                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">
                                        No users found
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
                                    {filteredUsers.map((user) => (
                                        <UserCard key={user.userID} user={user} />
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
            <DrawerNavigation />
        </SafeAreaView>
    );
};

export default Users;