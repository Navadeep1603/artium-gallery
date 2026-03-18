import { useState, useCallback } from 'react';

export function useShare() {
    const [isShared, setIsShared] = useState(false);

    const share = useCallback(async (shareData, fallbackCopyText) => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Shared successfully');
                setIsShared(true);
                setTimeout(() => setIsShared(false), 2000);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    fallbackCopy(fallbackCopyText || window.location.href);
                }
            }
        } else {
            fallbackCopy(fallbackCopyText || window.location.href);
        }
    }, []);

    const fallbackCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
            // Optionally, we could dispatch a toast notification here
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
        });
    };

    return { share, isShared };
}
