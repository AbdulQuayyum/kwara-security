import React, { createContext, useState, useEffect } from "react";
import NetInfo from '@react-native-community/netinfo';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { isOnline } from "../utilities/network";
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();

    const [authState, setAuthState] = useState({
        token: null,
        isAuthenticated: false,
        user: null,
        isOnline: true,
        initialized: false
    });

    const storeToken = async (token) => {
        try {
            if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
                throw new Error('Invalid token format');
            }
            await SecureStore.setItemAsync('token', token);
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 100);
            await AsyncStorage.setItem('token_expiration', expirationDate.toISOString());
        } catch (error) {
            console.error('Error storing token:', error);
            throw error;
        }
    };

    const isTokenValid = async () => {
        try {
            const expiration = await AsyncStorage.getItem('token_expiration');
            if (!expiration) return false;

            const expirationDate = new Date(expiration);
            return new Date() < expirationDate;
        } catch (error) {
            console.error('Error checking token validity:', error);
            return false;
        }
    };

    const validateTokenFormat = (token) => {
        if (!token || typeof token !== 'string') return false;
        const parts = token.split('.');
        return parts.length === 3 && parts.every(part => part.length > 0);
    };

    const fetchUserProfile = async (token) => {
        try {
            if (!validateTokenFormat(token)) {
                console.error('Invalid token format');
                await logout();
                return false;
            }

            const response = await axios.post(
                "https://kwara-security-api.onrender.com/v1/user/get-user-profile",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const userData = response.data.data;
                setAuthState((prevState) => ({
                    ...prevState,
                    user: userData,
                }));
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            if (error.response?.status === 401) {
                await logout();
            }
            return false;
        }
    };

    const updateUserProfile = async (updatedProfile) => {
        try {
            if (!validateTokenFormat(authState.token)) {
                return { success: false, message: "Invalid authentication token." };
            }

            const response = await axios.post(
                "https://kwara-security-api.onrender.com/v1/user/update-user-profile",
                updatedProfile,
                {
                    headers: {
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );

            if (response.data.success) {
                setAuthState((prevState) => ({
                    ...prevState,
                    user: { ...prevState.user, ...updatedProfile },
                }));

                await AsyncStorage.setItem("user", JSON.stringify({ ...authState.user, ...updatedProfile }));
                return { success: true, message: "Profile updated successfully!" };
            }
            return { success: false, message: response.data.message || "Failed to update profile." };
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response?.status === 401) {
                await logout();
                return { success: false, message: "Session expired. Please login again." };
            }
            return { success: false, message: "Failed to update profile. Please try again." };
        }
    };

    const login = async (token) => {
        try {
            await storeToken(token);
            setAuthState(prev => ({
                ...prev,
                token,
                isAuthenticated: true,
                user: null
            }));

            await fetchUserProfile(token);
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = async () => {
        setAuthState({
            token: null,
            isAuthenticated: false,
            user: null,
            isOnline: authState.isOnline,
            initialized: true
        });

        try {
            await SecureStore.deleteItemAsync('token');
            await AsyncStorage.removeItem('token_expiration');
            await AsyncStorage.removeItem('user');
        } catch (error) {
            console.error('Error during logout cleanup:', error);
        }

        router.replace("/");
    };

    const checkAuth = async () => {
        try {
            const online = await isOnline();
            const storedToken = await SecureStore.getItemAsync('token');
            const storedUser = await AsyncStorage.getItem('user');

            const tokenValid = storedToken && validateTokenFormat(storedToken) ? await isTokenValid() : false;

            if (storedToken && tokenValid && validateTokenFormat(storedToken)) {
                setAuthState(prev => ({
                    ...prev,
                    token: storedToken,
                    isAuthenticated: true,
                    user: storedUser ? JSON.parse(storedUser) : null,
                    isOnline: online,
                    initialized: true
                }));

                if (online) {
                    await fetchUserProfile(storedToken);
                }
            } else {
                if (storedToken) {
                    await logout();
                } else {
                    setAuthState(prev => ({
                        ...prev,
                        token: null,
                        isAuthenticated: false,
                        user: null,
                        isOnline: online,
                        initialized: true
                    }));
                }
            }
        } catch (error) {
            console.error('Error in checkAuth:', error);
            setAuthState(prev => ({
                ...prev,
                token: null,
                isAuthenticated: false,
                user: null,
                initialized: true
            }));
        }
    };

    useEffect(() => {
        checkAuth();
        const unsubscribe = NetInfo.addEventListener(state => {
            setAuthState(prev => ({
                ...prev,
                isOnline: state.isConnected
            }));

            if (state.isConnected && authState.isAuthenticated) {
                checkAuth();
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ authState, setAuthState, login, logout, updateUserProfile, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};