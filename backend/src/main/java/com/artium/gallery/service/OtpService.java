package com.artium.gallery.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final long OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    private final SecureRandom random = new SecureRandom();

    // email -> OtpEntry
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private record OtpEntry(String otp, long expiresAt) {}

    /**
     * Generate a 6-digit OTP for the given email and store it.
     * Any previous OTP for this email is overwritten.
     */
    public String generateOtp(String email) {
        // Clean up expired entries
        otpStore.entrySet().removeIf(e -> e.getValue().expiresAt() < System.currentTimeMillis());

        String otp = String.format("%06d", random.nextInt(1_000_000));
        otpStore.put(email.toLowerCase(), new OtpEntry(otp, System.currentTimeMillis() + OTP_EXPIRY_MS));
        return otp;
    }

    /**
     * Validate the OTP for the given email.
     * Returns "valid", "expired", or "invalid".
     */
    public String validateOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email.toLowerCase());

        if (entry == null) {
            return "invalid";
        }

        if (entry.expiresAt() < System.currentTimeMillis()) {
            otpStore.remove(email.toLowerCase());
            return "expired";
        }

        if (entry.otp().equals(otp)) {
            otpStore.remove(email.toLowerCase()); // one-time use
            return "valid";
        }

        return "invalid";
    }
}
