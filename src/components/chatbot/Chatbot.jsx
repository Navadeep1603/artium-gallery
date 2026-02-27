import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, Sparkles, ArrowRight, ShoppingCart, Palette, Image, Map } from 'lucide-react';
import { artworks, artists, exhibitions } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Chatbot.css';

// ─── Intent matching helpers ───────────────────────────────
function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s₹]/g, '').trim();
}

function matchesAny(input, keywords) {
    const n = normalize(input);
    return keywords.some(k => n.includes(k));
}

// ─── Bot brain ─────────────────────────────────────────────
function generateResponse(input, { user, cartItems, navigate, addToCart }) {
    const q = normalize(input);

    // ── Greetings ──
    if (matchesAny(q, ['hello', 'hi ', 'hey', 'hii', 'hiii', 'good morning', 'good evening', 'good afternoon', 'namaste'])) {
        const name = user ? user.name || user.email.split('@')[0] : 'art lover';
        return {
            text: `Hello ${name}! 👋 Welcome to Artium Virtual Gallery. I'm your art assistant. How can I help you today?`,
            suggestions: ['Browse artworks', 'Show featured art', 'Help me navigate', 'What can you do?']
        };
    }

    // ── What can you do ──
    if (matchesAny(q, ['what can you do', 'help', 'features', 'capabilities', 'what do you do'])) {
        return {
            text: `I can help you with:\n\n🎨 **Browse & Search** — Find artworks by name, artist, style, or price\n🛒 **Shopping** — Add items to cart, check your cart\n🗺️ **Navigation** — Guide you to any page\n👩‍🎨 **Artist Info** — Learn about our talented artists\n🏛️ **Exhibitions** — Find current exhibitions\n💰 **Pricing** — Get artwork prices and deals\n🖼️ **Virtual Tour** — Start an immersive gallery tour`,
            suggestions: ['Search artworks', 'Show artists', 'View exhibitions', 'Start virtual tour']
        };
    }

    // ── Search / browse artworks ──
    if (matchesAny(q, ['browse', 'show art', 'all art', 'artworks', 'gallery', 'collection', 'paintings', 'show me'])) {
        const featured = artworks.filter(a => a.featured).slice(0, 4);
        const list = featured.map(a => `• **${a.title}** by ${a.artist} — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `Here are some featured artworks:\n\n${list}\n\nWe have **${artworks.length} artworks** in total across paintings, digital art, sculptures, photography, and NFTs.`,
            suggestions: ['View gallery', 'Show paintings', 'Show digital art', 'Cheapest artworks'],
            action: { type: 'navigate', path: '/gallery' }
        };
    }

    // ── Category filters ──
    if (matchesAny(q, ['painting', 'oil', 'watercolor', 'canvas'])) {
        const items = artworks.filter(a => a.category === 'painting');
        const list = items.slice(0, 4).map(a => `• **${a.title}** — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `We have **${items.length} paintings**:\n\n${list}\n\nWould you like to see them all in the gallery?`,
            suggestions: ['View gallery', 'Show sculptures', 'Show digital art'],
            action: { type: 'navigate', path: '/gallery' }
        };
    }

    if (matchesAny(q, ['digital art', 'digital', 'nft', 'crypto art', 'generative'])) {
        const items = artworks.filter(a => a.category === 'digital' || a.category === 'nft');
        const list = items.slice(0, 4).map(a => `• **${a.title}** — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `We have **${items.length} digital/NFT artworks**:\n\n${list}`,
            suggestions: ['View gallery', 'Show paintings', 'Most expensive'],
            action: { type: 'navigate', path: '/gallery' }
        };
    }

    if (matchesAny(q, ['sculpture', 'bronze', 'marble', 'installation'])) {
        const items = artworks.filter(a => a.category === 'sculpture');
        const list = items.slice(0, 4).map(a => `• **${a.title}** — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `We have **${items.length} sculptures**:\n\n${list}`,
            suggestions: ['View gallery', 'Show paintings', 'Show photography'],
            action: { type: 'navigate', path: '/gallery' }
        };
    }

    if (matchesAny(q, ['photo', 'photograph'])) {
        const items = artworks.filter(a => a.category === 'photography');
        const list = items.slice(0, 4).map(a => `• **${a.title}** — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `We have **${items.length} photographs**:\n\n${list}`,
            suggestions: ['View gallery', 'Show paintings', 'Show digital art'],
            action: { type: 'navigate', path: '/gallery' }
        };
    }

    // ── Price queries ──
    if (matchesAny(q, ['cheap', 'affordable', 'lowest price', 'budget', 'under'])) {
        const sorted = [...artworks].filter(a => a.available).sort((a, b) => a.price - b.price).slice(0, 5);
        const list = sorted.map(a => `• **${a.title}** — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `Here are the most affordable artworks:\n\n${list}`,
            suggestions: ['Most expensive', 'View gallery', 'Add to cart']
        };
    }

    if (matchesAny(q, ['expensive', 'premium', 'luxury', 'highest price', 'most costly'])) {
        const sorted = [...artworks].filter(a => a.available).sort((a, b) => b.price - a.price).slice(0, 5);
        const list = sorted.map(a => `• **${a.title}** — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `Here are the premium artworks:\n\n${list}`,
            suggestions: ['Cheapest artworks', 'View gallery', 'Show featured art']
        };
    }

    if (matchesAny(q, ['featured', 'popular', 'trending', 'best', 'top'])) {
        const featured = artworks.filter(a => a.featured).slice(0, 5);
        const list = featured.map(a => `• **${a.title}** by ${a.artist} — ₹${a.price.toLocaleString('en-IN')} (${a.likes.toLocaleString()} ❤️)`).join('\n');
        return {
            text: `🌟 Here are our featured / most popular artworks:\n\n${list}`,
            suggestions: ['View gallery', 'Cheapest artworks', 'Show artists']
        };
    }

    // ── Specific artwork search ──
    const artworkMatch = artworks.find(a => normalize(a.title).includes(q) || q.includes(normalize(a.title)));
    if (artworkMatch) {
        return {
            text: `🖼️ **${artworkMatch.title}**\n\n• Artist: ${artworkMatch.artist}\n• Medium: ${artworkMatch.medium}\n• Style: ${artworkMatch.style}\n• Price: ₹${artworkMatch.price.toLocaleString('en-IN')}\n• Status: ${artworkMatch.available ? '✅ Available' : '❌ Sold'}\n• Year: ${artworkMatch.year}\n\n${artworkMatch.description}`,
            suggestions: ['View this artwork', 'Add to cart', 'Similar artworks', 'View gallery'],
            action: { type: 'navigate', path: `/artwork/${artworkMatch.id}` }
        };
    }

    // ── Artist queries ──
    if (matchesAny(q, ['artist', 'who made', 'creator', 'about artist'])) {
        if (artists && artists.length > 0) {
            const list = artists.slice(0, 6).map(a => `• **${a.name}** — ${a.specialty || a.bio?.substring(0, 60) + '...'}`).join('\n');
            return {
                text: `👩‍🎨 Our talented artists:\n\n${list}`,
                suggestions: ['View gallery', 'Show featured art', 'Browse artworks']
            };
        }
        return {
            text: `We have amazing artists at Artium! Visit the gallery to discover their works.`,
            suggestions: ['View gallery', 'Browse artworks']
        };
    }

    // Match specific artist name
    const artistMatch = artists?.find(a => q.includes(normalize(a.name)));
    if (artistMatch) {
        const artistWorks = artworks.filter(a => a.artistId === artistMatch.id);
        const list = artistWorks.slice(0, 4).map(a => `• **${a.title}** — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
        return {
            text: `👩‍🎨 **${artistMatch.name}**\n\n${artistMatch.bio || ''}\n\nArtworks (${artistWorks.length}):\n${list}`,
            suggestions: ['View gallery', 'Show all artists', 'Browse artworks']
        };
    }

    // ── Exhibition queries ──
    if (matchesAny(q, ['exhibition', 'exhibit', 'shows', 'events', 'current show'])) {
        if (exhibitions && exhibitions.length > 0) {
            const list = exhibitions.slice(0, 4).map(e => `• **${e.title}** — ${e.date || e.status || ''}`).join('\n');
            return {
                text: `🏛️ Current exhibitions:\n\n${list}\n\nVisit the exhibitions page for full details!`,
                suggestions: ['View exhibitions', 'Browse artworks', 'Start virtual tour'],
                action: { type: 'navigate', path: '/exhibitions' }
            };
        }
        return {
            text: `🏛️ Check out our exhibitions page for the latest shows and events!`,
            suggestions: ['View exhibitions', 'Browse artworks'],
            action: { type: 'navigate', path: '/exhibitions' }
        };
    }

    // ── Virtual tour ──
    if (matchesAny(q, ['virtual tour', 'tour', 'immersive', 'vr', '3d', 'walk through', 'explore'])) {
        return {
            text: `🗺️ Our **Virtual Gallery Tour** lets you explore artworks in an immersive environment! You can choose:\n\n• 🎧 **Guided Tour** — AI narration & auto-walk\n• 🧭 **Free Exploration** — Browse at your own pace\n• 🎨 **Curator's Pick** — Expert-curated themes\n\nWould you like to start?`,
            suggestions: ['Start virtual tour', 'View gallery', 'Browse artworks'],
            action: { type: 'navigate', path: '/virtual-tour' }
        };
    }

    // ── Cart / shopping ──
    if (matchesAny(q, ['cart', 'my cart', 'shopping cart', 'basket', 'checkout'])) {
        if (!user) {
            return {
                text: `🛒 You need to **log in** to view your cart and make purchases. Would you like to sign in?`,
                suggestions: ['Go to login', 'Sign up', 'Browse artworks'],
                action: { type: 'navigate', path: '/login' }
            };
        }
        if (cartItems && cartItems.length > 0) {
            const total = cartItems.reduce((sum, item) => sum + item.price, 0);
            const list = cartItems.map(i => `• ${i.title} — ₹${i.price.toLocaleString('en-IN')}`).join('\n');
            return {
                text: `🛒 Your cart (${cartItems.length} items):\n\n${list}\n\n**Total: ₹${total.toLocaleString('en-IN')}**`,
                suggestions: ['Go to cart', 'Checkout', 'Continue shopping'],
                action: { type: 'navigate', path: '/cart' }
            };
        }
        return {
            text: `🛒 Your cart is empty! Browse our gallery to find amazing artworks.`,
            suggestions: ['Browse artworks', 'Show featured art', 'Cheapest artworks'],
            action: { type: 'navigate', path: '/gallery' }
        };
    }

    // ── Add to cart intent ──
    if (matchesAny(q, ['add to cart', 'buy', 'purchase', 'i want', 'order'])) {
        if (!user) {
            return {
                text: `You need to **log in first** to add items to your cart. Shall I take you to the login page?`,
                suggestions: ['Go to login', 'Sign up', 'Browse artworks'],
                action: { type: 'navigate', path: '/login' }
            };
        }
        return {
            text: `To add an artwork to your cart, visit the artwork's detail page and click "Add to Cart". You can browse all available artworks in the gallery!\n\nYou can also tell me the **name of the artwork** you want and I'll take you to it.`,
            suggestions: ['View gallery', 'Show featured art', 'Cheapest artworks']
        };
    }

    // ── Navigation ──
    if (matchesAny(q, ['navigate', 'go to', 'take me', 'open', 'where is'])) {
        if (matchesAny(q, ['home', 'main'])) {
            return { text: `Taking you to the home page! 🏠`, suggestions: [], action: { type: 'navigate', path: '/' } };
        }
        if (matchesAny(q, ['gallery'])) {
            return { text: `Opening the gallery for you! 🎨`, suggestions: [], action: { type: 'navigate', path: '/gallery' } };
        }
        if (matchesAny(q, ['exhibition'])) {
            return { text: `Opening exhibitions! 🏛️`, suggestions: [], action: { type: 'navigate', path: '/exhibitions' } };
        }
        if (matchesAny(q, ['tour', 'virtual'])) {
            return { text: `Starting the virtual tour! 🗺️`, suggestions: [], action: { type: 'navigate', path: '/virtual-tour' } };
        }
        if (matchesAny(q, ['login', 'sign in'])) {
            return { text: `Taking you to login! 🔐`, suggestions: [], action: { type: 'navigate', path: '/login' } };
        }
        if (matchesAny(q, ['cart'])) {
            return { text: `Opening your cart! 🛒`, suggestions: [], action: { type: 'navigate', path: '/cart' } };
        }
        if (matchesAny(q, ['shop'])) {
            return { text: `Opening the shop! 🏪`, suggestions: [], action: { type: 'navigate', path: '/shop' } };
        }
        return {
            text: `Where would you like to go?`,
            suggestions: ['Home', 'Gallery', 'Exhibitions', 'Virtual Tour', 'Shop', 'Cart']
        };
    }

    // ── Quick navigation suggestions ──
    if (matchesAny(q, ['view gallery', 'open gallery'])) {
        return { text: `Opening the gallery! 🎨`, suggestions: ['Show featured art'], action: { type: 'navigate', path: '/gallery' } };
    }
    if (matchesAny(q, ['view exhibition', 'open exhibition'])) {
        return { text: `Opening exhibitions! 🏛️`, suggestions: [], action: { type: 'navigate', path: '/exhibitions' } };
    }
    if (matchesAny(q, ['start virtual tour', 'start tour'])) {
        return { text: `Starting the virtual tour! 🗺️`, suggestions: [], action: { type: 'navigate', path: '/virtual-tour' } };
    }
    if (matchesAny(q, ['go to login', 'sign in', 'log in', 'login'])) {
        return { text: `Taking you to login! 🔐`, suggestions: [], action: { type: 'navigate', path: '/login' } };
    }
    if (matchesAny(q, ['sign up', 'register', 'create account'])) {
        return { text: `Taking you to sign up! ✨`, suggestions: [], action: { type: 'navigate', path: '/signup' } };
    }
    if (matchesAny(q, ['go to cart', 'open cart'])) {
        return { text: `Opening your cart! 🛒`, suggestions: [], action: { type: 'navigate', path: '/cart' } };
    }
    if (matchesAny(q, ['continue shopping'])) {
        return { text: `Let's find more artworks! 🎨`, suggestions: ['Show featured art', 'Cheapest artworks'], action: { type: 'navigate', path: '/gallery' } };
    }

    // ── Account queries ──
    if (matchesAny(q, ['account', 'profile', 'my account', 'settings', 'dashboard'])) {
        if (!user) {
            return {
                text: `You're not logged in yet. Log in to access your dashboard, profile, and order history!`,
                suggestions: ['Go to login', 'Sign up', 'Browse artworks'],
                action: { type: 'navigate', path: '/login' }
            };
        }
        return {
            text: `Welcome back, **${user.name || user.email}**!\n\nYou can access:\n• 📊 Dashboard\n• 👤 Profile\n• 🛒 Cart\n• 💳 Orders`,
            suggestions: ['Go to dashboard', 'View cart', 'Browse artworks']
        };
    }

    // ── Price of specific art ──
    if (matchesAny(q, ['price', 'cost', 'how much', 'rate'])) {
        // Try to find specific artwork
        const found = artworks.find(a => q.includes(normalize(a.title)));
        if (found) {
            return {
                text: `💰 **${found.title}** is priced at **₹${found.price.toLocaleString('en-IN')}**\n\nStatus: ${found.available ? '✅ Available for purchase' : '❌ Sold'}`,
                suggestions: ['View this artwork', 'Add to cart', 'Similar artworks'],
                action: { type: 'navigate', path: `/artwork/${found.id}` }
            };
        }
        return {
            text: `Our artworks range from **₹${Math.min(...artworks.map(a => a.price)).toLocaleString('en-IN')}** to **₹${Math.max(...artworks.map(a => a.price)).toLocaleString('en-IN')}**.\n\nTell me a specific artwork name for its price, or browse by budget!`,
            suggestions: ['Cheapest artworks', 'Most expensive', 'Browse artworks']
        };
    }

    // ── Thanks ──
    if (matchesAny(q, ['thank', 'thanks', 'thx', 'appreciate'])) {
        return {
            text: `You're welcome! 😊 Happy to help. Enjoy exploring the gallery!`,
            suggestions: ['Browse artworks', 'Show featured art', 'Start virtual tour']
        };
    }

    // ── Goodbye ──
    if (matchesAny(q, ['bye', 'goodbye', 'see you', 'later', 'exit'])) {
        return {
            text: `Goodbye! 👋 Come back anytime. Happy art exploring!`,
            suggestions: ['Browse artworks']
        };
    }

    // ── About the gallery ──
    if (matchesAny(q, ['about', 'what is artium', 'tell me about', 'this gallery', 'this website'])) {
        return {
            text: `🏛️ **Artium Virtual Gallery** is a premium online art platform featuring:\n\n• ${artworks.length} curated artworks\n• ${artists?.length || 'Multiple'} talented artists\n• Virtual gallery tours\n• Curated exhibitions\n• Secure art purchasing\n\nAll prices are in **Indian Rupees (₹)**. Start exploring!`,
            suggestions: ['Browse artworks', 'Show artists', 'Start virtual tour', 'View exhibitions']
        };
    }

    // ── Shipping / delivery ──
    if (matchesAny(q, ['shipping', 'delivery', 'ship', 'deliver', 'receive'])) {
        return {
            text: `📦 **Shipping Info:**\n\n• Free shipping on orders above ₹5,000\n• Standard delivery: 5–7 business days\n• Express delivery: 2–3 business days\n• All artworks are carefully packaged and insured\n• International shipping available`,
            suggestions: ['Browse artworks', 'View cart', 'Checkout']
        };
    }

    // ── Payment ──
    if (matchesAny(q, ['payment', 'pay', 'credit card', 'upi', 'debit'])) {
        return {
            text: `💳 **Payment Options:**\n\n• Credit/Debit Cards (Visa, Mastercard)\n• UPI\n• Net Banking\n• EMI options available on select artworks\n• Secure payment gateway`,
            suggestions: ['View cart', 'Checkout', 'Browse artworks']
        };
    }

    // ── Fallback: try partial artwork title match ──
    const partialMatch = artworks.find(a => {
        const words = normalize(a.title).split(' ');
        return words.some(w => w.length > 3 && q.includes(w));
    });
    if (partialMatch) {
        return {
            text: `Did you mean **${partialMatch.title}**?\n\n• Artist: ${partialMatch.artist}\n• Price: ₹${partialMatch.price.toLocaleString('en-IN')}\n• ${partialMatch.available ? '✅ Available' : '❌ Sold'}`,
            suggestions: ['View this artwork', 'View gallery', 'Search again'],
            action: { type: 'navigate', path: `/artwork/${partialMatch.id}` }
        };
    }

    // ── Default fallback ──
    return {
        text: `I'm not sure I understand that. Here's what I can help with:\n\n🎨 Search artworks by name, category, or price\n🛒 Shopping & cart assistance\n🗺️ Navigation help\n👩‍🎨 Artist information\n🏛️ Exhibition details\n\nTry asking something like *"Show me paintings"* or *"What's the cheapest artwork?"*`,
        suggestions: ['Browse artworks', 'Show artists', 'Help me navigate', 'What can you do?']
    };
}

// ─── Chat Message Component ───────────────────────────────
function ChatMessage({ message }) {
    const formatText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className={`chatbot-msg chatbot-msg--${message.sender}`}>
            <div className="chatbot-msg__avatar">
                {message.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="chatbot-msg__bubble">
                <div
                    className="chatbot-msg__text"
                    dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                />
                {message.timestamp && (
                    <span className="chatbot-msg__time">
                        {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── Main Chatbot Component ───────────────────────────────
export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "Welcome to **Artium Gallery**! 🎨 I'm your art assistant. Ask me about artworks, artists, exhibitions, or let me help you navigate!",
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, addToCart } = useCart();

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = useCallback((text) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        // Add user message
        const userMsg = { id: Date.now(), sender: 'user', text: messageText, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate thinking delay
        setTimeout(() => {
            const response = generateResponse(messageText, { user, cartItems, navigate, addToCart });

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: response.text,
                suggestions: response.suggestions,
                action: response.action,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);

            // Auto-navigate if action exists
            if (response.action?.type === 'navigate') {
                setTimeout(() => navigate(response.action.path), 1500);
            }
        }, 600 + Math.random() * 800);
    }, [input, user, cartItems, navigate, addToCart]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    const quickActions = [
        { icon: Palette, label: 'Artworks', query: 'Browse artworks' },
        { icon: Image, label: 'Featured', query: 'Show featured art' },
        { icon: Map, label: 'Tour', query: 'Start virtual tour' },
        { icon: ShoppingCart, label: 'Cart', query: 'My cart' },
    ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'chatbot-toggle--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat with us"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && <span className="chatbot-toggle__pulse" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header__info">
                            <div className="chatbot-header__avatar">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h4 className="chatbot-header__title">Artium Assistant</h4>
                                <span className="chatbot-header__status">
                                    <span className="chatbot-header__dot" /> Online
                                </span>
                            </div>
                        </div>
                        <button className="chatbot-header__close" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="chatbot-quick-actions">
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                className="chatbot-quick-action"
                                onClick={() => handleSend(action.query)}
                            >
                                <action.icon size={14} />
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id}>
                                <ChatMessage message={msg} />
                                {msg.suggestions && msg.suggestions.length > 0 && msg.sender === 'bot' && (
                                    <div className="chatbot-suggestions">
                                        {msg.suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                className="chatbot-suggestion"
                                                onClick={() => handleSuggestionClick(s)}
                                            >
                                                {s} <ArrowRight size={12} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chatbot-msg chatbot-msg--bot">
                                <div className="chatbot-msg__avatar"><Bot size={16} /></div>
                                <div className="chatbot-msg__bubble chatbot-typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chatbot-input-area">
                        <input
                            ref={inputRef}
                            type="text"
                            className="chatbot-input"
                            placeholder="Ask me anything about art..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="chatbot-send"
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
