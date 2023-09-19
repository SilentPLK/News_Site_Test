-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.21-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ci4tutorial
CREATE DATABASE IF NOT EXISTS `ci4tutorial` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ci4tutorial`;

-- Dumping structure for table ci4tutorial.column_defs_meta
CREATE TABLE IF NOT EXISTS `column_defs_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meta_table_name` varchar(50) NOT NULL,
  `data` varchar(50) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `readonly` bit(1) DEFAULT NULL,
  `show_in_list` bit(1) DEFAULT NULL,
  `reference_table_name` varchar(50) DEFAULT NULL,
  `reference_column_name` varchar(50) DEFAULT NULL,
  `reference_value` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.column_defs_meta: ~7 rows (approximately)
/*!40000 ALTER TABLE `column_defs_meta` DISABLE KEYS */;
INSERT INTO `column_defs_meta` (`id`, `meta_table_name`, `data`, `title`, `type`, `readonly`, `show_in_list`, `reference_table_name`, `reference_column_name`, `reference_value`) VALUES
	(1, 'news', 'id', 'Id', 'number', b'1', b'0', NULL, NULL, NULL),
	(2, 'news', 'title', 'Title', 'text', b'0', b'1', NULL, NULL, NULL),
	(3, 'news', 'slug', 'Slug', 'text', b'1', b'1', NULL, NULL, NULL),
	(4, 'news', 'body', 'Body', 'textarea', b'0', b'1', NULL, NULL, NULL),
	(9, 'news', 'category_id', 'Category', 'string', b'0', b'1', 'news_category', 'id', 'category'),
	(10, 'news', 'category_sub_id', 'Sub Category', 'string', b'0', b'1', 'news_category_sub', 'id', 'sub_category'),
	(11, 'images', 'images', 'Upload', 'multifile', b'0', b'0', NULL, NULL, NULL);
/*!40000 ALTER TABLE `column_defs_meta` ENABLE KEYS */;

-- Dumping structure for table ci4tutorial.form_meta
CREATE TABLE IF NOT EXISTS `form_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) DEFAULT NULL,
  `column_name` varchar(50) DEFAULT NULL,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.form_meta: ~1 rows (approximately)
/*!40000 ALTER TABLE `form_meta` DISABLE KEYS */;
INSERT INTO `form_meta` (`id`, `table_name`, `column_name`, `attributes`) VALUES
	(9, 'regerger', 'gegerger', '{"type":"textarea"}');
/*!40000 ALTER TABLE `form_meta` ENABLE KEYS */;

-- Dumping structure for table ci4tutorial.images
CREATE TABLE IF NOT EXISTS `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `type` varchar(5) DEFAULT NULL,
  `upload_date` datetime DEFAULT current_timestamp(),
  `news_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `news_id` (`news_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.images: ~0 rows (approximately)
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
/*!40000 ALTER TABLE `images` ENABLE KEYS */;

-- Dumping structure for table ci4tutorial.meta_tables
CREATE TABLE IF NOT EXISTS `meta_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) DEFAULT NULL,
  `structure` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`structure`)),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.meta_tables: ~2 rows (approximately)
/*!40000 ALTER TABLE `meta_tables` DISABLE KEYS */;
INSERT INTO `meta_tables` (`id`, `table_name`, `structure`) VALUES
	(8, 'news', '[{"attribute":"type","inputType":"select","choices":"number\\r\\ntext\\r\\ntextarea\\r\\nstring\\r\\nmultifile"},{"attribute":"readonly","inputType":"checkbox","choices":""},{"attribute":"show_in_list","inputType":"checkbox","choices":""},{"attribute":"reference_table_name","inputType":"text","choices":""},{"attribute":"reference_column_name","inputType":"text","choices":""},{"attribute":"reference_value","inputType":"text","choices":""}]'),
	(9, 'test', '[{"attribute":"test","inputType":"text","choices":""}]');
/*!40000 ALTER TABLE `meta_tables` ENABLE KEYS */;

-- Dumping structure for table ci4tutorial.meta_table_def
CREATE TABLE IF NOT EXISTS `meta_table_def` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meta_tables_id` int(11) DEFAULT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `column_name` varchar(50) DEFAULT NULL,
  `column_title` varchar(50) DEFAULT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`json`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.meta_table_def: ~8 rows (approximately)
/*!40000 ALTER TABLE `meta_table_def` DISABLE KEYS */;
INSERT INTO `meta_table_def` (`id`, `meta_tables_id`, `table_name`, `column_name`, `column_title`, `json`) VALUES
	(5, 8, 'news', 'id', 'Id', '{"type":"number","readonly":"1","reference_table_name":"","reference_column_name":"","reference_value":"","show_in_list":false}'),
	(6, 8, 'news', 'title', 'Title', '{"type":"text","show_in_list":"1","reference_table_name":"","reference_column_name":"","reference_value":"","readonly":false}'),
	(7, 8, 'news', 'slug', 'Slug', '{"type":"text","readonly":"1","show_in_list":"1","reference_table_name":"","reference_column_name":"","reference_value":""}'),
	(8, 8, 'news', 'body', 'Body', '{"type":"textarea","show_in_list":"1","reference_table_name":"","reference_column_name":"","reference_value":"","readonly":false}'),
	(9, 8, 'news', 'category_id', 'Category', '{"type":"string","show_in_list":"1","reference_table_name":"news_category","reference_column_name":"id","reference_value":"category","readonly":false}'),
	(10, 8, 'news', 'category_sub_id', 'Sub Category', '{"type":"string","show_in_list":"1","reference_table_name":"news_category_sub","reference_column_name":"id","reference_value":"sub_category","readonly":false}'),
	(11, 8, 'images', 'images', 'Upload', '{"type":"multifile","reference_table_name":"","reference_column_name":"","reference_value":"","readonly":false,"show_in_list":false}'),
	(12, 9, 'test', 'test', 'test', '{"test":"test"}');
/*!40000 ALTER TABLE `meta_table_def` ENABLE KEYS */;

-- Dumping structure for table ci4tutorial.news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL,
  `slug` varchar(128) NOT NULL,
  `body` text NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_sub_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `category_sub_id` (`category_sub_id`),
  CONSTRAINT `FK_news_news_category` FOREIGN KEY (`category_id`) REFERENCES `news_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_news_news_category_sub` FOREIGN KEY (`category_sub_id`) REFERENCES `news_category_sub` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.news: ~5 rows (approximately)
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` (`id`, `title`, `slug`, `body`, `category_id`, `category_sub_id`) VALUES
	(1, 'Elvis sighted', 'elvis-sighted', 'Elvis was sighted at the Podunk internet cafe. It looked like he was writing a CodeIgniter app.', 2, 3),
	(2, 'Say it isn\'t so!', 'say-it-isnt-so', 'Scientists conclude that some programmers have a sense of humor.', 2, 4),
	(3, 'Caffeination, Yes!', 'caffeination-yes', 'World\'s largest coffee shop open onsite nested coffee shop for staff only.', 2, 4),
	(4, 'Important news', 'important-news', 'There is some imporant news around here somewhere.', 1, 1),
	(5, 'Weather Report', 'weather-report', 'The weather currently is.', 1, 2);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;

-- Dumping structure for table ci4tutorial.news_category
CREATE TABLE IF NOT EXISTS `news_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.news_category: ~3 rows (approximately)
/*!40000 ALTER TABLE `news_category` DISABLE KEYS */;
INSERT INTO `news_category` (`id`, `category`) VALUES
	(1, 'Politics'),
	(2, 'Entertainment'),
	(3, 'Sport');
/*!40000 ALTER TABLE `news_category` ENABLE KEYS */;

-- Dumping structure for table ci4tutorial.news_category_sub
CREATE TABLE IF NOT EXISTS `news_category_sub` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sub_category` varchar(50) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `FK__news_category` FOREIGN KEY (`category_id`) REFERENCES `news_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table ci4tutorial.news_category_sub: ~6 rows (approximately)
/*!40000 ALTER TABLE `news_category_sub` DISABLE KEYS */;
INSERT INTO `news_category_sub` (`id`, `sub_category`, `category_id`) VALUES
	(1, 'Latvia', 1),
	(2, 'The World', 1),
	(3, 'Celebrity', 2),
	(4, 'Lifestyle', 2),
	(5, 'Basketball', 3),
	(6, 'Hockey', 3);
/*!40000 ALTER TABLE `news_category_sub` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
