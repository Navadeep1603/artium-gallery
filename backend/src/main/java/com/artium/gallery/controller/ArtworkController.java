package com.artium.gallery.controller;

import com.artium.gallery.entity.Artwork;
import com.artium.gallery.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
    public ResponseEntity<?> createArtwork(@RequestBody Artwork artwork) {
        try {
            // Log payload size for debugging large base64 uploads
            String imgData = artwork.getImage();
            int imgSize = imgData != null ? imgData.length() : 0;
            System.out.println("[CREATE ARTWORK] title=" + artwork.getTitle()
                + ", artistName=" + artwork.getArtistName()
                + ", artist=" + artwork.getArtist()
                + ", imageSize=" + imgSize + " chars"
                + ", isBase64=" + (imgData != null && imgData.startsWith("data:")));
            Artwork saved = artworkService.createArtwork(artwork);
            System.out.println("[CREATE ARTWORK] Success, id=" + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            // Log the full stack trace for debugging
            System.err.println("[CREATE ARTWORK ERROR] " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : e.getClass().getName());
            // Walk the cause chain for detailed diagnostics
            Throwable cause = e.getCause();
            StringBuilder causeChain = new StringBuilder();
            while (cause != null) {
                causeChain.append(cause.getClass().getSimpleName()).append(": ").append(cause.getMessage()).append(" -> ");
                cause = cause.getCause();
            }
            error.put("cause", causeChain.length() > 0 ? causeChain.toString() : "unknown");
            return ResponseEntity.status(500).body(error);
        }
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
