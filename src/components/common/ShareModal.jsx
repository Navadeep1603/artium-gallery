import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import './ShareModal.css';

export default function ShareModal({ isOpen, onClose, shareData }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCopied(false);
        }
    }, [isOpen]);

    if (!isOpen || !shareData) return null;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareData.url || window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const urlToShare = shareData.url || window.location.href;
    const textToShare = shareData.text || '';
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare + " " + urlToShare)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(textToShare)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlToShare)}`;

    return createPortal(
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal-content" onClick={e => e.stopPropagation()}>
                <button className="share-modal-close" onClick={onClose} aria-label="Close modal">
                    <X size={20} />
                </button>
                <h3 className="share-modal-title">Share</h3>
                <p className="share-modal-desc">{shareData.title || 'Check this out'}</p>
                
                <div className="share-modal-options">
                    <button className="share-modal-btn copy-btn" onClick={copyLink}>
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="share-modal-btn whatsapp-btn">
                        <MessageCircle size={20} />
                        <span>WhatsApp</span>
                    </a>
                    
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="share-modal-btn twitter-btn">
                        <Twitter size={20} />
                        <span>X (Twitter)</span>
                    </a>
                    
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="share-modal-btn linkedin-btn">
                        <Linkedin size={20} />
                        <span>LinkedIn</span>
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
}
