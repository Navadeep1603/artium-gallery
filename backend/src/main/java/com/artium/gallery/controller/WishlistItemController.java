package com.artium.gallery.controller;

import com.artium.gallery.entity.WishlistItem;
import com.artium.gallery.service.WishlistItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistItemController {

    @Autowired
    private WishlistItemService wishlistItemService;

    @GetMapping("/{userId}")
    public List<WishlistItem> getWishlist(@PathVariable Long userId) {
        return wishlistItemService.getWishlistByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<WishlistItem> addToWishlist(@RequestBody Map<String, Long> body) {
        try {
            WishlistItem item = wishlistItemService.addToWishlist(body.get("userId"), body.get("artworkId"));
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}/{artworkId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long userId, @PathVariable Long artworkId) {
        wishlistItemService.removeFromWishlist(userId, artworkId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/{artworkId}/check")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(@PathVariable Long userId, @PathVariable Long artworkId) {
        boolean inWishlist = wishlistItemService.isInWishlist(userId, artworkId);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }
}
