import { useState, useEffect, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';

import BottomNavigation from '../../components/BottomNavigation';
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

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.post('https://kwara-security-api-production.up.railway.app/v1/admin/users',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );
            setUsers(response.data.data);
            setFilteredUsers(response.data.data);
            setLoading(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch users');
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
            const response = await axios({
                method: 'post',
                url: 'https://kwara-security-api-production.up.railway.app/v1/admin/search',
                params: {
                    query: searchQuery,
                    type: 'users'
                },
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                }
            });
            setFilteredUsers(response.data.data);
        } catch (error) {
            Alert.alert('Error', 'Search failed');
        }
    };

    const toggleUserStatus = async (userId, isSuspended) => {
        try {
            await axios.post(
                `https://kwara-security-api-production.up.railway.app/v1/admin/users/${userId}/suspend`,
                { isSuspended: !isSuspended },
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );
            fetchUsers();
            Alert.alert('Success', `User ${isSuspended ? 'unsuspended' : 'suspended'} successfully`);
        } catch (error) {
            Alert.alert('Error', 'Failed to update user status');
        }
    };

    const verifyUser = async (userId) => {
        try {
            await axios.post(
                `https://kwara-security-api-production.up.railway.app/v1/admin/users/${userId}/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );
            fetchUsers();
            Alert.alert('Success', 'User verified successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to verify user');
        }
    };

    const UserCard = ({ user }) => (
        <View className="w-full p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
                <Text style={{ fontFamily: fonts.medium }} className="text-lg">
                    {user.name}
                </Text>
                <View className="flex-row gap-2">
                    {!user.isVerified && (
                        <TouchableOpacity onPress={() => verifyUser(user.userID)} className="px-3 py-1 bg-blue-500 rounded">
                            <Text className="text-white">Verify</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => toggleUserStatus(user.userID, user.isSuspended)} className={`${user.isSuspended ? 'bg-green-500' : 'bg-red-500'} px-3 py-1 rounded`}>
                        <Text className="text-white">
                            {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ fontFamily: fonts.light }} className="py-2 text-gray-600">
                Email address: {user.emailAddress}
            </Text>
            <Text style={{ fontFamily: fonts.light }} className="py-2 text-gray-600">
                Phone Number {user.phoneNumber}
            </Text>
            <View className="flex-row mt-2">
                <View className="px-2 py-1 mr-2 bg-gray-100 rounded">
                    <Text style={{ fontFamily: fonts.light }} className="text-sm">
                        {user.state}
                    </Text>
                </View>
                <View className="px-2 py-1 bg-gray-100 rounded">
                    <Text style={{ fontFamily: fonts.light }} className="text-sm">
                        {user.lga}
                    </Text>
                </View>
                <View className="px-2 py-1 bg-gray-100 rounded">
                    <Text style={{ fontFamily: fonts.light }} className="text-sm">
                        {user.ward}
                    </Text>
                </View>
                <View className="px-2 py-1 bg-gray-100 rounded">
                    <Text style={{ fontFamily: fonts.light }} className="text-sm">
                        {user.community}
                    </Text>
                </View>
            </View>
        </View>
    );

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
                    </View>
                    <View className="relative w-full px-4 border rounded border-[#414141]">
                        <TextInput value={searchQuery} onChangeText={handleSearch} placeholder='Search users...' className="w-full text-[#0D0D0D] h-[60px] bg-transparent px-4 flex items-start focus:outline-none focus:border-primary" style={{ fontFamily: fonts.regular }} />
                        <TouchableOpacity className="absolute p-2 -translate-y-1/2 rounded-full right-3 top-1/2">
                            <Image source={images.search} style={{ height: 22, width: 22 }} />
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <View className="flex items-center justify-center w-full py-12 rounded-lg bg-gray-50">
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : (
                        <View className="w-full">
                            {filteredUsers.length === 0 ? (
                                <View className="items-center justify-center w-full py-6">
                                    <Text style={{ fontFamily: fonts.light }} className="text-gray-600">
                                        No user found
                                    </Text>
                                    {searchQuery.trim() !== '' && (
                                        <TouchableOpacity onPress={() => { setSearchQuery(''); setFilteredUsers(cases) }} className="px-4 py-2 mt-4 bg-blue-500 rounded-lg">
                                            <Text style={{ fontFamily: fonts.semibold }} className="text-white">
                                                Reset
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
                                            <TouchableOpacity onPress={() => { setSearchQuery(''); setFilteredUsers(users) }} className="px-4 py-4 bg-blue-500 rounded-lg">
                                                <Text style={{ fontFamily: fonts.semibold }} className="text-white">
                                                    Reset
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
            {/* <BottomNavigation /> */}
            <DrawerNavigation />
        </SafeAreaView>
    );
};

export default Users;