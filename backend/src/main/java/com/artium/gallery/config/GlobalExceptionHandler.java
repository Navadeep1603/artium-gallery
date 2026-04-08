package com.artium.gallery.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler to catch Spring-level errors
 * (e.g. JSON parsing failures for oversized base64 payloads)
 * before they produce generic 500 responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleUnreadable(HttpMessageNotReadableException ex) {
        System.err.println("[GLOBAL ERROR] HttpMessageNotReadableException: " + ex.getMessage());
        Map<String, String> body = new HashMap<>();
        body.put("error", "Request body could not be read. The image may be too large.");
        body.put("cause", ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSize(MaxUploadSizeExceededException ex) {
        System.err.println("[GLOBAL ERROR] MaxUploadSizeExceededException: " + ex.getMessage());
        Map<String, String> body = new HashMap<>();
        body.put("error", "Upload exceeds the maximum allowed size.");
        body.put("cause", ex.getMessage());
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        System.err.println("[GLOBAL ERROR] " + ex.getClass().getName() + ": " + ex.getMessage());
        ex.printStackTrace();
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage() != null ? ex.getMessage() : ex.getClass().getName());
        Throwable cause = ex.getCause();
        StringBuilder causeChain = new StringBuilder();
        while (cause != null) {
            causeChain.append(cause.getClass().getSimpleName()).append(": ").append(cause.getMessage()).append(" -> ");
            cause = cause.getCause();
        }
        body.put("cause", causeChain.length() > 0 ? causeChain.toString() : "none");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
