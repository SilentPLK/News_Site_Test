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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
