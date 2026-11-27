package com.example.snake.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "high_scores", indexes = {
    @Index(name = "idx_scores_desc", columnList = "score DESC, created_at ASC")
})
public class HighScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Player name cannot be blank")
    @Size(min = 3, max = 3, message = "Player name must be exactly 3 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]*$", message = "Player name must be alphanumeric")
    @Column(name = "player_name", nullable = false, length = 3)
    private String playerName;

    @NotNull(message = "Score cannot be null")
    @Min(value = 0, message = "Score must be greater than or equal to 0")
    @Column(nullable = false)
    private Integer score;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public HighScore() {}

    public HighScore(String playerName, Integer score) {
        this.playerName = playerName;
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
