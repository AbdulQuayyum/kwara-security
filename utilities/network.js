import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const isOnline = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
};

export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    return isConnected;
};