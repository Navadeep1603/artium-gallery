package com.artium.gallery.config;

import com.artium.gallery.entity.*;
import com.artium.gallery.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            ArtistRepository artistRepository,
            ArtworkRepository artworkRepository,
            ExhibitionRepository exhibitionRepository,
            CategoryRepository categoryRepository
    ) {
        return args -> {
            // ── Seed Users ──────────────────────────────────────────────
            if (userRepository.count() == 0) {
                System.out.println("Seeding users...");
                userRepository.saveAll(List.of(
                    new User("Admin User", "admin@gallery.com", "admin123", "admin",
                             "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"),
                    new User("Elena Rodriguez", "artist@gallery.com", "artist123", "artist",
                             "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"),
                    new User("John Doe", "visitor@gallery.com", "visitor123", "visitor",
                             "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"),
                    new User("Dr. Sarah Mitchell", "curator@gallery.com", "curator123", "curator",
                             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100")
                ));
                System.out.println("✓ 4 users seeded.");
            }

            // ── Seed Categories ─────────────────────────────────────────
            if (categoryRepository.count() == 0) {
                System.out.println("Seeding categories...");
                categoryRepository.saveAll(List.of(
                    new Category("All Artworks", "Grid"),
                    new Category("Paintings", "Palette"),
                    new Category("Digital Art", "Monitor"),
                    new Category("Sculptures", "Box"),
                    new Category("Photography", "Camera"),
                    new Category("NFTs", "Hexagon")
                ));
                System.out.println("✓ 6 categories seeded.");
            }

            // ── Seed Artists ────────────────────────────────────────────
            if (artistRepository.count() == 0) {
                System.out.println("Seeding artists...");
                List<Artist> artists = artistRepository.saveAll(List.of(
                    new Artist("Vincent Modern", "Digital Art",
                        "A visionary digital artist blending classical techniques with cutting-edge technology. Known for reimagining masterpieces for the digital age.",
                        "New York, USA", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                        24500, 48, true),
                    new Artist("Elena Rodriguez", "Traditional Painting",
                        "A master of light and color, Elena's works capture the essence of Mediterranean landscapes with breathtaking realism.",
                        "Barcelona, Spain", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
                        18900, 67, true),
                    new Artist("Marcus Chen", "Photography",
                        "Documentary photographer capturing the soul of cities across Asia. His work bridges Eastern philosophy with Western documentary tradition.",
                        "Tokyo, Japan", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
                        31200, 124, true),
                    new Artist("Sophie Laurent", "Sculpture & Mixed Media",
                        "French sculptor pushing the boundaries of form and material. Her work explores the intersection of classical technique and modern abstraction.",
                        "Paris, France", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
                        15600, 35, true),
                    new Artist("CryptoArtist_X", "NFT & Generative Art",
                        "Anonymous digital artist at the forefront of the Web3 art revolution. Creating algorithmic beauty through code.",
                        "Decentralized", "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=200",
                        89400, 256, true),
                    new Artist("Amara Okonkwo", "Textile & Contemporary African Art",
                        "Celebrating African heritage through contemporary textile art. Amara weaves stories of culture, identity, and tradition.",
                        "Lagos, Nigeria", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200",
                        12300, 42, false),
                    new Artist("Kenji Yamamoto", "Installation & Minimalism",
                        "Japanese installation artist creating meditative spaces that embody the principles of Zen philosophy and Wabi-sabi aesthetics.",
                        "Kyoto, Japan", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                        9800, 18, false)
                ));
                System.out.println("✓ 7 artists seeded.");

                // ── Seed Artworks ───────────────────────────────────────
                if (artworkRepository.count() == 0) {
                    System.out.println("Seeding artworks...");
                    Artist a1 = artists.get(0); // Vincent Modern
                    Artist a2 = artists.get(1); // Elena Rodriguez
                    Artist a3 = artists.get(2); // Marcus Chen
                    Artist a4 = artists.get(3); // Sophie Laurent
                    Artist a5 = artists.get(4); // CryptoArtist_X
                    Artist a6 = artists.get(5); // Amara Okonkwo
                    Artist a7 = artists.get(6); // Kenji Yamamoto

                    artworkRepository.saveAll(List.of(
                        new Artwork("Starry Night Reimagined", a1, "Vincent Modern", 2024, "Digital Art", "Post-Impressionism", "digital",
                            2500.0, "INR", true, true,
                            "A contemporary interpretation of Van Gogh's masterpiece, blending traditional swirling skies with modern digital techniques.",
                            "This piece pays homage to the Post-Impressionist movement while embracing 21st-century digital artistry.",
                            "New York, USA", "4000 x 3000 px",
                            "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800",
                            "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=400",
                            15420, 892, true),
                        new Artwork("Golden Serenity", a2, "Elena Rodriguez", 2023, "Oil on Canvas", "Contemporary Realism", "painting",
                            8500.0, "INR", true, true,
                            "A breathtaking landscape that captures the golden hour in the Mediterranean countryside.",
                            "Inspired by the rich tradition of European landscape painting.",
                            "Barcelona, Spain", "120 x 80 cm",
                            "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800",
                            "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
                            8930, 654, true),
                        new Artwork("Urban Symphony", a3, "Marcus Chen", 2024, "Photography", "Street Photography", "photography",
                            1200.0, "INR", true, false,
                            "A striking black and white capture of city life, revealing the poetry in everyday urban moments.",
                            "Part of a series documenting the rhythm of Asian megacities.",
                            "Tokyo, Japan", "60 x 40 cm",
                            "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
                            "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400",
                            5670, 423, false),
                        new Artwork("Eternal Form", a4, "Sophie Laurent", 2022, "Bronze Sculpture", "Abstract Modernism", "sculpture",
                            25000.0, "INR", true, true,
                            "A flowing bronze sculpture that captures the essence of human movement and emotion in abstract form.",
                            "Drawing from the rich tradition of French sculpture.",
                            "Paris, France", "180 x 60 x 60 cm",
                            "https://images.unsplash.com/photo-1544413660-299165566b1d?w=800",
                            "https://images.unsplash.com/photo-1544413660-299165566b1d?w=400",
                            12340, 978, true),
                        new Artwork("Digital Dreams #42", a5, "CryptoArtist_X", 2024, "NFT / Digital", "Generative Art", "nft",
                            15000.0, "INR", true, true,
                            "A generative artwork created through AI collaboration, exploring the boundaries between human creativity and machine learning.",
                            "Part of the emerging Web3 art movement.",
                            "Decentralized", "8000 x 8000 px",
                            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
                            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
                            28900, 2341, false),
                        new Artwork("Whispers of Autumn", a2, "Elena Rodriguez", 2023, "Watercolor", "Impressionism", "painting",
                            4200.0, "INR", true, false,
                            "Delicate watercolor capturing the fleeting beauty of autumn leaves dancing in the wind.",
                            "Inspired by Japanese watercolor traditions merged with European Impressionist techniques.",
                            "Barcelona, Spain", "60 x 45 cm",
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
                            6780, 534, true),
                        new Artwork("Neon Nights", a1, "Vincent Modern", 2024, "Digital Art", "Cyberpunk", "digital",
                            1800.0, "INR", true, false,
                            "A vibrant exploration of urban nightlife through the lens of cyberpunk aesthetics.",
                            "Rooted in the cyberpunk movement of the 1980s, reimagined for the digital age.",
                            "New York, USA", "5000 x 3500 px",
                            "https://images.unsplash.com/photo-1563089145-599997674d42?w=800",
                            "https://images.unsplash.com/photo-1563089145-599997674d42?w=400",
                            9450, 721, false),
                        new Artwork("Morning Mist", a3, "Marcus Chen", 2023, "Photography", "Landscape", "photography",
                            950.0, "INR", true, false,
                            "A serene mountain landscape shrouded in morning mist, capturing nature's quiet majesty.",
                            "Inspired by traditional Chinese landscape painting philosophy.",
                            "Huangshan, China", "80 x 50 cm",
                            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                            4560, 398, true),
                        new Artwork("Abstract Harmony", a4, "Sophie Laurent", 2024, "Mixed Media", "Abstract Expressionism", "painting",
                            12000.0, "INR", false, true,
                            "A bold exploration of color and form, creating visual music on canvas.",
                            "Continuing the legacy of Abstract Expressionism with contemporary mixed media techniques.",
                            "Paris, France", "150 x 150 cm",
                            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
                            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
                            18920, 1456, true),
                        new Artwork("Genesis Block", a5, "CryptoArtist_X", 2024, "NFT / Animated", "Crypto Art", "nft",
                            35000.0, "INR", true, false,
                            "An animated NFT celebrating the birth of blockchain technology and its impact on art.",
                            "A landmark piece in the crypto art movement.",
                            "Decentralized", "4000 x 4000 px",
                            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
                            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
                            34500, 2890, false),
                        new Artwork("Cultural Threads", a6, "Amara Okonkwo", 2023, "Textile Art", "Contemporary African", "painting",
                            6800.0, "INR", true, true,
                            "A stunning textile piece weaving together traditional African patterns with modern design sensibilities.",
                            "Celebrating the rich textile heritage of West Africa.",
                            "Lagos, Nigeria", "200 x 150 cm",
                            "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800",
                            "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=400",
                            7890, 623, true),
                        new Artwork("Zen Garden", a7, "Kenji Yamamoto", 2024, "Installation Art", "Minimalism", "sculpture",
                            35000.0, "INR", true, false,
                            "A meditative installation piece that brings the tranquility of Japanese zen gardens into gallery spaces.",
                            "Rooted in centuries of Japanese garden design philosophy and Wabi-sabi.",
                            "Kyoto, Japan", "Variable",
                            "https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=800",
                            "https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=400",
                            5670, 412, true),
                        new Artwork("Crimson Reverie", a2, "Elena Rodriguez", 2024, "Oil on Canvas", "Contemporary Realism", "painting",
                            9200.0, "INR", true, true,
                            "A richly layered oil painting exploring the interplay between warm crimson tones and cool shadows.",
                            "Influenced by the Spanish masters and the Baroque tradition of dramatic chiaroscuro.",
                            "Madrid, Spain", "140 x 100 cm",
                            "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800",
                            "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400",
                            11240, 845, true),
                        new Artwork("Pop Culture Icon", a1, "Vincent Modern", 2024, "Digital Art", "Pop Art", "digital",
                            3200.0, "INR", true, false,
                            "A bold, vibrant digital piece inspired by the Pop Art movement.",
                            "A direct descendant of Warhol and Lichtenstein.",
                            "Los Angeles, USA", "6000 x 4000 px",
                            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
                            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
                            13670, 1102, false),
                        new Artwork("Solitude at Dusk", a3, "Marcus Chen", 2024, "Photography", "Fine Art Photography", "photography",
                            1800.0, "INR", true, true,
                            "A melancholic yet beautiful photograph of a lone figure silhouetted against a burning sunset.",
                            "Explores the Romantic tradition of solitary figures in nature.",
                            "Bali, Indonesia", "100 x 70 cm",
                            "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
                            "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400",
                            8920, 756, true),
                        new Artwork("Marble Whisper", a4, "Sophie Laurent", 2023, "Marble Sculpture", "Neoclassical", "sculpture",
                            42000.0, "INR", true, true,
                            "A stunning white marble sculpture depicting hands reaching towards each other.",
                            "Inspired by Bernini's mastery of marble and Canova's neoclassical elegance.",
                            "Carrara, Italy", "90 x 45 x 40 cm",
                            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
                            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400",
                            15800, 1234, true),
                        new Artwork("Pixel Cosmos", a5, "CryptoArtist_X", 2025, "NFT / Generative", "Glitch Art", "nft",
                            22000.0, "INR", true, false,
                            "A mesmerizing generative NFT creating infinite variations of cosmic landscapes.",
                            "Part of the glitch art movement celebrating digital imperfections.",
                            "Decentralized", "6000 x 6000 px",
                            "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800",
                            "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400",
                            22400, 1890, false),
                        new Artwork("Ancestral Masks", a6, "Amara Okonkwo", 2024, "Mixed Media on Wood", "Afrofuturism", "painting",
                            7500.0, "INR", true, false,
                            "A powerful mixed-media piece combining traditional African mask imagery with futuristic elements.",
                            "Draws from the rich mask-making traditions of Benin and Yoruba cultures.",
                            "Accra, Ghana", "120 x 90 cm",
                            "https://images.unsplash.com/photo-1577720643272-265f09367456?w=800",
                            "https://images.unsplash.com/photo-1577720643272-265f09367456?w=400",
                            6540, 489, true),
                        new Artwork("Floating Dreams", a7, "Kenji Yamamoto", 2024, "Glass & Light Installation", "Contemporary Installation", "sculpture",
                            28000.0, "INR", true, false,
                            "An ethereal installation of suspended glass orbs illuminated from within.",
                            "Combines Japanese lantern aesthetics with contemporary light art.",
                            "Tokyo, Japan", "300 x 300 x 250 cm",
                            "https://images.unsplash.com/photo-1507643179773-3e975d7ac515?w=800",
                            "https://images.unsplash.com/photo-1507643179773-3e975d7ac515?w=400",
                            9870, 734, true),
                        new Artwork("Venetian Twilight", a2, "Elena Rodriguez", 2024, "Oil on Linen", "Romanticism", "painting",
                            11500.0, "INR", false, true,
                            "A romantic, atmospheric painting of Venice at twilight.",
                            "Inspired by Turner's luminous waterscapes and the Venetian vedute tradition.",
                            "Venice, Italy", "160 x 110 cm",
                            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
                            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                            14560, 1178, true),
                        new Artwork("Fractal Garden", a1, "Vincent Modern", 2025, "Digital Art", "Surrealism", "digital",
                            2900.0, "INR", true, false,
                            "A surrealist digital landscape where organic flora morphs into mathematical fractals.",
                            "Bridges Dali's surrealist dreamscapes and modern generative art.",
                            "Berlin, Germany", "7000 x 5000 px",
                            "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800",
                            "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
                            7890, 612, false),
                        new Artwork("Street Canvas", a3, "Marcus Chen", 2024, "Photography", "Documentary", "photography",
                            1500.0, "INR", true, false,
                            "A vivid documentation of street art in Sao Paulo's Vila Madalena.",
                            "Part of a global series on street art as democratized expression.",
                            "Sao Paulo, Brazil", "90 x 60 cm",
                            "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800",
                            "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400",
                            6230, 478, false),
                        new Artwork("Chromatic Waves", a4, "Sophie Laurent", 2025, "Acrylic Pour on Canvas", "Color Field", "painting",
                            5600.0, "INR", true, false,
                            "A mesmerizing acrylic pour painting where vivid colors flow like ocean currents.",
                            "Rooted in the Color Field painting tradition of Rothko and Helen Frankenthaler.",
                            "Paris, France", "120 x 120 cm",
                            "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800",
                            "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=400",
                            5430, 398, true),
                        new Artwork("Code Poetry", a5, "CryptoArtist_X", 2025, "NFT / Interactive", "Data Art", "nft",
                            75000.0, "INR", true, true,
                            "An interactive NFT transforming live blockchain data into evolving visual poetry.",
                            "Pioneering the concept of living art in the Web3 space.",
                            "Decentralized", "Infinite / Responsive",
                            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
                            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
                            41200, 3560, false),
                        new Artwork("Savanna Sunset", a6, "Amara Okonkwo", 2024, "Acrylic on Canvas", "Contemporary African", "painting",
                            5400.0, "INR", true, false,
                            "A vibrant depiction of the African savanna at golden hour.",
                            "Celebrates the tradition of African landscape art.",
                            "Nairobi, Kenya", "100 x 80 cm",
                            "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
                            "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400",
                            8340, 621, true),
                        new Artwork("Botanical Study VII", a3, "Marcus Chen", 2025, "Photography", "Macro Photography", "photography",
                            2200.0, "INR", true, true,
                            "An extreme macro photograph revealing fractal-like structures in a flower petal.",
                            "Continues the tradition of botanical illustration by Maria Sibylla Merian.",
                            "Kew Gardens, UK", "70 x 70 cm",
                            "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800",
                            "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400",
                            7650, 589, true),
                        new Artwork("Kinetic Pulse", a7, "Kenji Yamamoto", 2025, "Kinetic Sculpture", "Kinetic Art", "sculpture",
                            18000.0, "INR", true, false,
                            "A mesmerizing kinetic sculpture of interlocking metal rings that rotate at different speeds.",
                            "Inspired by Alexander Calder's mobiles and Naum Gabo's constructivism.",
                            "Osaka, Japan", "120 x 120 x 80 cm",
                            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
                            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
                            4320, 345, false),
                        new Artwork("Blue Period Echoes", a2, "Elena Rodriguez", 2025, "Oil on Canvas", "Neo-Expressionism", "painting",
                            14000.0, "INR", true, false,
                            "A deeply emotional painting in shades of indigo and cobalt.",
                            "A contemporary tribute to Picasso's Blue Period.",
                            "Barcelona, Spain", "180 x 130 cm",
                            "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800",
                            "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
                            10230, 812, true),
                        new Artwork("Neon Samurai", a1, "Vincent Modern", 2025, "Digital Art", "Neo-Tokyo", "digital",
                            4100.0, "INR", true, true,
                            "A striking digital artwork fusing traditional Japanese samurai imagery with neon-lit cyberpunk cityscapes.",
                            "Bridges ukiyo-e woodblock prints with anime-inspired futurism.",
                            "Tokyo, Japan", "8000 x 5000 px",
                            "https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?w=800",
                            "https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?w=400",
                            19800, 1567, false),
                        new Artwork("Desert Mirage", a3, "Marcus Chen", 2024, "Photography", "Landscape", "photography",
                            1650.0, "INR", true, false,
                            "An otherworldly photograph of sand dunes in the Sahara.",
                            "Follows great landscape photographers like Ansel Adams.",
                            "Merzouga, Morocco", "100 x 60 cm",
                            "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
                            "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400",
                            5890, 432, true),
                        new Artwork("Fragments of Memory", a4, "Sophie Laurent", 2025, "Ceramic & Gold Leaf", "Kintsugi-inspired", "sculpture",
                            9800.0, "INR", true, false,
                            "A series of deliberately broken and reassembled ceramic vessels repaired with gold.",
                            "Rooted in the Japanese art of Kintsugi.",
                            "Paris, France", "Variable, tallest 45 cm",
                            "https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=800",
                            "https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=400",
                            6780, 523, true),
                        new Artwork("Quantum Garden", a5, "CryptoArtist_X", 2025, "NFT / AI-Assisted", "Bio-Digital", "nft",
                            50000.0, "INR", true, false,
                            "An AI-assisted NFT visualizing quantum physics principles as a garden of impossible flowers.",
                            "At the cutting edge of AI-human creative collaboration.",
                            "Decentralized", "10000 x 10000 px",
                            "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
                            "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400",
                            27600, 2145, false)
                    ));
                    System.out.println("✓ 32 artworks seeded.");
                }
            }

            // ── Seed Exhibitions ────────────────────────────────────────
            if (exhibitionRepository.count() == 0) {
                System.out.println("Seeding exhibitions...");
                exhibitionRepository.saveAll(List.of(
                    new Exhibition("Modern Masters", "Contemporary Visions",
                        "A groundbreaking exhibition featuring the most influential contemporary artists of our time.",
                        "Dr. Sarah Mitchell", "2024-01-15", "2024-04-30", "current", 45,
                        "https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?w=800", true, "modern"),
                    new Exhibition("Classical Reimagined", "Old Masters, New Perspectives",
                        "Exploring how classical art continues to inspire and influence contemporary creation.",
                        "Prof. James Harrison", "2024-02-01", "2024-05-15", "current", 38,
                        "https://images.unsplash.com/photo-1577720643272-265f09367456?w=800", true, "classical"),
                    new Exhibition("Abstract Expressions", "Beyond Form and Color",
                        "A deep dive into the world of abstract art, from early pioneers to contemporary innovators.",
                        "Maria Santos", "2024-03-01", "2024-06-30", "upcoming", 52,
                        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800", false, "abstract"),
                    new Exhibition("Cultural Crossroads", "Art Without Borders",
                        "Celebrating the rich tapestry of global artistic traditions and their modern interpretations.",
                        "Dr. Amara Okonkwo", "2024-04-15", "2024-08-30", "upcoming", 64,
                        "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800", true, "cultural")
                ));
                System.out.println("✓ 4 exhibitions seeded.");
            }

            System.out.println("========================================");
            System.out.println("Database seeding complete!");
            System.out.println("  Users:       " + userRepository.count());
            System.out.println("  Artists:     " + artistRepository.count());
            System.out.println("  Artworks:    " + artworkRepository.count());
            System.out.println("  Exhibitions: " + exhibitionRepository.count());
            System.out.println("  Categories:  " + categoryRepository.count());
            System.out.println("========================================");
        };
    }
}
