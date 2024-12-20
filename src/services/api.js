import axiosClient from "./axiosClient";
export const notificationApi = {
    getNotifications: (userId, page = 0, size = 20) =>
        axiosClient.get(`/api/notifications/user/${userId}?page=${page}&size=${size}`),

    getUnreadCount: (userId) =>
        axiosClient.get(`/api/notifications/user/${userId}/unread-count`),

    createNotification: (message, userId) =>
        axiosClient.post('/api/notifications', { message, userId }),

    markAsRead: (id) =>
        axiosClient.put(`/api/notifications/${id}/read`),

    markAllAsRead: (userId) =>
        axiosClient.put(`/api/notifications/user/${userId}/mark-all-read`)
};