package com.artium.gallery.repository;

import com.artium.gallery.entity.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByCategory(String category);
    List<Artwork> findByFeaturedTrue();
    List<Artwork> findByArtist_Id(Long artistId);
    List<Artwork> findByAvailableTrue();
    List<Artwork> findByTitleContainingIgnoreCase(String title);
    List<Artwork> findByArtistNameIgnoreCase(String artistName);
    List<Artwork> findByArtistNameContainingIgnoreCase(String artistName);
}
