import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyInitialMigration1713431504399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //users
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS users (
                  userId VARCHAR(36) PRIMARY KEY,
                  username VARCHAR(50) NOT NULL,
                  email VARCHAR(100) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  last_login TIMESTAMP NULL,
                  password VARCHAR(255) NOT NULL,
                  github_id VARCHAR(255) NOT NULL,
                  github_img_url VARCHAR(255),
                  github_profile_url VARCHAR(255),
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  is_admin TINYINT DEFAULT 0
              )
          `);

    //posts
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS posts (
                  post_id VARCHAR(36) PRIMARY KEY,
                  user_id VARCHAR(36) NOT NULL,
                  category_id INT,
                  title VARCHAR(255) NOT NULL,
                  body TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  CONSTRAINT fk_user
                      FOREIGN KEY (user_id)
                      REFERENCES users(userId)
                      ON DELETE CASCADE
              )
          `);

    //refresh_token
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS refresh_token (
                  token_id INT AUTO_INCREMENT PRIMARY KEY,
                  user_id VARCHAR(36) NOT NULL,
                  token VARCHAR(200) NOT NULL,
                  expiry_date TIMESTAMP,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(userId)
              )
          `);

    //view
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS views (
                  view_id INT AUTO_INCREMENT PRIMARY KEY,
                  post_id VARCHAR(36) NOT NULL,
                  view_count INT DEFAULT 0,
                  FOREIGN KEY (post_id) REFERENCES posts(post_id)
              )
          `);

    //tags
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS tags (
                  tag_id INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(100),
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
              )
          `);

    //posts_tags
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS posts_tags (
                  post_id VARCHAR(36) NOT NULL,
                  tag_id INT NOT NULL,
                  PRIMARY KEY (post_id, tag_id),
                  FOREIGN KEY (post_id) REFERENCES posts(post_id),
                  FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
              )
          `);

    //followers
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS followers (
                  follower_id VARCHAR(36) NOT NULL,
                  following_id VARCHAR(36) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (follower_id, following_id),
                  FOREIGN KEY (follower_id) REFERENCES users(userId),
                  FOREIGN KEY (following_id) REFERENCES users(userId)
              )
          `);

    //comments
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS comments (
                  comment_id INT AUTO_INCREMENT PRIMARY KEY,
                  user_id VARCHAR(36) NOT NULL,
                  post_id VARCHAR(36) NOT NULL,
                  content VARCHAR(200) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  parents_comment_id INT NULL,
                  is_deleted TINYINT DEFAULT '0',
                  is_anonymous TINYINT DEFAULT '0',
                  deleted_by VARCHAR(45) NULL,
                  is_post_owner TINYINT DEFAULT '0',
                  FOREIGN KEY (user_id) REFERENCES users(userId),
                  FOREIGN KEY (post_id) REFERENCES posts(post_id)
              )
          `);

    //categories
    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS categories (
                  category_id INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  category_key VARCHAR(45) NOT NULL
              )
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS categories`);
    await queryRunner.query(`DROP TABLE IF EXISTS comments`);
    await queryRunner.query(`DROP TABLE IF EXISTS followers`);
    await queryRunner.query(`DROP TABLE IF EXISTS posts_tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS views`);
    await queryRunner.query(`DROP TABLE IF EXISTS refresh_token`);
    await queryRunner.query(`DROP TABLE IF EXISTS posts`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
