DROP TABLE IF EXISTS users;

CREATE TABLE
    IF NOT EXISTS users (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(20) NOT NULL,
        `self_introduction` TEXT,
        `age` INT NOT NULL,
        `updated_at` DATETIME,
        PRIMARY KEY (`id`),
        UNIQUE `unique_name_age` (`name`, `age`)
    ) DEFAULT CHARSET = utf8 COLLATE = utf8_bin;
