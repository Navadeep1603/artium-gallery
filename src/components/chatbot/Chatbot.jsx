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
function generateResponse(input, { user, cartItems }) {
    const q = normalize(input);

    // ── Role-specific greeting helpers ──
    const getRoleGreeting = (role, name) => {
        switch (role) {
            case 'artist':
                return {
                    text: `Hello **${name}**! 🎨 Welcome back, talented artist! I'm here to help you manage your artworks, track sales, and grow your gallery presence. What would you like to do?`,
                    suggestions: ['Upload new artwork', 'My dashboard', 'View my artworks', 'Track my sales']
                };
            case 'visitor':
                return {
                    text: `Hello **${name}**! 👋 Welcome back to Artium! Ready to explore amazing art? I can help you browse artworks, manage your cart, or discover new exhibitions.`,
                    suggestions: ['Browse artworks', 'My cart', 'Show featured art', 'Start virtual tour']
                };
            case 'curator':
                return {
                    text: `Hello **${name}**! 🏛️ Welcome back, Curator! I can help you manage exhibitions, review artworks, and curate collections.`,
                    suggestions: ['My dashboard', 'View exhibitions', 'Browse artworks', 'Review submissions']
                };
            case 'admin':
                return {
                    text: `Hello **${name}**! ⚙️ Welcome back, Admin! I can help you manage the gallery, users, and platform settings.`,
                    suggestions: ['Admin dashboard', 'View all artworks', 'Manage users', 'View exhibitions']
                };
            default:
                return {
                    text: `Hello ${name}! 👋 Welcome to Artium Virtual Gallery. I'm your art assistant. How can I help you today?`,
                    suggestions: ['Browse artworks', 'Show featured art', 'Help me navigate', 'What can you do?']
                };
        }
    };

    // ── Greetings ──
    if (matchesAny(q, ['hello', 'hi ', 'hey', 'hii', 'hiii', 'good morning', 'good evening', 'good afternoon', 'namaste'])) {
        if (user) {
            const name = user.name || user.email.split('@')[0];
            return getRoleGreeting(user.role, name);
        }
        return {
            text: `Hello! 👋 Welcome to Artium Virtual Gallery. I'm your art assistant. Please **log in** to get personalized help, or feel free to explore!`,
            suggestions: ['Browse artworks', 'Go to login', 'Show featured art', 'What can you do?']
        };
    }

    // ── What can you do — role-specific ──
    if (matchesAny(q, ['what can you do', 'help', 'features', 'capabilities', 'what do you do'])) {
        if (user?.role === 'artist') {
            return {
                text: `As your **Artist Assistant**, I can help you with:\n\n🎨 **Upload Artwork** — Add new paintings, digital art, sculptures\n📊 **Dashboard** — View your sales, stats, and earnings\n🖼️ **My Artworks** — Manage your uploaded pieces\n💰 **Track Sales** — Check revenue and buyer insights\n📈 **Analytics** — View performance of your artworks\n🏛️ **Exhibitions** — See current exhibitions\n🗺️ **Navigation** — Go to any page`,
                suggestions: ['Upload new artwork', 'My dashboard', 'View my artworks', 'Track my sales']
            };
        }
        if (user?.role === 'visitor') {
            return {
                text: `As your **Personal Art Guide**, I can help you with:\n\n🎨 **Browse & Search** — Find artworks by name, artist, style, or price\n🛒 **Cart & Shopping** — Add items, view cart, checkout\n❤️ **Wishlist** — Save your favorite artworks\n👤 **My Profile** — View and update your account\n🏛️ **Exhibitions** — Discover curated shows\n🗺️ **Virtual Tour** — Walk through immersive galleries\n💰 **Pricing** — Compare prices, find deals`,
                suggestions: ['Browse artworks', 'My cart', 'My profile', 'Start virtual tour']
            };
        }
        if (user?.role === 'curator') {
            return {
                text: `As your **Curator Assistant**, I can help you with:\n\n🏛️ **Manage Exhibitions** — Create and curate shows\n🎨 **Review Art** — Browse and evaluate submissions\n📊 **Dashboard** — View curation stats\n🗺️ **Virtual Tour** — Explore gallery tours\n👩‍🎨 **Artists** — Connect with artists`,
                suggestions: ['My dashboard', 'View exhibitions', 'Browse artworks', 'Show artists']
            };
        }
        if (user?.role === 'admin') {
            return {
                text: `As your **Admin Assistant**, I can help you with:\n\n⚙️ **Admin Panel** — Full platform management\n👥 **Users** — Manage artist, visitor, curator accounts\n🎨 **Artworks** — Review and manage all artworks\n🏛️ **Exhibitions** — Create and manage exhibitions\n📊 **Analytics** — Platform insights and metrics`,
                suggestions: ['Admin dashboard', 'View all artworks', 'View exhibitions', 'Browse artworks']
            };
        }
        return {
            text: `I can help you with:\n\n🎨 **Browse & Search** — Find artworks by name, artist, style, or price\n🛒 **Shopping** — Add items to cart, check your cart\n🗺️ **Navigation** — Guide you to any page\n👩‍🎨 **Artist Info** — Learn about our talented artists\n🏛️ **Exhibitions** — Find current exhibitions\n💰 **Pricing** — Get artwork prices and deals\n🖼️ **Virtual Tour** — Start an immersive gallery tour`,
            suggestions: ['Search artworks', 'Show artists', 'View exhibitions', 'Start virtual tour']
        };
    }

    // ── Artist-specific intents ──
    if (user?.role === 'artist') {
        if (matchesAny(q, ['upload', 'add art', 'new artwork', 'submit', 'post art', 'create art'])) {
            return {
                text: `🎨 Let's upload your new artwork! I'll take you to the upload page where you can:\n\n• Add title, description, and pricing\n• Choose category and medium\n• Upload high-quality images\n• Set availability and pricing in ₹`,
                suggestions: ['Go to upload page', 'My dashboard', 'View my artworks'],
                action: { type: 'navigate', path: '/dashboard/artist/upload' }
            };
        }
        if (matchesAny(q, ['my artwork', 'my art', 'my work', 'my piece', 'my upload', 'my collection'])) {
            return {
                text: `🖼️ You can view and manage all your uploaded artworks from your **Artist Dashboard**. There you can edit details, update pricing, and track views.`,
                suggestions: ['My dashboard', 'Upload new artwork', 'Track my sales'],
                action: { type: 'navigate', path: '/dashboard/artist' }
            };
        }
        if (matchesAny(q, ['sales', 'revenue', 'earning', 'income', 'sold', 'how much i made', 'track'])) {
            return {
                text: `📊 Check your **Artist Dashboard** for detailed sales analytics:\n\n• 💰 Total revenue\n• 📈 Sales trends\n• 🛒 Recent orders\n• 👁️ Artwork views and engagement\n\nAll earnings are displayed in **₹ (INR)**.`,
                suggestions: ['My dashboard', 'Upload new artwork', 'View my artworks'],
                action: { type: 'navigate', path: '/dashboard/artist' }
            };
        }
        if (matchesAny(q, ['pricing tip', 'how to price', 'set price', 'pricing advice'])) {
            return {
                text: `💡 **Pricing Tips for Artists:**\n\n• Research similar artworks on the platform\n• Consider your medium, size, and time invested\n• Digital art typically ranges ₹1,000 — ₹25,000\n• Physical paintings: ₹3,000 — ₹50,000+\n• Sculptures: ₹10,000 — ₹1,00,000+\n• Start competitive and adjust based on demand`,
                suggestions: ['Upload new artwork', 'View gallery', 'My dashboard']
            };
        }
    }

    // ── Visitor-specific intents ──
    if (user?.role === 'visitor') {
        if (matchesAny(q, ['my profile', 'edit profile', 'update profile', 'my account setting'])) {
            return {
                text: `👤 Let me take you to your **profile page** where you can:\n\n• Update your name and avatar\n• View your order history\n• Manage your preferences\n• Update email and settings`,
                suggestions: ['My cart', 'Browse artworks', 'My dashboard'],
                action: { type: 'navigate', path: '/dashboard/visitor/profile' }
            };
        }
        if (matchesAny(q, ['my order', 'order history', 'past purchase', 'what i bought', 'previous order'])) {
            return {
                text: `📦 You can view your complete **order history** from your dashboard, including:\n\n• Past purchases\n• Order status and tracking\n• Payment receipts\n• Download invoices`,
                suggestions: ['My dashboard', 'My cart', 'Browse artworks'],
                action: { type: 'navigate', path: '/dashboard/visitor' }
            };
        }
        if (matchesAny(q, ['wishlist', 'saved', 'favorite', 'liked', 'save for later'])) {
            return {
                text: `❤️ Your saved/liked artworks can be found in your **Visitor Dashboard**! Keep discovering and saving artworks you love.`,
                suggestions: ['My dashboard', 'Browse artworks', 'Show featured art'],
                action: { type: 'navigate', path: '/dashboard/visitor' }
            };
        }
        if (matchesAny(q, ['recommend', 'suggest me', 'what should i buy', 'pick for me'])) {
            const recommended = artworks.filter(a => a.featured && a.available).slice(0, 4);
            const list = recommended.map(a => `• **${a.title}** by ${a.artist} — ₹${a.price.toLocaleString('en-IN')}`).join('\n');
            return {
                text: `✨ Based on popular choices, I recommend:\n\n${list}\n\nWant me to show more options by category or budget?`,
                suggestions: ['Show paintings', 'Cheapest artworks', 'Show digital art', 'View gallery']
            };
        }
    }

    // ── Curator-specific intents ──
    if (user?.role === 'curator') {
        if (matchesAny(q, ['curate', 'create exhibition', 'manage exhibition', 'new exhibition'])) {
            return {
                text: `🏛️ You can manage exhibitions from your **Curator Dashboard**! Create new shows, select artworks, and organize gallery themes.`,
                suggestions: ['My dashboard', 'View exhibitions', 'Browse artworks'],
                action: { type: 'navigate', path: '/dashboard/curator' }
            };
        }
    }

    // ── Admin-specific intents ──
    if (user?.role === 'admin') {
        if (matchesAny(q, ['admin dashboard', 'manage', 'admin panel', 'manage user', 'platform'])) {
            return {
                text: `⚙️ Taking you to the **Admin Dashboard** where you can manage users, artworks, exhibitions, and platform settings.`,
                suggestions: ['View all artworks', 'View exhibitions', 'Browse artworks'],
                action: { type: 'navigate', path: '/dashboard/admin' }
            };
        }
    }

    // ── Dashboard navigation (role-aware) ──
    if (matchesAny(q, ['my dashboard', 'go to dashboard', 'dashboard', 'open dashboard'])) {
        if (!user) {
            return {
                text: `Please **log in** first to access your dashboard!`,
                suggestions: ['Go to login', 'Sign up', 'Browse artworks'],
                action: { type: 'navigate', path: '/login' }
            };
        }
        const dashPaths = {
            artist: '/dashboard/artist',
            visitor: '/dashboard/visitor',
            curator: '/dashboard/curator',
            admin: '/dashboard/admin'
        };
        const roleName = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        return {
            text: `📊 Opening your **${roleName} Dashboard**, ${user.name}!`,
            suggestions: ['Browse artworks', 'View exhibitions'],
            action: { type: 'navigate', path: dashPaths[user.role] || '/dashboard/visitor' }
        };
    }

    // ── Upload page shortcut ──
    if (matchesAny(q, ['go to upload', 'upload page', 'go to upload page'])) {
        if (user?.role === 'artist') {
            return { text: `Opening the upload page! 🎨`, suggestions: [], action: { type: 'navigate', path: '/dashboard/artist/upload' } };
        }
        return { text: `Only artists can upload artworks. Please switch to an artist account.`, suggestions: ['Go to login', 'Browse artworks'] };
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
// ─── Generate role-aware welcome message ──────────────────
function getWelcomeMessage(user) {
    if (!user) {
        return "Welcome to **Artium Gallery**! 🎨 I'm your art assistant. Ask me about artworks, artists, exhibitions, or let me help you navigate!";
    }
    const name = user.name || user.email.split('@')[0];
    switch (user.role) {
        case 'artist':
            return `Welcome back, **${name}**! 🎨 I'm your artist assistant. I can help you upload artworks, track sales, manage your portfolio, or answer any questions!`;
        case 'visitor':
            return `Welcome back, **${name}**! 👋 I'm your personal art guide. I can help you browse artworks, manage your cart, find deals, or explore exhibitions!`;
        case 'curator':
            return `Welcome back, **${name}**! 🏛️ I'm your curator assistant. I can help you manage exhibitions, review artworks, and explore the gallery!`;
        case 'admin':
            return `Welcome back, **${name}**! ⚙️ I'm your admin assistant. I can help you manage the platform, users, and operations.`;
        default:
            return `Welcome back, **${name}**! 🎨 I'm your art assistant. How can I help you today?`;
    }
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: getWelcomeMessage(user),
            timestamp: new Date().getTime()
        }
    ]);

    // Update welcome message when user logs in/out
    const prevUserRef = useRef(user);
    useEffect(() => {
        if (prevUserRef.current !== user) {
            prevUserRef.current = user;
            setTimeout(() => setMessages([{
                id: Date.now(),
                sender: 'bot',
                text: getWelcomeMessage(user),
                timestamp: Date.now()
            }]), 0);
        }
    }, [user]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
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

    const getQuickActions = () => {
        if (user?.role === 'artist') {
            return [
                { icon: Palette, label: 'Upload Art', query: 'Upload new artwork' },
                { icon: Image, label: 'My Artworks', query: 'View my artworks' },
                { icon: Map, label: 'Dashboard', query: 'My dashboard' },
                { icon: ShoppingCart, label: 'Sales', query: 'Track my sales' },
            ];
        }
        if (user?.role === 'visitor') {
            return [
                { icon: Palette, label: 'Artworks', query: 'Browse artworks' },
                { icon: ShoppingCart, label: 'My Cart', query: 'My cart' },
                { icon: Image, label: 'Featured', query: 'Show featured art' },
                { icon: Map, label: 'Tour', query: 'Start virtual tour' },
            ];
        }
        if (user?.role === 'curator') {
            return [
                { icon: Map, label: 'Dashboard', query: 'My dashboard' },
                { icon: Image, label: 'Exhibitions', query: 'View exhibitions' },
                { icon: Palette, label: 'Artworks', query: 'Browse artworks' },
                { icon: ShoppingCart, label: 'Artists', query: 'Show artists' },
            ];
        }
        if (user?.role === 'admin') {
            return [
                { icon: Map, label: 'Admin Panel', query: 'Admin dashboard' },
                { icon: Palette, label: 'Artworks', query: 'Browse artworks' },
                { icon: Image, label: 'Exhibitions', query: 'View exhibitions' },
                { icon: ShoppingCart, label: 'Artists', query: 'Show artists' },
            ];
        }
        return [
            { icon: Palette, label: 'Artworks', query: 'Browse artworks' },
            { icon: Image, label: 'Featured', query: 'Show featured art' },
            { icon: Map, label: 'Tour', query: 'Start virtual tour' },
            { icon: ShoppingCart, label: 'Cart', query: 'My cart' },
        ];
    };

    const quickActions = getQuickActions();

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
