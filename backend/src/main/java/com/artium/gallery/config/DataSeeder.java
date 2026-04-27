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
            System.out.println("Database initialization complete!");
            System.out.println("  Users:       " + userRepository.count());
            System.out.println("  Artists:     " + artistRepository.count());
            System.out.println("  Artworks:    " + artworkRepository.count());
            System.out.println("  Exhibitions: " + exhibitionRepository.count());
            System.out.println("  Categories:  " + categoryRepository.count());
            System.out.println("========================================");
        };
    }
}
