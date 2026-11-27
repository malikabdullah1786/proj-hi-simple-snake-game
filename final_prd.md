# Product Requirements Document: Spring Boot Snake Game

## 1. Overview & Goals
- **Problem**: Users want an instantly accessible, classic Snake game with a reliable high-score tracking leaderboard without complex local setups.
- **Benefits**: Delivers a zero-latency client-side rendering loop powered by a robust Java Spring Boot persistence backend.
- **KPI Metrics**: Game render frame stability (60 FPS UI / 100-150ms tick rate), <50ms score submission latency, 100% database persistence integrity for top 10 scores.

## 2. Personas
- **Casual Gamer**: [Wants to quickly play a responsive session of Snake in the browser and submit their initials to the leaderboard].
- **System Admin/Developer**: [Wants a lightweight monolithic deployment where Spring Boot serves static assets and manages H2 database persistence cleanly].

## 3. User Stories & Epics
- [Epic: Game Loop] As a player, I want smooth snake movement and instantaneous key response so that I can control the snake without input lag.
  - AC: [1] Given the game is active, When the player presses an arrow key, Then the direction updates on the next game tick. [2] Given a rapid double-tap of opposite keys, When processed within a single tick, Then self-collision instant-death is prevented via a direction lock. [3] Given the snake hits a wall or itself, When the collision is detected, Then the game over state triggers immediately.
- [Epic: Scoring & Persistence] As a player, I want my final score recorded with my name so that I can view my rank on the global leaderboard.
  - AC: [1] Given the game ends, When a score > 0 is achieved, Then a modal prompts the user for their initials. [2] Given initials are submitted, When the POST request completes, Then the UI updates to display the top 10 high-score table. [3] Given the application restarts, When fetching scores, Then historical data persists via H2.

## 4. Functional Specs
- **Frontend (HTML5 Canvas / Vanilla JS)**:
  - Game Board Grid: 20x20 cells, canvas dimensions 400x400px.
  - HUD: Current Score, High Score, Pause/Restart buttons.
  - Input Handling: Arrow keys (Up, Down, Left, Right) + WASD mapping.
- **Backend (Spring Boot / Java 17+)**:
  - `GET /api/scores`: Returns JSON array of top 10 scores sorted DESC.
  - `POST /api/scores`: Accepts payload `{ "playerName": String (max 3 chars), "score": Integer }`. Validates score >= 0 and name length == 3.
- **Error Handling**:
  - `POST /api/scores` -> Success: [Return 201 Created with saved entity], Error: [Return 400 Bad Request / Fallback to local storage cache].
  - `GET /api/scores` -> Success: [Return 200 OK with score list], Error: [Return 500 Internal Server Error / Display empty leaderboard state].

## 5. Non-Functional Requirements
- **Performance**: Game tick loop must execute in <5ms; REST API responses for leaderboard endpoints must return in <50ms.
- **Security**: Input sanitization on player initials (alphanumeric only, max 3 characters) to prevent XSS/injection; Spring Security default CSRF handling configured for REST endpoints.
- **Compatibility**: Fully responsive canvas rendering supporting all modern desktop browsers (Chrome, Firefox, Safari, Edge).
- **Data Integrity**: Transactional boundary `@Transactional` applied to score write operations on the embedded H2 relational database.

## 6. Out of Scope & Release Plan
- **Out of Scope**: 
  1. Multiplayer mode or real-time WebSocket synchronization.
  2. User authentication, OAuth, or persistent player accounts.
  3. Advanced power-ups, multiple levels, or custom skins.
- **Release Plan**:
  1. **Phase 1 (Local Build)**: Implement Spring Boot project structure, H2 schema, REST controllers, and integrate HTML/JS canvas assets in `resources/static`.
  2. **Phase 2 (Validation & Packaging)**: Execute end-to-end integration testing for input buffering and score persistence, packaging into a single executable uber-JAR via Maven/Gradle.