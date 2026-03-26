package com.artium.gallery.service;

import com.artium.gallery.entity.Artwork;
import com.artium.gallery.entity.User;
import com.artium.gallery.entity.WishlistItem;
import com.artium.gallery.repository.ArtworkRepository;
import com.artium.gallery.repository.UserRepository;
import com.artium.gallery.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistItemService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    public List<WishlistItem> getWishlistByUserId(Long userId) {
        return wishlistItemRepository.findByUser_Id(userId);
    }

    public WishlistItem addToWishlist(Long userId, Long artworkId) {
        if (wishlistItemRepository.findByUser_IdAndArtwork_Id(userId, artworkId).isPresent()) {
            throw new RuntimeException("Artwork already in wishlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        return wishlistItemRepository.save(new WishlistItem(user, artwork));
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long artworkId) {
        wishlistItemRepository.deleteByUser_IdAndArtwork_Id(userId, artworkId);
    }

    public boolean isInWishlist(Long userId, Long artworkId) {
        return wishlistItemRepository.findByUser_IdAndArtwork_Id(userId, artworkId).isPresent();
    }
}
