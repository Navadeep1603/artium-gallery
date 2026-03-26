package com.artium.gallery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exhibitions")
public class Exhibition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(length = 1000)
    private String description;

    private String curator;
    private String startDate;
    private String endDate;
    private String status;
    private Integer artworkCount;

    @Column(length = 500)
    private String image;

    private Boolean featured;
    private String theme;

    public Exhibition() {}

    public Exhibition(String title, String subtitle, String description, String curator,
                      String startDate, String endDate, String status, Integer artworkCount,
                      String image, Boolean featured, String theme) {
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.curator = curator;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.artworkCount = artworkCount;
        this.image = image;
        this.featured = featured;
        this.theme = theme;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCurator() { return curator; }
    public void setCurator(String curator) { this.curator = curator; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getArtworkCount() { return artworkCount; }
    public void setArtworkCount(Integer artworkCount) { this.artworkCount = artworkCount; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
