import { Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";

/**
 * Get the appropriate icon component for a notification type
 * Extracted from duplicate getNotificationIcon functions in Shell components
 * 
 * @param {string} type - Notification type: 'success', 'error', 'camp', or default
 * @returns {JSX.Element} Icon component
 */
export function getNotificationIcon(type) {
    switch(type) {
        case 'success': 
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'error': 
            return <AlertCircle className="w-4 h-4 text-red-500" />;
        case 'camp': 
            return <Calendar className="w-4 h-4 text-purple-500" />;
        default: 
            return <Clock className="w-4 h-4 text-blue-500" />;
    }
}
