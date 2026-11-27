## 3. Database Schema
```yaml
database: H2 (Embedded)
tables:
  high_scores:
    columns:
      id:
        type: BIGINT
        constraints: PRIMARY KEY AUTO_INCREMENT
      player_name:
        type: VARCHAR(3)
        constraints: NOT NULL
      score:
        type: INTEGER
        constraints: NOT NULL
      created_at:
        type: TIMESTAMP
        constraints: DEFAULT CURRENT_TIMESTAMP
    indexes:
      - name: idx_scores_desc
        columns: [score DESC, created_at ASC]
```