package com.artium.gallery.repository;

import com.artium.gallery.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser_Id(Long userId);
    Optional<WishlistItem> findByUser_IdAndArtwork_Id(Long userId, Long artworkId);
    void deleteByUser_IdAndArtwork_Id(Long userId, Long artworkId);
}
