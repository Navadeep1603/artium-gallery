package com.artium.gallery.controller;

import com.artium.gallery.entity.Artwork;
import com.artium.gallery.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    @GetMapping
    public List<Artwork> getAllArtworks() {
        return artworkService.getAllArtworks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        return artworkService.getArtworkById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public List<Artwork> getByCategory(@PathVariable String category) {
        return artworkService.getArtworksByCategory(category);
    }

    @GetMapping("/featured")
    public List<Artwork> getFeaturedArtworks() {
        return artworkService.getFeaturedArtworks();
    }

    @GetMapping("/artist/{artistId}")
    public List<Artwork> getByArtist(@PathVariable Long artistId) {
        return artworkService.getArtworksByArtist(artistId);
    }

    @GetMapping("/available")
    public List<Artwork> getAvailable() {
        return artworkService.getAvailableArtworks();
    }

    @GetMapping("/by-artist-name")
    public List<Artwork> getByArtistName(@RequestParam String name) {
        return artworkService.getArtworksByArtistName(name);
    }

    @GetMapping("/search")
    public List<Artwork> searchArtworks(@RequestParam String title) {
        return artworkService.searchArtworks(title);
    }

    @PostMapping
    public Artwork createArtwork(@RequestBody Artwork artwork) {
        return artworkService.createArtwork(artwork);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @RequestBody Artwork artwork) {
        try {
            return ResponseEntity.ok(artworkService.updateArtwork(id, artwork));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteArtwork(id);
        return ResponseEntity.noContent().build();
    }
}
