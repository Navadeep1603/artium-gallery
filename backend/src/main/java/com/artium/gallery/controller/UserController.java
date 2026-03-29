package com.artium.gallery.controller;

import com.artium.gallery.entity.User;
import com.artium.gallery.service.UserService;
import com.artium.gallery.service.OtpService;
import com.artium.gallery.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return userService.login(email, password)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("user", user);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("error", "Invalid email or password");
                    return ResponseEntity.ok(response);
                });
    }

    // POST signup
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> userData) {
        try {
            User user = userService.signup(
                    userData.get("name"),
                    userData.get("email"),
                    userData.get("password"),
                    userData.getOrDefault("role", "visitor")
            );
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // POST send OTP
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        String email = body.get("email");

        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            response.put("success", false);
            response.put("error", "Invalid email address");
            return ResponseEntity.ok(response);
        }

        try {
            String otp = otpService.generateOtp(email);
            emailService.sendOtpEmail(email, otp);
            response.put("success", true);
            response.put("message", "OTP sent to " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to send OTP. Please try again.");
            return ResponseEntity.ok(response);
        }
    }

    // POST verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            response.put("success", false);
            response.put("error", "Email and OTP are required");
            return ResponseEntity.ok(response);
        }

        String result = otpService.validateOtp(email, otp);

        switch (result) {
            case "valid":
                response.put("success", true);
                response.put("message", "Email verified successfully");
                break;
            case "expired":
                response.put("success", false);
                response.put("error", "OTP has expired. Please resend.");
                break;
            default:
                response.put("success", false);
                response.put("error", "Invalid OTP. Please try again.");
                break;
        }

        return ResponseEntity.ok(response);
    }

    // POST create new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // PUT update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
