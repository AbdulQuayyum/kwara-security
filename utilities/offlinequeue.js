import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'offline_reports_queue';

export const addToQueue = async (report) => {
    try {
        const currentQueue = await getQueue();
        const newQueue = [...currentQueue, report];
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
        return true;
    } catch (error) {
        console.error('Error adding to queue:', error);
        return false;
    }
};

export const getQueue = async () => {
    try {
        const queue = await AsyncStorage.getItem(QUEUE_KEY);
        return queue ? JSON.parse(queue) : [];
    } catch (error) {
        console.error('Error getting queue:', error);
        return [];
    }
};

export const clearQueue = async () => {
    try {
        await AsyncStorage.removeItem(QUEUE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing queue:', error);
        return false;
    }
};

export const processQueue = async (authToken) => {
    const queue = await getQueue();
    if (queue.length === 0) return;

    try {
        const successfulReports = [];

        for (const report of queue) {
            try {
                const response = await axios.post(
                    'https://kwara-security-api.onrender.com/v1/user/report-case',
                    report,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    successfulReports.push(report);
                }
            } catch (error) {
                console.error('Error sending queued report:', error);
            }
        }

        if (successfulReports.length > 0) {
            const remainingQueue = queue.filter(report =>
                !successfulReports.some(sent => sent.localId === report.localId)
            );
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
        }

        return successfulReports.length;
    } catch (error) {
        console.error('Error processing queue:', error);
        return 0;
    }
};