/**
 * Generate a deterministic hash for a string and map it to a Tailwind color palette.
 * This is used for generating consistent avatar colors based on names or emails.
 */
export const getAvatarColor = (text: string = "") => {
    const colors = [
        "bg-red-100 text-red-700",
        "bg-blue-100 text-blue-700",
        "bg-green-100 text-green-700",
        "bg-yellow-100 text-yellow-700",
        "bg-purple-100 text-purple-700",
        "bg-pink-100 text-pink-700",
        "bg-indigo-100 text-indigo-700",
        "bg-cyan-100 text-cyan-700",
        "bg-orange-100 text-orange-700",
        "bg-teal-100 text-teal-700",
    ];

    if (!text) return colors[0];

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }

    return colors[Math.abs(hash) % colors.length];
};
