/**
 * Blood Compatibility Logic
 * 
 * Rules for compatibility:
 * - O- is universal donor (can give to all)
 * - AB+ is universal recipient (can receive from all)
 * 
 * Give To: Who can receive this blood type?
 * Receive From: What blood types can this person receive?
 */

export const BLOOD_COMPATIBILITY = {
    'O-': {
        giveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        receiveFrom: ['O-']
    },
    'O+': {
        giveTo: ['O+', 'A+', 'B+', 'AB+'],
        receiveFrom: ['O-', 'O+']
    },
    'A-': {
        giveTo: ['A-', 'A+', 'AB-', 'AB+'],
        receiveFrom: ['O-', 'A-']
    },
    'A+': {
        giveTo: ['A+', 'AB+'],
        receiveFrom: ['O-', 'O+', 'A-', 'A+']
    },
    'B-': {
        giveTo: ['B-', 'B+', 'AB-', 'AB+'],
        receiveFrom: ['O-', 'B-']
    },
    'B+': {
        giveTo: ['B+', 'AB+'],
        receiveFrom: ['O-', 'O+', 'B-', 'B+']
    },
    'AB-': {
        giveTo: ['AB-', 'AB+'],
        receiveFrom: ['O-', 'A-', 'B-', 'AB-']
    },
    'AB+': {
        giveTo: ['AB+'],
        receiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    }
};

/**
 * Check if a donor type can give to a recipient type
 * @param {string} donorType 
 * @param {string} recipientType 
 * @returns {boolean}
 */
export function isCompatible(donorType, recipientType) {
    if (!donorType || !recipientType) return false;
    const compatibility = BLOOD_COMPATIBILITY[donorType];
    return compatibility ? compatibility.giveTo.includes(recipientType) : false;
}

/**
 * Get all compatible donor types for a recipient type
 * @param {string} recipientType 
 * @returns {string[]}
 */
export function getCompatibleDonors(recipientType) {
    if (!recipientType) return [];
    return BLOOD_COMPATIBILITY[recipientType]?.receiveFrom || [];
}

/**
 * Get all potential recipient types for a donor type
 * @param {string} donorType 
 * @returns {string[]}
 */
export function getCompatibleRecipients(donorType) {
    if (!donorType) return [];
    return BLOOD_COMPATIBILITY[donorType]?.giveTo || [];
}
