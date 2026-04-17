export const API_URL = import.meta.env.VITE_API_URL || '';
export const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/1200x900?text=Product+Image';

export const resolveImageUrl = (imagePath = '') => {
	if (!imagePath) return FALLBACK_IMAGE_URL;
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	return `${API_URL}${imagePath}`;
};
