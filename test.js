const artworks = [
    ...Array.from({ length: 32 }, (_, i) => ({ id: i + 1, title: 'Test', price: 1000, featured: true, views: 100, year: 2020, category: 'painting', likes: 50 })),
    {
        title: "Test New",
        artist: "Elena Rodriguez",
        artistId: 2,
        year: 2024,
        medium: "Web Component",
        style: "Contemporary",
        category: "painting",
        price: 15000,
        currency: "USD",
        description: "Test",
        culturalHistory: undefined,
        origin: "Artist Studio",
        dimensions: "Variable",
        image: "/src/assets/pic3.jpg",
        thumbnail: "/src/assets/pic3.jpg",
        id: 33,
        featured: false,
        available: true,
        views: 0,
        likes: 0
    }
];

try {
    const filtered = artworks.filter(a => a.category === 'all' || true);
    const sorted = [...filtered].sort((a, b) => b.featured - a.featured);
    console.log('Sort featured success:', sorted.length);
    const sorted2 = [...filtered].sort((a, b) => b.price - a.price);
    console.log('Sort price success:', sorted2.length);

    for (const artwork of sorted) {
        if (typeof artwork.views !== 'number') { throw new Error('views not number ' + typeof artwork.views); }
        const x = artwork.views.toLocaleString();
        if (typeof artwork.likes !== 'number') { throw new Error('likes not number ' + typeof artwork.likes); }
        const y = artwork.likes.toLocaleString();
        const z = artwork.price.toLocaleString();
        const name = artwork.title.toUpperCase();
        const u = artwork.category;
    }
    console.log('All formats passed');
} catch (err) {
    console.error('CRASH:', err.message);
}
