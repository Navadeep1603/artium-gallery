package com.artium.gallery.service;

import com.artium.gallery.entity.Artwork;
import com.artium.gallery.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepository;

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

    public void deleteArtwork(Long id) {
        artworkRepository.deleteById(id);
    }
}
