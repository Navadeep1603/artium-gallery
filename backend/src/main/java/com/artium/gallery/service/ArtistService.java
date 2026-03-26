package com.artium.gallery.service;

import com.artium.gallery.entity.Artist;
import com.artium.gallery.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    public Optional<Artist> getArtistById(Long id) {
        return artistRepository.findById(id);
    }

    public List<Artist> getFeaturedArtists() {
        return artistRepository.findByFeaturedTrue();
    }

    public List<Artist> searchArtists(String name) {
        return artistRepository.findByNameContainingIgnoreCase(name);
    }

    public Artist createArtist(Artist artist) {
        return artistRepository.save(artist);
    }

    public Artist updateArtist(Long id, Artist details) {
        return artistRepository.findById(id).map(artist -> {
            artist.setName(details.getName());
            artist.setSpecialty(details.getSpecialty());
            artist.setBio(details.getBio());
            artist.setLocation(details.getLocation());
            artist.setAvatar(details.getAvatar());
            artist.setFollowers(details.getFollowers());
            artist.setArtworksCount(details.getArtworksCount());
            artist.setFeatured(details.getFeatured());
            return artistRepository.save(artist);
        }).orElseThrow(() -> new RuntimeException("Artist not found with id " + id));
    }

    public void deleteArtist(Long id) {
        artistRepository.deleteById(id);
    }
}
