package com.artium.gallery.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Proxies image uploads to ImgBB free hosting service.
 * 
 * Set the IMGBB_API_KEY environment variable on Render.
 * Get a free key from: https://api.imgbb.com/
 *   1. Sign up at https://imgbb.com/signup
 *   2. Go to https://api.imgbb.com/
 *   3. Copy your API key
 *   4. Set it as IMGBB_API_KEY env var on Render
 */
@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    @Value("${IMGBB_API_KEY:}")
    private String imgbbApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestBody Map<String, String> body) {
        if (imgbbApiKey == null || imgbbApiKey.isEmpty()) {
            System.err.println("[IMAGE UPLOAD] No IMGBB_API_KEY configured!");
            return ResponseEntity.status(503).body(
                Map.of("error", "Image hosting not configured. Set IMGBB_API_KEY on Render."));
        }

        String imageData = body.get("image");
        if (imageData == null || imageData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No image provided"));
        }

        try {
            // Strip the "data:image/...;base64," prefix
            String base64 = imageData;
            if (base64.contains(",")) {
                base64 = base64.substring(base64.indexOf(",") + 1);
            }

            System.out.println("[IMAGE UPLOAD] Uploading to ImgBB, base64 size = "
                + (base64.length() / 1024) + " KB");

            // Build form-data for ImgBB API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("key", imgbbApiKey);
            formData.add("image", base64);

            HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.imgbb.com/1/upload",
                request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");

                if (Boolean.TRUE.equals(success)) {
                    Map data = (Map) responseBody.get("data");
                    String url = (String) data.get("url");
                    String displayUrl = (String) data.get("display_url");
                    Map thumb = (Map) data.get("thumb");
                    String thumbUrl = thumb != null ? (String) thumb.get("url") : url;

                    System.out.println("[IMAGE UPLOAD] Success: " + url);

                    Map<String, String> result = new HashMap<>();
                    result.put("url", displayUrl != null ? displayUrl : url);
                    result.put("thumbnail", thumbUrl);
                    return ResponseEntity.ok(result);
                }
            }

            System.err.println("[IMAGE UPLOAD] ImgBB returned error: " + response.getBody());
            return ResponseEntity.status(502).body(
                Map.of("error", "Image hosting service returned an error"));

        } catch (Exception e) {
            System.err.println("[IMAGE UPLOAD] Failed: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Image upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
