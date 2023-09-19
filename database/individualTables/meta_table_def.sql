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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
