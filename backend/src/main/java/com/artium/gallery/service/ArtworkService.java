package com.artium.gallery.service;

import com.artium.gallery.entity.Artist;
import com.artium.gallery.entity.Artwork;
import com.artium.gallery.repository.ArtistRepository;
import com.artium.gallery.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.Optional;

@Service
public class ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<Artwork> getAllArtworks() {
        return artworkRepository.findAll();
    }

    public Optional<Artwork> getArtworkById(Long id) {
        return artworkRepository.findById(id);
    }

    public List<Artwork> getArtworksByCategory(String category) {
        return artworkRepository.findByCategory(category);
    }

    public List<Artwork> getFeaturedArtworks() {
        return artworkRepository.findByFeaturedTrue();
    }

    public List<Artwork> getArtworksByArtist(Long artistId) {
        return artworkRepository.findByArtist_Id(artistId);
    }

    public List<Artwork> getArtworksByArtistName(String artistName) {
        return artworkRepository.findByArtistNameIgnoreCase(artistName);
    }

    public List<Artwork> getAvailableArtworks() {
        return artworkRepository.findByAvailableTrue();
    }

    public List<Artwork> searchArtworks(String title) {
        return artworkRepository.findByTitleContainingIgnoreCase(title);
    }

    public Artwork createArtwork(Artwork artwork) {
        // If no Artist FK is provided, auto-find or auto-create an Artist profile
        // This guarantees artist_id is NEVER NULL regardless of DB constraints
        if (artwork.getArtist() == null) {
            String artistName = artwork.getArtistName();
            if (artistName == null || artistName.isBlank()) {
                artistName = "Unknown Artist";
            }
            final String finalName = artistName;
            Artist artist = artistRepository.findByNameIgnoreCase(finalName)
                .orElseGet(() -> {
                    Artist newArtist = new Artist();
                    newArtist.setName(finalName);
                    newArtist.setSpecialty(artwork.getMedium() != null ? artwork.getMedium() : "Contemporary Art");
                    newArtist.setBio("Artist on Artium Gallery");
                    newArtist.setLocation(artwork.getOrigin() != null ? artwork.getOrigin() : "India");
                    newArtist.setAvatar("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200");
                    newArtist.setFollowers(0);
                    newArtist.setArtworksCount(0);
                    newArtist.setFeatured(false);
                    System.out.println("[ARTIST AUTO-CREATE] Creating artist profile for: " + finalName);
                    return artistRepository.save(newArtist);
                });
            artwork.setArtist(artist);
            artwork.setArtistName(artist.getName());
            System.out.println("[ARTWORK SAVE] Linked to artist id=" + artist.getId() + " name=" + artist.getName());
        }
        return artworkRepository.save(artwork);
    }

    public Artwork updateArtwork(Long id, Artwork details) {
        return artworkRepository.findById(id).map(artwork -> {
            artwork.setTitle(details.getTitle());
            artwork.setArtist(details.getArtist());
            artwork.setArtistName(details.getArtistName());
            artwork.setYear(details.getYear());
            artwork.setMedium(details.getMedium());
            artwork.setStyle(details.getStyle());
            artwork.setCategory(details.getCategory());
            artwork.setPrice(details.getPrice());
            artwork.setCurrency(details.getCurrency());
            artwork.setAvailable(details.getAvailable());
            artwork.setFeatured(details.getFeatured());
            artwork.setDescription(details.getDescription());
            artwork.setCulturalHistory(details.getCulturalHistory());
            artwork.setOrigin(details.getOrigin());
            artwork.setDimensions(details.getDimensions());
            artwork.setImage(details.getImage());
            artwork.setThumbnail(details.getThumbnail());
            artwork.setViews(details.getViews());
            artwork.setLikes(details.getLikes());
            artwork.setAudioNarration(details.getAudioNarration());
            return artworkRepository.save(artwork);
        }).orElseThrow(() -> new RuntimeException("Artwork not found with id " + id));
    }

    @Transactional
    public void deleteArtwork(Long id) {
        try {
            // First delete any references to this artwork to avoid foreign key SQL integrity constraint violations
            // Using Native Queries instead of JPQL to strictly bypass Hibernate join limitations on DELETE
            entityManager.createNativeQuery("DELETE FROM cart_items WHERE artwork_id = :id").setParameter("id", id).executeUpdate();
            entityManager.createNativeQuery("DELETE FROM wishlist_items WHERE artwork_id = :id").setParameter("id", id).executeUpdate();
            entityManager.createNativeQuery("DELETE FROM order_items WHERE artwork_id = :id").setParameter("id", id).executeUpdate();
            
            // Finally, delete the artwork itself
            artworkRepository.deleteById(id);
            System.out.println("[DELETE SUCCESS] Artwork " + id + " has been completely deleted.");
        } catch (Exception e) {
            System.err.println("[DELETE FAILED] Failed to delete artwork " + id + ": " + e.getMessage());
            throw e; // Rethrow to let the controller handle logging and return a 500
        }
    }
}
