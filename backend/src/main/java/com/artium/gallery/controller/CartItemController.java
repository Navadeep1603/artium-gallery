package com.artium.gallery.controller;

import com.artium.gallery.entity.CartItem;
import com.artium.gallery.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartItemService.getCartByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Long> body) {
        try {
            CartItem item = cartItemService.addToCart(body.get("userId"), body.get("artworkId"));
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}/{artworkId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @PathVariable Long artworkId) {
        cartItemService.removeFromCart(userId, artworkId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartItemService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
