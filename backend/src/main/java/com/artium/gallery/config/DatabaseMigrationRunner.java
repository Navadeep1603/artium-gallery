package com.artium.gallery.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Runs database migrations on startup.
 * This fixes the artist_id NOT NULL constraint so self-registered artists
 * (who don't have a row in the artists table) can upload artworks.
 */
@Component
@Order(1)
public class DatabaseMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            // Make artist_id nullable so artworks can be saved without a foreign key artist
            jdbcTemplate.execute(
                "ALTER TABLE `artworks` MODIFY COLUMN `artist_id` BIGINT NULL"
            );
            System.out.println("[MIGRATION] artist_id column made nullable successfully.");
        } catch (Exception e) {
            // Column is already nullable or table doesn't exist yet — safe to ignore
            System.out.println("[MIGRATION] artist_id migration skipped: " + e.getMessage());
        }

        // Widen image and thumbnail columns to LONGTEXT for base64 data-URL uploads
        try {
            jdbcTemplate.execute(
                "ALTER TABLE `artworks` MODIFY COLUMN `image` LONGTEXT"
            );
            jdbcTemplate.execute(
                "ALTER TABLE `artworks` MODIFY COLUMN `thumbnail` LONGTEXT"
            );
            System.out.println("[MIGRATION] image/thumbnail columns widened to LONGTEXT.");
        } catch (Exception e) {
            System.out.println("[MIGRATION] image/thumbnail migration skipped: " + e.getMessage());
        }

        // Log max_allowed_packet to diagnose large base64 upload failures
        try {
            var result = jdbcTemplate.queryForMap("SHOW VARIABLES LIKE 'max_allowed_packet'");
            long currentPacket = Long.parseLong(result.get("Value").toString());
            System.out.println("[MIGRATION] MySQL max_allowed_packet = " + currentPacket + " bytes (" + (currentPacket / 1024 / 1024) + " MB)");
            
            // Try to increase if it's less than 16MB
            if (currentPacket < 16 * 1024 * 1024) {
                try {
                    jdbcTemplate.execute("SET GLOBAL max_allowed_packet = 16777216"); // 16MB
                    System.out.println("[MIGRATION] max_allowed_packet increased to 16MB.");
                } catch (Exception e2) {
                    System.out.println("[MIGRATION] Could not increase max_allowed_packet (need SUPER privilege): " + e2.getMessage());
                }
            }
        } catch (Exception e) {
            System.out.println("[MIGRATION] Could not check max_allowed_packet: " + e.getMessage());
        }
    }
}
