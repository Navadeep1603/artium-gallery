import { useState, useCallback } from 'react';

export function useShare() {
    const [isShared, setIsShared] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareData, setShareData] = useState(null);

    const share = useCallback(async (data) => {
        if (navigator.share) {
            try {
                await navigator.share(data);
                console.log('Shared successfully');
                setIsShared(true);
                setTimeout(() => setIsShared(false), 2000);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    // Fallback to modal
                    setShareData(data);
                    setIsModalOpen(true);
                }
            }
        } else {
            // Fallback to modal
            setShareData(data);
            setIsModalOpen(true);
        }
    }, []);

    const closeShareModal = () => setIsModalOpen(false);

    return { share, isShared, isModalOpen, shareData, closeShareModal };
}
