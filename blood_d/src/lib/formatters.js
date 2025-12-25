/**
 * Get relative time string (e.g., "5m ago", "2h ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function getTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

/**
 * Format date for display
 * @param {Date|string} dateStr - Date to format
 * @param {string} format - Format type: 'short' (MM/DD/YYYY) or 'long' (Month Day, Year)
 * @returns {string} Formatted date string
 */
export function formatDate(dateStr, format = 'short') {
    const date = new Date(dateStr);
    if (format === 'short') {
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Get camp status based on date comparison
 * @param {Date|string} dateStr - Camp date
 * @returns {{ status: string, color: string }} Status and color for UI
 */
export function getCampStatus(dateStr) {
    const campDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    campDate.setHours(0, 0, 0, 0);

    if (campDate < today) return { status: "Completed", color: "green" };
    if (campDate.getTime() === today.getTime()) return { status: "Ongoing", color: "gray" };
    return { status: "Upcoming", color: "yellow" };
}

/**
 * Format number with commas for large numbers
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}
