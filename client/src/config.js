const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();

export const API_URL = rawApiUrl;
export const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/1200x900?text=Product+Image';

if (import.meta.env.PROD && /localhost|127\.0\.0\.1/.test(API_URL)) {
	console.error('Invalid VITE_API_URL for production: localhost is not reachable by real users.');
}

export const resolveImageUrl = (imagePath = '') => {
	if (!imagePath) return FALLBACK_IMAGE_URL;
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	return `${API_URL}${imagePath}`;
};
