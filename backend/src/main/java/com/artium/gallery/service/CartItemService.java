package com.artium.gallery.service;

import com.artium.gallery.entity.Artwork;
import com.artium.gallery.entity.CartItem;
import com.artium.gallery.entity.User;
import com.artium.gallery.repository.ArtworkRepository;
import com.artium.gallery.repository.CartItemRepository;
import com.artium.gallery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    public List<CartItem> getCartByUserId(Long userId) {
        return cartItemRepository.findByUser_Id(userId);
    }

    public CartItem addToCart(Long userId, Long artworkId) {
        // Check if already in cart
        if (cartItemRepository.findByUser_IdAndArtwork_Id(userId, artworkId).isPresent()) {
            throw new RuntimeException("Artwork already in cart");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        return cartItemRepository.save(new CartItem(user, artwork));
    }

    @Transactional
    public void removeFromCart(Long userId, Long artworkId) {
        cartItemRepository.deleteByUser_IdAndArtwork_Id(userId, artworkId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUser_Id(userId);
    }
}
