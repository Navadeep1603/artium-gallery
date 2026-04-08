package com.artium.gallery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "artworks")
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "artist_id", nullable = true)
    private Artist artist;

    @Column(name = "artist_name")
    private String artistName;

    @Column(name = "artist_id", insertable = false, updatable = false)
    private Long artistId;

    private Integer year;
    private String medium;
    private String style;
    private String category;

    private Double price;
    private String currency;

    private Boolean available;
    private Boolean featured;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String culturalHistory;

    private String origin;
    private String dimensions;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String thumbnail;

    private Integer views;
    private Integer likes;
    private Boolean audioNarration;

    public Artwork() {}

    public Artwork(String title, Artist artist, String artistName, Integer year, String medium, String style,
                   String category, Double price, String currency, Boolean available, Boolean featured,
                   String description, String culturalHistory, String origin, String dimensions,
                   String image, String thumbnail, Integer views, Integer likes, Boolean audioNarration) {
        this.title = title;
        this.artist = artist;
        this.artistName = artistName;
        this.year = year;
        this.medium = medium;
        this.style = style;
        this.category = category;
        this.price = price;
        this.currency = currency;
        this.available = available;
        this.featured = featured;
        this.description = description;
        this.culturalHistory = culturalHistory;
        this.origin = origin;
        this.dimensions = dimensions;
        this.image = image;
        this.thumbnail = thumbnail;
        this.views = views;
        this.likes = likes;
        this.audioNarration = audioNarration;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Artist getArtist() { return artist; }
    public void setArtist(Artist artist) { this.artist = artist; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public Long getArtistId() { return artistId; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getMedium() { return medium; }
    public void setMedium(String medium) { this.medium = medium; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCulturalHistory() { return culturalHistory; }
    public void setCulturalHistory(String culturalHistory) { this.culturalHistory = culturalHistory; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public Boolean getAudioNarration() { return audioNarration; }
    public void setAudioNarration(Boolean audioNarration) { this.audioNarration = audioNarration; }
}
