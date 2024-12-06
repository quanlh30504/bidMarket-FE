import React, { createContext, useState, useContext, useCallback } from 'react';
import { useUser } from "../context/UserContext";
import { useWebSocket } from '../hooks/useWebSocket';
import { toast } from 'react-toastify';
import { authUtils } from "../utils/authUtils";
import { notificationApi } from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const userId = user.UUID;
    const showToastNotification = useCallback((message, type = 'info') => {
        toast(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type,
            style: {
                borderRadius: '8px',
                background: '#fff',
                color: '#333',
            },
            className: `border-l-4 ${
                type === 'success' ? 'border-green-500' :
                    type === 'error' ? 'border-red-500' :
                        type === 'warning' ? 'border-yellow-500' :
                            'border-blue-500'
            }`
        });
    }, []);

    const handleNewNotification = useCallback((notification) => {
        console.log('New notification received:', notification);
        setNotifications(prev => [notification, ...prev]);

        if (!notification.read) {
            setUnreadCount(prev => prev + 1);
            showToastNotification(notification.message);
        }
    }, [showToastNotification]);

    useWebSocket(userId, handleNewNotification);

    const markAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);

            // update the notifications list
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );

            // decrease unread count
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));

            return true;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead(userId);

            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({
                    ...notification,
                    read: true
                }))
            );

            setUnreadCount(0);

            return true;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    };

    const value = {
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
        loading,
        setLoading,
        markAsRead,
        markAllAsRead,
        showToastNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};