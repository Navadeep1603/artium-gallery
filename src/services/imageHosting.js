/**
 * Free image hosting via ImgBB API.
 * Upload base64 images and get back a permanent URL.
 *
 * Get a free API key from: https://api.imgbb.com/
 * Then set VITE_IMGBB_API_KEY in your .env file.
 */

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '5e4f06bfe498edd153e9601b0e498eb7';

/**
 * Upload a base64 image to ImgBB and return the hosted URL.
 * @param {string} base64DataUrl  - Full data-URL string, e.g. "data:image/webp;base64,..."
 * @returns {Promise<{url: string, thumbnail: string, deleteUrl: string}>}
 */
export async function uploadImageToHost(base64DataUrl) {
    if (!base64DataUrl || !base64DataUrl.startsWith('data:')) {
        // Not a base64 image – return as-is (already a URL)
        return { url: base64DataUrl, thumbnail: base64DataUrl, deleteUrl: null };
    }

    // Strip the "data:image/...;base64," prefix – ImgBB wants raw base64
    const base64Data = base64DataUrl.split(',')[1];

    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Data);

    console.log('[ImgBB] Uploading image...', `(${(base64Data.length / 1024).toFixed(1)} KB base64)`);

    const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const err = await response.text();
        console.error('[ImgBB] Upload failed:', response.status, err);
        throw new Error(`Image hosting failed (${response.status}). Please try pasting a URL instead.`);
    }

    const data = await response.json();

    if (!data.success) {
        console.error('[ImgBB] API error:', data);
        throw new Error('Image hosting returned an error. Please try pasting a URL instead.');
    }

    const result = {
        url: data.data.url,
        thumbnail: data.data.thumb?.url || data.data.url,
        deleteUrl: data.data.delete_url,
    };

    console.log('[ImgBB] Upload success:', result.url);
    return result;
}
