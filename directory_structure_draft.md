## 2. Topology
- **Client (Browser)**: Runs HTML5 Canvas game loop at 60 FPS / 100-150ms tick rate. Communicates via HTTP/HTTPS REST API.
- **Backend (Spring Boot Monolith)**:
  - Serves static assets (`/index.html`, `/js/*`, `/css/*`).
  - REST API (`/api/scores`) controller for leaderboard operations.
  - Spring Data JPA transactional service boundary for H2 persistence.
- **Database (H2 Embedded)**: Stores high-score records (`id`, `player_name`, `score`, `created_at`).

## 5. Directory Tree
```text
spring-boot-snake/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── snake/
│   │   │               ├── SnakeApplication.java
│   │   │               ├── controller/
│   │   │               │   └── ScoreController.java
│   │   │               ├── model/
│   │   │               │   └── HighScore.java
│   │   │               ├── repository/
│   │   │               │   └── ScoreRepository.java
│   │   │               └── service/
│   │   │                   └── ScoreService.java
│   │   resouces/
│   │       ├── application.properties
│   │       └── static/
│   │           ├── index.html
│   │           ├── css/
│   │           │   └── style.css
│   │           └── js/
│   │               ├── game.js
│   │               └── api.js
│   └── test/
│       └── java/
│           └── com/
│               └── example/
│                   └── snake/
│                       └── SnakeApplicationTests.java
```