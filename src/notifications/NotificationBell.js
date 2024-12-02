// NotificationBell.js
import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNotification } from './NotificationContext';
import { useUser } from '../context/UserContext';
import { notificationApi } from '../services/api';
import { authUtils } from '../utils/authUtils';

const NotificationItem = memo(({ notification, onMarkAsRead }) => (
    <div
        onClick={() => !notification.read && onMarkAsRead(notification.id)}
        className={`p-4 hover:bg-gray-50 cursor-pointer ${
            !notification.read ? 'bg-blue-50' : ''
        }`}
    >
        <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
            {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
        </p>
    </div>
));

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);
    const hasInitialFetchRef = useRef(false);
    const { user } = useUser();
    const {
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
        loading,
        setLoading,
        markAsRead,
        markAllAsRead,
        showToastNotification
    } = useNotification();

    const userId = user?.id || authUtils.getCurrentUserId();

    // Initial data fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!userId || hasInitialFetchRef.current || loading) return;

            setLoading(true);
            try {
                const [notificationsRes, unreadCountRes] = await Promise.all([
                    notificationApi.getNotifications(userId),
                    notificationApi.getUnreadCount(userId)
                ]);

                if (notificationsRes?.data?.content) {
                    setNotifications(notificationsRes.data.content);
                }
                if (typeof unreadCountRes?.data === 'number') {
                    setUnreadCount(unreadCountRes.data);
                }

                hasInitialFetchRef.current = true;
            } catch (error) {
                console.error('Failed to fetch initial notifications:', error);
                showToastNotification('Failed to fetch notifications', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [userId]);

    const handleMarkAsRead = useCallback(async (notificationId) => {
        try {
            await markAsRead(notificationId);
            showToastNotification('Notification marked as read', 'success');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            showToastNotification('Failed to mark notification as read', 'error');
        }
    }, [markAsRead, showToastNotification]);

    const handleMarkAllAsRead = useCallback(async () => {
        try {
            await markAllAsRead();
            showToastNotification('All notifications marked as read', 'success');
        } catch (error) {
            console.error('Error marking all as read:', error);
            showToastNotification('Failed to mark all as read', 'error');
        }
    }, [markAllAsRead, showToastNotification]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!userId) return null;

    return (
        <div className="relative" ref={bellRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="mt-2">Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No notifications</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};