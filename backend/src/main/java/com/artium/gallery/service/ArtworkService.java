package com.artium.gallery.service;

import com.artium.gallery.entity.Artwork;
import com.artium.gallery.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Service
public class ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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
        // If no artist FK (self-registered artist upload), use native SQL to bypass NOT NULL constraint
        if (artwork.getArtist() == null) {
            String sql = "INSERT INTO `artworks` (`title`, `artist_name`, `year`, `medium`, `style`," +
                " `category`, `price`, `currency`, `available`, `featured`, `description`," +
                " `cultural_history`, `origin`, `dimensions`, `image`, `thumbnail`," +
                " `views`, `likes`, `audio_narration`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(con -> {
                PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, artwork.getTitle());
                ps.setString(2, artwork.getArtistName());
                ps.setObject(3, artwork.getYear());
                ps.setString(4, artwork.getMedium());
                ps.setString(5, artwork.getStyle());
                ps.setString(6, artwork.getCategory());
                ps.setObject(7, artwork.getPrice());
                ps.setString(8, artwork.getCurrency() != null ? artwork.getCurrency() : "INR");
                ps.setBoolean(9, artwork.getAvailable() != null ? artwork.getAvailable() : true);
                ps.setBoolean(10, artwork.getFeatured() != null ? artwork.getFeatured() : false);
                ps.setString(11, artwork.getDescription());
                ps.setString(12, artwork.getCulturalHistory());
                ps.setString(13, artwork.getOrigin());
                ps.setString(14, artwork.getDimensions());
                ps.setString(15, artwork.getImage());
                ps.setString(16, artwork.getThumbnail());
                ps.setInt(17, artwork.getViews() != null ? artwork.getViews() : 0);
                ps.setInt(18, artwork.getLikes() != null ? artwork.getLikes() : 0);
                ps.setBoolean(19, artwork.getAudioNarration() != null ? artwork.getAudioNarration() : false);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            Long generatedId = (key != null) ? key.longValue() : null;
            if (generatedId != null) {
                return artworkRepository.findById(generatedId).orElse(artwork);
            }
            return artwork;
        }
        // For demo artists with a valid artist FK, use normal JPA save
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
