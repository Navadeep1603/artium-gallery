/**
 * Image hosting utility.
 * 
 * Uploads base64 images via the backend proxy endpoint,
 * which forwards them to ImgBB for free permanent hosting.
 * 
 * Falls back to storing compressed base64 directly in the DB
 * if no image hosting service is configured.
 */
import api from './api';

/**
 * Upload a base64 image and get back a hosted URL (or the base64 itself as fallback).
 * @param {string} base64DataUrl  - Full data-URL, e.g. "data:image/webp;base64,..."
 * @returns {Promise<{url: string, thumbnail: string}>}
 */
export async function uploadImageToHost(base64DataUrl) {
    if (!base64DataUrl || !base64DataUrl.startsWith('data:')) {
        return { url: base64DataUrl, thumbnail: base64DataUrl };
    }

    console.log('[ImageHost] Uploading image via backend proxy...',
        `(${(base64DataUrl.length / 1024).toFixed(1)} KB)`);

    // ── Strategy 1: Backend proxy to ImgBB ──
    try {
        const response = await api.post('/images/upload', {
            image: base64DataUrl
        }, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 30000,
        });

        if (response.data?.url) {
            const { url, thumbnail } = response.data;
            console.log('[ImageHost] Backend proxy upload success:', url);
            return { url, thumbnail: thumbnail || url };
        }
    } catch (err) {
        console.warn('[ImageHost] Backend proxy failed:', err?.response?.data?.error || err.message);
    }

    // ── Strategy 2: Direct ImgBB from frontend ──
    const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    if (IMGBB_KEY) {
        try {
            return await uploadDirectToImgBB(base64DataUrl, IMGBB_KEY);
        } catch (err) {
            console.warn('[ImageHost] Direct ImgBB failed:', err.message);
        }
    }

    // ── Strategy 3: Store base64 directly in DB ──
    // The images are already heavily compressed (~18-50KB) so they fit in LONGTEXT columns.
    console.log('[ImageHost] No image host available — using compressed base64 directly.',
        `Size: ${(base64DataUrl.length / 1024).toFixed(1)} KB`);
    return { url: base64DataUrl, thumbnail: base64DataUrl };
}

/**
 * Direct upload to ImgBB from frontend.
 */
async function uploadDirectToImgBB(base64DataUrl, apiKey) {
    const base64Data = base64DataUrl.split(',')[1];
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64Data);

    const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Image hosting failed (${response.status})`);
    }

    const data = await response.json();
    if (!data.success) {
        throw new Error('Image hosting returned an error');
    }

    console.log('[ImageHost] Direct ImgBB upload success:', data.data.url);
    return {
        url: data.data.url,
        thumbnail: data.data.thumb?.url || data.data.url,
    };
}
