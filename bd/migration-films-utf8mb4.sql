-- Migration pour permettre tous les caractères et de longs textes dans la table films
ALTER TABLE films
  MODIFY COLUMN subtitle TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  MODIFY COLUMN youtube TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  MODIFY COLUMN description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  MODIFY COLUMN videoUrl VARCHAR(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  MODIFY COLUMN imageUrl VARCHAR(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  MODIFY COLUMN title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
