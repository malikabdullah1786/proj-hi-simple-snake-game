## 4. API Contracts

### `GET /api/scores`
- **Description**: Returns top 10 high scores sorted descending by score.
- **Request**: None
- **Response (200 OK)**:
  ```json
  [
    { "id": 1, "playerName": "AAA", "score": 150, "createdAt": "2023-10-25T12:00:00" }
  ]
  ```
- **Error Response (500 Internal Server Error)**: Empty array fallback / error message JSON.

### `POST /api/scores`
- **Description**: Submits a new player score.
- **Request Body**:
  ```json
  {
    "playerName": "ABC",
    "score": 120
  }
  ```
- **Validation Rules**: `playerName` must be exactly 3 alphanumeric characters; `score` must be `>= 0`.
- **Response (201 Created)**:
  ```json
  {
    "id": 2,
    "playerName": "ABC",
    "score": 120,
    "createdAt": "2023-10-25T12:05:00"
  }
  ```
- **Error Response (400 Bad Request)**: Validation constraint failure payload.