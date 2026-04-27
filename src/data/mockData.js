// Exhibitions data
export const exhibitions = [
  {
    id: 1,
    title: "Modern Masters",
    subtitle: "Contemporary Visions",
    description: "A groundbreaking exhibition featuring the most influential contemporary artists of our time.",
    curator: "Dr. Sarah Mitchell",
    startDate: "2024-01-15",
    endDate: "2024-04-30",
    status: "current",
    artworkCount: 45,
    image: "https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?w=800",
    featured: true,
    theme: "modern"
  },
  {
    id: 2,
    title: "Classical Reimagined",
    subtitle: "Old Masters, New Perspectives",
    description: "Exploring how classical art continues to inspire and influence contemporary creation.",
    curator: "Prof. James Harrison",
    startDate: "2024-02-01",
    endDate: "2024-05-15",
    status: "current",
    artworkCount: 38,
    image: "https://images.unsplash.com/photo-1577720643272-265f09367456?w=800",
    featured: true,
    theme: "classical"
  },
  {
    id: 3,
    title: "Abstract Expressions",
    subtitle: "Beyond Form and Color",
    description: "A deep dive into the world of abstract art, from early pioneers to contemporary innovators.",
    curator: "Maria Santos",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    status: "upcoming",
    artworkCount: 52,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    featured: false,
    theme: "abstract"
  },
  {
    id: 4,
    title: "Cultural Crossroads",
    subtitle: "Art Without Borders",
    description: "Celebrating the rich tapestry of global artistic traditions and their modern interpretations.",
    curator: "Dr. Amara Okonkwo",
    startDate: "2024-04-15",
    endDate: "2024-08-30",
    status: "upcoming",
    artworkCount: 64,
    image: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800",
    featured: true,
    theme: "cultural"
  }
];

// Virtual Tour Themes
export const tourThemes = [
  {
    id: 'modern',
    name: 'Modern Art Journey',
    description: 'Experience the evolution of modern art from Impressionism to contemporary digital works.',
    duration: '45 minutes',
    artworkCount: 15,
    image: '/src/assets/pic1.jpg'
  },
  {
    id: 'classical',
    name: 'Classical Masters',
    description: 'Walk through centuries of classical art, from Renaissance to Baroque masterpieces.',
    duration: '60 minutes',
    artworkCount: 20,
    image: '/src/assets/pic2.jpg'
  },
  {
    id: 'abstract',
    name: 'Abstract Visions',
    description: 'Explore the world of abstract art and the artists who dared to break conventions.',
    duration: '35 minutes',
    artworkCount: 12,
    image: '/src/assets/pic3.jpg'
  },
  {
    id: 'cultural',
    name: 'Cultural Heritage',
    description: 'Discover art from diverse cultures around the world, celebrating global creativity.',
    duration: '50 minutes',
    artworkCount: 18,
    image: '/src/assets/pic1.jpg'
  }
];

// Categories
export const categories = [
  { id: 'all', name: 'All Artworks', icon: 'Grid' },
  { id: 'painting', name: 'Paintings', icon: 'Palette' },
  { id: 'digital', name: 'Digital Art', icon: 'Monitor' },
  { id: 'sculpture', name: 'Sculptures', icon: 'Box' },
  { id: 'photography', name: 'Photography', icon: 'Camera' },
  { id: 'nft', name: 'NFTs', icon: 'Hexagon' }
];
