package com.artium.gallery.service;

import com.artium.gallery.entity.Exhibition;
import com.artium.gallery.repository.ExhibitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExhibitionService {

    @Autowired
    private ExhibitionRepository exhibitionRepository;

    public List<Exhibition> getAllExhibitions() {
        return exhibitionRepository.findAll();
    }

    public Optional<Exhibition> getExhibitionById(Long id) {
        return exhibitionRepository.findById(id);
    }

    public List<Exhibition> getExhibitionsByStatus(String status) {
        return exhibitionRepository.findByStatus(status);
    }

    public List<Exhibition> getFeaturedExhibitions() {
        return exhibitionRepository.findByFeaturedTrue();
    }

    public Exhibition createExhibition(Exhibition exhibition) {
        return exhibitionRepository.save(exhibition);
    }

    public Exhibition updateExhibition(Long id, Exhibition details) {
        return exhibitionRepository.findById(id).map(exhibition -> {
            exhibition.setTitle(details.getTitle());
            exhibition.setSubtitle(details.getSubtitle());
            exhibition.setDescription(details.getDescription());
            exhibition.setCurator(details.getCurator());
            exhibition.setStartDate(details.getStartDate());
            exhibition.setEndDate(details.getEndDate());
            exhibition.setStatus(details.getStatus());
            exhibition.setArtworkCount(details.getArtworkCount());
            exhibition.setImage(details.getImage());
            exhibition.setFeatured(details.getFeatured());
            exhibition.setTheme(details.getTheme());
            return exhibitionRepository.save(exhibition);
        }).orElseThrow(() -> new RuntimeException("Exhibition not found with id " + id));
    }

    public void deleteExhibition(Long id) {
        exhibitionRepository.deleteById(id);
    }
}
