"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook for managing notifications
 * Provides notifications state and fetch functionality
 * Tracks read/unread status using localStorage
 */
export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Get read notification IDs from localStorage
    const getReadNotifications = () => {
        try {
            const read = localStorage.getItem('readNotifications');
            return read ? JSON.parse(read) : [];
        } catch (error) {
            return [];
        }
    };

    // Mark notifications as read
    const markAsRead = useCallback((notificationIds) => {
        try {
            const readNotifications = getReadNotifications();
            const updatedRead = [...new Set([...readNotifications, ...notificationIds])];
            localStorage.setItem('readNotifications', JSON.stringify(updatedRead));

            // Recalculate unread count
            setNotifications(prev => {
                const updated = prev.map(notif => ({
                    ...notif,
                    read: updatedRead.includes(notif.id)
                }));
                const unread = updated.filter(n => !n.read).length;
                setUnreadCount(unread);
                return updated;
            });
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notifications');
            const fetchedNotifications = response.data.notifications || [];

            // Mark notifications as read or unread based on localStorage
            const readNotifications = getReadNotifications();
            const updatedNotifications = fetchedNotifications.map(notif => ({
                ...notif,
                read: readNotifications.includes(notif.id)
            }));

            setNotifications(updatedNotifications);

            // Count only unread notifications
            const unread = updatedNotifications.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        refresh: fetchNotifications,
        markAsRead
    };
}
