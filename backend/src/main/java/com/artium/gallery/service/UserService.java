package com.artium.gallery.service;

import com.artium.gallery.entity.User;
import com.artium.gallery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    private static final SecureRandom RANDOM = new SecureRandom();

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Login: find by email and verify password
    public Optional<User> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                if ("deactivated".equals(user.getStatus())) {
                    return Optional.empty(); // Account deactivated
                }
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    // Signup: create a new VISITOR user (role is always forced to "visitor")
    public User signup(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        // Always force role to visitor for public signup
        User user = new User(name, email, password, "visitor");
        user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100");
        user.setJoined(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        user.setMustChangePassword(false);
        User savedUser = userRepository.save(user);

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(email, name);

        return savedUser;
    }

    // Admin: create Artist/Curator account with a generated temporary password
    public User createArtistCuratorAccount(String name, String email, String role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Validate role
        if (!"artist".equalsIgnoreCase(role) && !"curator".equalsIgnoreCase(role)) {
            throw new RuntimeException("Role must be 'artist' or 'curator'");
        }

        String tempPassword = generateRandomPassword(12);
        User user = new User(name, email, tempPassword, role.toLowerCase());
        user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100");
        user.setJoined(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        user.setMustChangePassword(true);
        User savedUser = userRepository.save(user);

        // Send credentials email
        emailService.sendCredentialsEmail(email, name, tempPassword);

        return savedUser;
    }

    // Change password (for first-login forced change or voluntary change)
    public User changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(newPassword);
        user.setMustChangePassword(false);
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            user.setStatus(userDetails.getStatus());
            user.setAvatar(userDetails.getAvatar());
            user.setJoined(userDetails.getJoined());
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(userDetails.getPassword());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private String generateRandomPassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}
