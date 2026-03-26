package com.artium.gallery.service;

import com.artium.gallery.entity.User;
import com.artium.gallery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // Signup: create a new user with defaults and send welcome email
    public User signup(String name, String email, String password, String role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User(name, email, password, role);
        user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100");
        user.setJoined(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        User savedUser = userRepository.save(user);

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(email, name);

        return savedUser;
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
}
