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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
