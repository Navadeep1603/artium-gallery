package com.artium.gallery.controller;

import com.artium.gallery.entity.Exhibition;
import com.artium.gallery.service.ExhibitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
public class ExhibitionController {

    @Autowired
    private ExhibitionService exhibitionService;

    @GetMapping
    public List<Exhibition> getAllExhibitions() {
        return exhibitionService.getAllExhibitions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exhibition> getExhibitionById(@PathVariable Long id) {
        return exhibitionService.getExhibitionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<Exhibition> getByStatus(@PathVariable String status) {
        return exhibitionService.getExhibitionsByStatus(status);
    }

    @GetMapping("/featured")
    public List<Exhibition> getFeatured() {
        return exhibitionService.getFeaturedExhibitions();
    }

    @PostMapping
    public Exhibition createExhibition(@RequestBody Exhibition exhibition) {
        return exhibitionService.createExhibition(exhibition);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exhibition> updateExhibition(@PathVariable Long id, @RequestBody Exhibition exhibition) {
        try {
            return ResponseEntity.ok(exhibitionService.updateExhibition(id, exhibition));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExhibition(@PathVariable Long id) {
        exhibitionService.deleteExhibition(id);
        return ResponseEntity.noContent().build();
    }
}
