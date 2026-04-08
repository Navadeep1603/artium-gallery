package com.artium.gallery.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Runs database migrations on startup.
 * Ensures the image/thumbnail columns are wide enough for base64 data-URLs.
 */
@Component
@Order(1)
public class DatabaseMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {

        // ── 1. Make artist_id nullable ──────────────────────────────────
        tryExecute("ALTER TABLE `artworks` MODIFY COLUMN `artist_id` BIGINT NULL",
                   "artist_id made nullable");

        // ── 2. Check current column types ──────────────────────────────
        checkColumnType("image");
        checkColumnType("thumbnail");

        // ── 3. Widen image column – try multiple SQL syntaxes ──────────
        widenColumn("image");
        widenColumn("thumbnail");

        // ── 4. Verify the change took effect ───────────────────────────
        checkColumnType("image");
        checkColumnType("thumbnail");

        // ── 5. Log max_allowed_packet ──────────────────────────────────
        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(
                "SHOW VARIABLES LIKE 'max_allowed_packet'");
            long val = Long.parseLong(result.get("Value").toString());
            System.out.println("[MIGRATION] max_allowed_packet = " + val
                + " bytes (" + (val / 1024 / 1024) + " MB)");
        } catch (Exception e) {
            System.out.println("[MIGRATION] Could not read max_allowed_packet: "
                + e.getMessage());
        }
    }

    /**
     * Try multiple ALTER TABLE variants to widen a column to LONGTEXT.
     * Different MySQL versions / managed providers accept different syntax.
     */
    private void widenColumn(String column) {
        String[][] attempts = {
            // 1. Standard with backticks
            {"ALTER TABLE `artworks` MODIFY COLUMN `" + column + "` LONGTEXT",
             "MODIFY COLUMN (backtick)"},
            // 2. Standard without backticks
            {"ALTER TABLE artworks MODIFY COLUMN " + column + " LONGTEXT",
             "MODIFY COLUMN (no backtick)"},
            // 3. CHANGE syntax (rename to self)
            {"ALTER TABLE artworks CHANGE `" + column + "` `" + column + "` LONGTEXT",
             "CHANGE (backtick)"},
            // 4. CHANGE without backticks
            {"ALTER TABLE artworks CHANGE " + column + " " + column + " LONGTEXT",
             "CHANGE (no backtick)"},
            // 5. Try MEDIUMTEXT if LONGTEXT is rejected
            {"ALTER TABLE artworks MODIFY COLUMN " + column + " MEDIUMTEXT",
             "MODIFY to MEDIUMTEXT"},
        };

        for (String[] attempt : attempts) {
            try {
                jdbcTemplate.execute(attempt[0]);
                System.out.println("[MIGRATION] " + column + " widened via " + attempt[1]);
                return; // Success – no need to try further
            } catch (Exception e) {
                System.out.println("[MIGRATION] " + column + " " + attempt[1]
                    + " FAILED: " + e.getMessage());
            }
        }

        System.err.println("[MIGRATION] *** CRITICAL: Could not widen column '"
            + column + "'. Base64 uploads will fail! ***");
    }

    private void checkColumnType(String column) {
        try {
            Map<String, Object> colInfo = jdbcTemplate.queryForMap(
                "SELECT COLUMN_TYPE, CHARACTER_MAXIMUM_LENGTH " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = 'artworks' AND COLUMN_NAME = ?",
                column);
            System.out.println("[MIGRATION] Column '" + column + "' type = "
                + colInfo.get("COLUMN_TYPE")
                + ", max_length = " + colInfo.get("CHARACTER_MAXIMUM_LENGTH"));
        } catch (Exception e) {
            System.out.println("[MIGRATION] Could not check column '" + column
                + "': " + e.getMessage());
        }
    }

    private void tryExecute(String sql, String description) {
        try {
            jdbcTemplate.execute(sql);
            System.out.println("[MIGRATION] " + description + " – OK");
        } catch (Exception e) {
            System.out.println("[MIGRATION] " + description + " – skipped: "
                + e.getMessage());
        }
    }
}
