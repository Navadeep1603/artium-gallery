package com.artium.gallery.repository;

import com.artium.gallery.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser_Id(Long userId);
    Optional<CartItem> findByUser_IdAndArtwork_Id(Long userId, Long artworkId);
    void deleteByUser_IdAndArtwork_Id(Long userId, Long artworkId);
    void deleteByUser_Id(Long userId);
}
