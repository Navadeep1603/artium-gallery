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
                    response.put("mustChangePassword", user.isMustChangePassword());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("error", "Invalid email or password");
                    return ResponseEntity.ok(response);
                });
    }

    // POST signup — always creates a VISITOR account
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> userData) {
        try {
            User user = userService.signup(
                    userData.get("name"),
                    userData.get("email"),
                    userData.get("password")
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

    // POST subscribe — Artist/Curator access request (sends email to admin)
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, String> data) {
        Map<String, Object> response = new HashMap<>();
        String email = data.get("email");
        String name = data.getOrDefault("name", "");
        String role = data.getOrDefault("role", "artist");
        String gender = data.getOrDefault("gender", "");

        if (email == null || email.isBlank()) {
            response.put("success", false);
            response.put("error", "Email is required");
            return ResponseEntity.ok(response);
        }

        // Fire email asynchronously — respond immediately
        emailService.sendSubscribeNotification(name, email, role, gender);

        response.put("success", true);
        response.put("message", "Your request has been submitted! We'll review it and get back to you.");
        return ResponseEntity.ok(response);
    }

    // POST admin create Artist/Curator account
    @PostMapping("/admin/create-account")
    public ResponseEntity<Map<String, Object>> adminCreateAccount(@RequestBody Map<String, String> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.createArtistCuratorAccount(
                    data.get("name"),
                    data.get("email"),
                    data.get("role")
            );
            response.put("success", true);
            response.put("user", user);
            response.put("message", "Account created and credentials sent to " + data.get("email"));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // POST change password
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long userId = Long.valueOf(data.get("userId").toString());
            String oldPassword = (String) data.get("oldPassword");
            String newPassword = (String) data.get("newPassword");

            User user = userService.changePassword(userId, oldPassword, newPassword);
            response.put("success", true);
            response.put("user", user);
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // POST reset password via OTP flow (no old password — OTP already verified on frontend)
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = body.get("email");
            String newPassword = body.get("newPassword");

            if (email == null || email.isBlank() || newPassword == null || newPassword.isBlank()) {
                response.put("success", false);
                response.put("error", "Email and new password are required");
                return ResponseEntity.ok(response);
            }

            userService.resetPassword(email, newPassword);
            response.put("success", true);
            response.put("message", "Password reset successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
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
