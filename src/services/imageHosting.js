/**
 * Image hosting utility.
 * 
 * Uploads base64 images via the backend proxy endpoint,
 * which forwards them to ImgBB for free permanent hosting.
 * 
 * The API key is stored server-side for security.
 */
import api from './api';

/**
 * Upload a base64 image and get back a hosted URL.
 * @param {string} base64DataUrl  - Full data-URL, e.g. "data:image/webp;base64,..."
 * @returns {Promise<{url: string, thumbnail: string}>}
 */
export async function uploadImageToHost(base64DataUrl) {
    if (!base64DataUrl || !base64DataUrl.startsWith('data:')) {
        return { url: base64DataUrl, thumbnail: base64DataUrl };
    }

    console.log('[ImageHost] Uploading image via backend proxy...',
        `(${(base64DataUrl.length / 1024).toFixed(1)} KB)`);

    try {
        // Use our backend endpoint which proxies to ImgBB
        const response = await api.post('/images/upload', {
            image: base64DataUrl
        }, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 30000,
        });

        const { url, thumbnail } = response.data;
        console.log('[ImageHost] Upload success:', url);
        return { url, thumbnail: thumbnail || url };
    } catch (err) {
        console.error('[ImageHost] Backend upload failed, trying direct ImgBB...', err);
        
        // Fallback: try direct ImgBB upload from frontend
        return await uploadDirectToImgBB(base64DataUrl);
    }
}

/**
 * Direct upload to ImgBB from frontend (fallback).
 */
async function uploadDirectToImgBB(base64DataUrl) {
    const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    if (!IMGBB_KEY) {
        throw new Error('Image upload is not configured. Please use the "Paste URL" option instead.');
    }

    const base64Data = base64DataUrl.split(',')[1];
    const formData = new FormData();
    formData.append('key', IMGBB_KEY);
    formData.append('image', base64Data);

    const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Image hosting failed (${response.status}). Please try pasting a URL instead.`);
    }

    const data = await response.json();
    if (!data.success) {
        throw new Error('Image hosting returned an error. Please try pasting a URL instead.');
    }

    return {
        url: data.data.url,
        thumbnail: data.data.thumb?.url || data.data.url,
    };
}
