package com.artium.gallery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String specialty;

    @Column(length = 1000)
    private String bio;

    private String location;

    @Column(length = 500)
    private String avatar;

    private Integer followers;
    private Integer artworksCount;
    private Boolean featured;

    public Artist() {}

    public Artist(String name, String specialty, String bio, String location, String avatar, Integer followers, Integer artworksCount, Boolean featured) {
        this.name = name;
        this.specialty = specialty;
        this.bio = bio;
        this.location = location;
        this.avatar = avatar;
        this.followers = followers;
        this.artworksCount = artworksCount;
        this.featured = featured;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Integer getFollowers() { return followers; }
    public void setFollowers(Integer followers) { this.followers = followers; }

    public Integer getArtworksCount() { return artworksCount; }
    public void setArtworksCount(Integer artworksCount) { this.artworksCount = artworksCount; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
}
