import { useCallback } from 'react';
import { notificationApi } from '../services/api';
import { authUtils } from '../utils/authUtils';

export const useNotificationOperations = () => {
    const handleApiOperation = async (operation) => {
        const userId = authUtils.getCurrentUserId();
        if (!userId) return null;

        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            return await operation();
        } catch (error) {
            throw error;
        }
    };

    const operations = {
        fetchNotifications: useCallback(async (page = 0, size = 20) => {
            const userId = authUtils.getCurrentUserId();
            if (!userId) return null;

            return handleApiOperation(() =>
                notificationApi.getNotifications(userId, page, size)
            );
        }, []),

        markAsRead: useCallback(async (notificationId) => {
            return handleApiOperation(() =>
                notificationApi.markAsRead(notificationId)
            );
        }, []),

        markAllAsRead: useCallback(async () => {
            const userId = authUtils.getCurrentUserId();
            if (!userId) return null;

            return handleApiOperation(() =>
                notificationApi.markAllAsRead(userId)
            );
        }, [])
    };

    return { operations };
};