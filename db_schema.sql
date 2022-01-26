CREATE DATABASE  IF NOT EXISTS `dailyneeds` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dailyneeds`;
-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: dailyneeds
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `street` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `type` enum('default','sub','pick_up') NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'Home address','45 young street','Owerri-West','Imo','default','2022-01-22 02:24:59',NULL,'2021-12-23 23:22:06'),(2,1,'Office address','3 Paul street','Owerri','Imo State','sub',NULL,NULL,'2021-12-24 00:05:27'),(3,2,'Main','39 Black road','Ihiagwa-Owerri','Imo State','sub',NULL,NULL,'2021-12-24 11:58:49'),(4,2,'Office address','44 Okey street','Control-Owerri','Imo State','default',NULL,NULL,'2021-12-25 15:29:45'),(5,3,'Home address','2 Buns street','Rumuola','Rivers State','default',NULL,NULL,'2021-12-25 15:35:57'),(6,7,NULL,'2 Ben street','Orlu','Imo','default','2022-01-22 16:14:07',NULL,'2021-12-26 14:44:25'),(7,11,NULL,'10 Sam street, Dog Road','Owerri-North','Imo','default','2022-01-22 18:28:32',NULL,'2021-12-29 00:56:16'),(8,3,'School address','3 Meat lodge','Oyigbo','Rivers','sub',NULL,NULL,'2021-12-29 22:43:07'),(9,9,NULL,'10 Sam street, Dog Road','Owerri-North','Imo','default',NULL,NULL,'2022-01-06 14:10:37'),(10,1,'School address','3 Meat lodge','Oyigbo','Rivers','sub','2022-01-18 21:51:31','2022-01-18 22:29:41','2022-01-11 00:30:40'),(11,1,'School address','3 Meat lodge','Oyigbo','Rivers','sub','2022-01-22 02:24:59','2022-01-22 02:27:29','2022-01-22 02:21:05');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_addresses` BEFORE UPDATE ON `addresses` FOR EACH ROW INSERT INTO addresses_history SET 
  address_id = OLD.id,
  `title` = OLD.title,
  `street` = OLD.street,
  `city` = OLD.city,
  `state` = OLD.state,
  `type`= OLD.type */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `addresses_history`
--

DROP TABLE IF EXISTS `addresses_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address_id` bigint(20) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `street` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `type` enum('default','sub','pick_up') NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `addresses_history_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses_history`
--

LOCK TABLES `addresses_history` WRITE;
/*!40000 ALTER TABLE `addresses_history` DISABLE KEYS */;
INSERT INTO `addresses_history` VALUES (1,10,'Schoolboy address','3 Meat lodge','Oyigbo','Rivers','default','2022-01-18 13:47:57'),(2,10,'School address','3 Meat lodge','Oyigbo','Rivers','default','2022-01-18 21:51:31'),(3,1,'Home address','45 young street','Owerri-West','Imo','sub','2022-01-18 21:51:31'),(4,10,'School address','3 Meat lodge','Oyigbo','Rivers','sub','2022-01-18 22:29:41'),(5,1,'Home address','45 young street','Owerri-West','Imo','default','2022-01-22 02:21:05'),(6,11,'School address','3 Meat lodge','Oyigbo','Rivers','default','2022-01-22 02:24:59'),(7,1,'Home address','45 young street','Owerri-West','Imo','sub','2022-01-22 02:24:59'),(8,11,'School address','3 Meat lodge','Oyigbo','Rivers','sub','2022-01-22 02:27:29'),(9,6,NULL,'2 Ben street','Orlu','Imo','default','2022-01-22 16:14:07'),(10,7,NULL,'50 dead road','Owerri-Mbaise','Imo State','default','2022-01-22 18:28:32');
/*!40000 ALTER TABLE `addresses_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrators` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `store_id` bigint(20) DEFAULT NULL,
  `delivery_firm_id` bigint(20) DEFAULT NULL,
  `type` enum('application','store','delivery_firm') NOT NULL,
  `role` enum('super','sub') NOT NULL,
  `password` varchar(250) NOT NULL,
  `status` enum('active','suspended','deactivated') NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `store_id` (`store_id`),
  KEY `delivery_firm_id` (`delivery_firm_id`),
  CONSTRAINT `administrators_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `administrators_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `administrators_ibfk_3` FOREIGN KEY (`delivery_firm_id`) REFERENCES `delivery_firms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` VALUES (1,1,NULL,NULL,'application','super','$2b$10$2syNnRWipw1GHsnlSxZIvO7I0mOg46wBqREV0zJQ2864Y1EtLg15q','active','2021-12-24 22:14:55'),(2,1,5,NULL,'store','super','$2b$10$Xbul6AL3nGYz6sX/JG03QOoxtmMHgnJiZVy4dUbdxExOG0Kr13OcK','active','2021-12-25 21:42:25'),(3,1,6,NULL,'store','super','$2b$10$kdtvS20kbye2lDfjuhZKs.cG2wyiId8k2ayjChJ5G1LI//q376Uhu','active','2021-12-25 21:51:36'),(4,3,7,NULL,'store','super','$2b$10$A5fGMiWlYIO2KQoaKAFcY.dnECV7r6Z0fAgOj1VKVVbsheIwCgT9S','active','2021-12-25 22:13:27'),(5,1,8,NULL,'store','super','$2b$10$LOTty18MOc/M4ewNX6/TG.t9HniE9szAUwR9ZKeCCyVK4ijYdk0hC','active','2021-12-26 12:17:22'),(6,4,NULL,1,'delivery_firm','super','$2b$10$.zxUpAXPBFXJnDH3EQ81W.YyT/mafZqj43gCu8vMyjFw8oN/iGUzO','active','2021-12-27 23:54:52'),(7,4,NULL,2,'delivery_firm','super','$2b$10$uTtRLUH7AsAvWeI.adIYJ.J7inlfBW4SEs6WubI4tdqhi4RqQkXWC','active','2021-12-27 23:56:01'),(8,4,NULL,3,'delivery_firm','super','$2b$10$GuT//RU57m.dsCfuMtW.c.9htZXl6w7MYxPpv1qpEuG2Ydi5ibf.q','active','2021-12-27 23:57:18'),(9,1,9,NULL,'store','super','$2b$10$MXTtWeIBR1DD9r8uD7cTb.sdpAzGaEmcT7n.ld1WCETXpfjCVaoZ.','active','2021-12-29 20:55:47'),(12,1,12,NULL,'store','super','$2b$10$Flj.qz4h61DRzjydQ/LEnOTZHnTqRH/m2dWYG1SCfk.ZYIjwKs5/.','active','2022-01-22 15:59:03'),(13,1,NULL,4,'delivery_firm','super','$2b$10$ouD9q6am/22vNEZc2rs5T.pt2MjJhZA/SLZCfLMuI.uaGINL9RMZq','active','2022-01-22 18:00:27');
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` enum('product','store') NOT NULL,
  `name` varchar(50) NOT NULL,
  `photo` varchar(50) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'store','Restuarant','category-1.jpg','Stores to get food','2021-12-25 05:06:21'),(2,'store','Pharmacy',NULL,'Stores to get medicine','2021-12-25 05:07:16'),(3,'store','Supermarket',NULL,'Stores to get other items','2021-12-25 07:43:22'),(4,'store','Snack',NULL,'Stores to get snacks','2021-12-25 07:44:14'),(5,'store','Botique',NULL,'Stores to get clothings','2021-12-25 07:44:35'),(6,'product','Snacks',NULL,'Sweet foods','2021-12-25 15:38:04'),(7,'product','Soup',NULL,'Nice soups','2021-12-27 17:27:39'),(8,'product','Rice',NULL,'All kinds of rice','2021-12-27 16:28:09'),(9,'product','Skin care',NULL,'Get the best for your skin','2021-12-27 16:28:46'),(10,'product','Drinks',NULL,'Tasty drinks','2021-12-27 16:29:12'),(11,'store','Fashion',NULL,'All you need to look amazing.','2022-01-22 02:49:12');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'Jasper','Anelechukwu','$2b$10$YdUJMaI6gA6use9YXRbeD.TAJm0Wp3zCLv4U4vNjYY1Jbvk4KVDXK','2022-01-23 22:30:16'),(2,2,'Richard','Chukwu','$2b$10$aXuVPBNUdvqlm6fGpfjYNOqn.um0K2oXXu7a5UqRc2Vioa/d9NfRO',NULL),(3,3,'Fred','Cake','$2b$10$zkl9QtVS2Z8ZSayGmByLY.UlHC1DMEx9AGZv4XR/ydpMpKlVOoAZm',NULL),(4,4,'White','Black','$2b$10$atK.zjusD8vdZB7B2pBsBOq58muLRqIEiPOmf4z0Ynnj4Ka576fwK',NULL),(7,14,'Husk','Blue','$2b$10$Nma.peF34.cXoXH/um.M6eLNxxzHK1puA5EO6N5PWenGSGNJmNI6i',NULL),(8,16,'Bullet','Gun','$2b$10$txqrIG/XTUcb40kfd2RdeOoum8CptEAWINinojyaQTEh.MMqHfNK.','2022-01-20 17:49:57'),(9,17,'Round','Ball','$2b$10$XnbV9xSWST03/nBsq.SEg.wu9pC147QtDhBtUIoGF32H8r6748vj6','2022-01-21 18:12:32');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_customers` BEFORE UPDATE ON `customers` FOR EACH ROW INSERT INTO customers_history SET 
  customer_id = OLD.id,
  `first_name` = OLD.first_name,
  `last_name` = OLD.last_name,
  `password` = OLD.password */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `customers_history`
--

DROP TABLE IF EXISTS `customers_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `customers_history_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers_history`
--

LOCK TABLES `customers_history` WRITE;
/*!40000 ALTER TABLE `customers_history` DISABLE KEYS */;
INSERT INTO `customers_history` VALUES (1,7,'Husk','Blue','$2b$10$Nma.peF34.cXoXH/um.M6eLNxxzHK1puA5EO6N5PWenGSGNJmNI6i','2022-01-18 22:47:09'),(2,7,'Husku','Blue','$2b$10$Nma.peF34.cXoXH/um.M6eLNxxzHK1puA5EO6N5PWenGSGNJmNI6i','2022-01-18 22:47:09'),(5,1,'Jasper','Anelechukwu','$2b$10$30mKxCxOCMlcuJw7KfG2GuHe4PuHi5CDRga6B1aLewee8rDuuxJnC','2022-01-19 17:29:09'),(6,1,'Jasp','Anelechukwu','$2b$10$30mKxCxOCMlcuJw7KfG2GuHe4PuHi5CDRga6B1aLewee8rDuuxJnC','2022-01-20 11:26:07'),(7,1,'Jaspx','Anelechukwu','$2b$10$30mKxCxOCMlcuJw7KfG2GuHe4PuHi5CDRga6B1aLewee8rDuuxJnC','2022-01-21 18:17:15'),(8,1,'Jasper','Anelechukwu','$2b$10$30mKxCxOCMlcuJw7KfG2GuHe4PuHi5CDRga6B1aLewee8rDuuxJnC','2022-01-21 18:26:23'),(9,1,'Jasper','Anelechukwu','$2b$10$0i1hJ6Rd2W/KHfjNFzCSWuMxy6EfJaSLrYFtbhMS8CSeK3I7r8rNe','2022-01-23 14:32:51'),(10,1,'Jasper','Anelechukwu','$2b$10$JYjovCZY05M5k4Vmqri4g.8aIrscvV8G2lR8ha1DQCsyP3fC6/sGq','2022-01-23 22:26:39'),(11,1,'Jasper','Anelechukwu','$2b$10$JYjovCZY05M5k4Vmqri4g.8aIrscvV8G2lR8ha1DQCsyP3fC6/sGq','2022-01-23 22:26:55'),(12,1,'Jasper','Anelechukwu','$2b$10$rC/ZZQsyIvs6PfERc4kpu.A/Uh1Aoas78ZpUiB8jMfxotRv0VoJ6a','2022-01-23 22:27:00'),(13,1,'Jasper','Anelechukwu','$2b$10$VGTvT.Vj.Ak7oVlvHCCHH.e44I1fhytXnpZqzso8y6l6HegbvWZMW','2022-01-23 22:30:16');
/*!40000 ALTER TABLE `customers_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_firms`
--

DROP TABLE IF EXISTS `delivery_firms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_firms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `delivery_firms_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_firms`
--

LOCK TABLES `delivery_firms` WRITE;
/*!40000 ALTER TABLE `delivery_firms` DISABLE KEYS */;
INSERT INTO `delivery_firms` VALUES (1,9),(2,10),(3,11),(4,21);
/*!40000 ALTER TABLE `delivery_firms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_route_durations`
--

DROP TABLE IF EXISTS `delivery_route_durations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_route_durations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_route_id` bigint(20) NOT NULL,
  `minimium` bigint(20) NOT NULL,
  `maximium` bigint(20) NOT NULL,
  `fee` double NOT NULL,
  `unit` enum('minute','hour','day','week','month') NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_route_durations_ibfk_1` (`delivery_route_id`),
  CONSTRAINT `delivery_route_durations_ibfk_1` FOREIGN KEY (`delivery_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_route_durations`
--

LOCK TABLES `delivery_route_durations` WRITE;
/*!40000 ALTER TABLE `delivery_route_durations` DISABLE KEYS */;
INSERT INTO `delivery_route_durations` VALUES (1,1,1,3,0,'day',NULL,NULL,'2022-01-11 20:51:33'),(2,7,4,5,0,'day',NULL,NULL,'2022-01-12 10:22:34'),(3,7,2,3,50,'day',NULL,NULL,'2022-01-12 10:23:01'),(4,4,1,4,100,'day','2022-01-18 22:09:48',NULL,'2022-01-12 10:23:17'),(5,4,1,2,0,'week',NULL,NULL,'2022-01-12 10:23:36'),(6,8,1,2,0,'day',NULL,NULL,'2022-01-12 10:32:58'),(7,9,1,4,0,'day',NULL,NULL,'2022-01-12 10:33:34'),(8,10,1,4,0,'day',NULL,NULL,'2022-01-12 10:34:50'),(9,11,1,2,0,'week','2022-01-19 17:03:41','2022-01-19 17:11:51','2022-01-19 17:03:41'),(10,13,1,3,0,'week','2022-01-23 13:18:56','2022-01-23 13:19:49','2022-01-23 13:16:40');
/*!40000 ALTER TABLE `delivery_route_durations` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_delivery_route_durations` BEFORE UPDATE ON `delivery_route_durations` FOR EACH ROW INSERT INTO delivery_route_durations_history SET 
  delivery_route_duration_id = OLD.id,
  `minimium` = OLD.minimium,
  `maximium` = OLD.maximium,
  `fee` = OLD.fee,
  unit = OLD.unit */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `delivery_route_durations_history`
--

DROP TABLE IF EXISTS `delivery_route_durations_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_route_durations_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_route_duration_id` bigint(20) NOT NULL,
  `minimium` bigint(20) NOT NULL,
  `maximium` bigint(20) NOT NULL,
  `fee` double NOT NULL,
  `unit` enum('minute','hour','day','week','month') NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_route_duration_id` (`delivery_route_duration_id`),
  CONSTRAINT `delivery_route_durations_history_ibfk_1` FOREIGN KEY (`delivery_route_duration_id`) REFERENCES `delivery_route_durations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_route_durations_history`
--

LOCK TABLES `delivery_route_durations_history` WRITE;
/*!40000 ALTER TABLE `delivery_route_durations_history` DISABLE KEYS */;
INSERT INTO `delivery_route_durations_history` VALUES (1,1,1,3,0,'day','2022-01-18 14:38:46'),(2,1,1,3,1,'day','2022-01-18 14:38:57'),(3,4,1,3,100,'day','2022-01-18 22:09:48'),(4,9,1,2,0,'week','2022-01-19 17:06:03'),(5,9,1,2,0,'week','2022-01-19 18:11:26'),(6,9,1,2,0,'week','2022-01-19 17:11:51'),(7,10,1,2,0,'week','2022-01-23 13:18:56'),(8,10,1,3,0,'week','2022-01-23 13:19:49');
/*!40000 ALTER TABLE `delivery_route_durations_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_route_weights`
--

DROP TABLE IF EXISTS `delivery_route_weights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_route_weights` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_route_id` bigint(20) NOT NULL,
  `minimium` double NOT NULL,
  `maximium` double NOT NULL,
  `fee` double NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_route_weights_ibfk_1` (`delivery_route_id`),
  CONSTRAINT `delivery_route_weights_ibfk_1` FOREIGN KEY (`delivery_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_route_weights`
--

LOCK TABLES `delivery_route_weights` WRITE;
/*!40000 ALTER TABLE `delivery_route_weights` DISABLE KEYS */;
INSERT INTO `delivery_route_weights` VALUES (1,1,5,50,120,'2022-01-23 13:11:11',NULL,'2022-01-11 20:26:35'),(2,1,51,100,250,NULL,NULL,'2022-01-11 20:27:52'),(3,7,10,30,100,NULL,NULL,'2022-01-12 10:17:51'),(4,7,35,80,200,NULL,NULL,'2022-01-12 10:18:22'),(5,7,90,250,450,NULL,NULL,'2022-01-12 10:21:10'),(6,4,1,20,50,NULL,NULL,'2022-01-12 10:21:54'),(7,4,21,45,150,NULL,NULL,'2022-01-12 10:22:06'),(8,7,2,9,50,NULL,NULL,'2022-01-12 10:28:33'),(9,8,1,10,50,NULL,NULL,'2022-01-12 10:32:38'),(10,9,4,10,80,NULL,NULL,'2022-01-12 10:34:05'),(11,9,5,20,150,NULL,NULL,'2022-01-12 10:35:11'),(12,9,25,60,300,NULL,NULL,'2022-01-12 10:35:25'),(13,10,5,20,100,NULL,NULL,'2022-01-12 10:39:45'),(14,11,5,20,200,'2022-01-19 17:03:07',NULL,'2022-01-19 17:03:07'),(15,13,5,20,200,'2022-01-23 13:09:18',NULL,'2022-01-23 13:09:18');
/*!40000 ALTER TABLE `delivery_route_weights` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_delivery_route_weights` BEFORE UPDATE ON `delivery_route_weights` FOR EACH ROW INSERT INTO delivery_route_weights_history SET 
  delivery_route_weight_id = OLD.id,
  `minimium` = OLD.minimium,
  `maximium` = OLD.maximium,
  `fee` = OLD.fee */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `delivery_route_weights_history`
--

DROP TABLE IF EXISTS `delivery_route_weights_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_route_weights_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_route_weight_id` bigint(20) NOT NULL,
  `minimium` double NOT NULL,
  `maximium` double NOT NULL,
  `fee` double NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_route_weight_id` (`delivery_route_weight_id`),
  CONSTRAINT `delivery_route_weights_history_ibfk_1` FOREIGN KEY (`delivery_route_weight_id`) REFERENCES `delivery_route_weights` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_route_weights_history`
--

LOCK TABLES `delivery_route_weights_history` WRITE;
/*!40000 ALTER TABLE `delivery_route_weights_history` DISABLE KEYS */;
INSERT INTO `delivery_route_weights_history` VALUES (1,1,5,50,100,'2022-01-18 14:37:19'),(2,1,50,50,100,'2022-01-18 14:37:35'),(3,1,5,50,100,'2022-01-18 22:08:58'),(4,14,5,20,200,'2022-01-19 17:06:03'),(5,14,5,20,200,'2022-01-19 18:11:17'),(6,14,5,20,200,'2022-01-19 17:25:06'),(7,1,5,50,120,'2022-01-23 13:11:11'),(8,14,5,20,200,'2022-01-23 14:12:52'),(9,2,51,100,250,'2022-01-23 13:13:12'),(10,2,51,100,250,'2022-01-23 14:15:41');
/*!40000 ALTER TABLE `delivery_route_weights_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_routes`
--

DROP TABLE IF EXISTS `delivery_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_routes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_firm_id` bigint(20) NOT NULL,
  `origin_route_id` bigint(20) DEFAULT NULL,
  `destination_route_id` bigint(20) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `door_delivery` tinyint(1) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_firm_id` (`delivery_firm_id`),
  KEY `origin_route_id` (`origin_route_id`),
  KEY `destination_route_id` (`destination_route_id`),
  CONSTRAINT `delivery_routes_ibfk_1` FOREIGN KEY (`delivery_firm_id`) REFERENCES `delivery_firms` (`id`),
  CONSTRAINT `delivery_routes_ibfk_2` FOREIGN KEY (`origin_route_id`) REFERENCES `delivery_routes` (`id`),
  CONSTRAINT `delivery_routes_ibfk_3` FOREIGN KEY (`destination_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_routes`
--

LOCK TABLES `delivery_routes` WRITE;
/*!40000 ALTER TABLE `delivery_routes` DISABLE KEYS */;
INSERT INTO `delivery_routes` VALUES (1,3,NULL,NULL,'Abia','Aba North',1,NULL,NULL,'2022-01-11 13:41:33'),(2,3,NULL,NULL,'Imo','Owerri-North',1,NULL,NULL,'2022-01-11 23:12:43'),(3,3,NULL,NULL,'Imo','Owerri-West',1,NULL,NULL,'2022-01-11 23:12:54'),(4,3,NULL,NULL,'Imo','Orlu',0,'2022-01-23 12:53:11',NULL,'2022-01-11 23:13:01'),(7,3,3,4,NULL,NULL,NULL,NULL,NULL,'2022-01-12 08:57:07'),(8,1,NULL,NULL,'Imo','Owerri-West',1,NULL,NULL,'2022-01-12 10:32:10'),(9,1,NULL,NULL,'Imo','Orlu',0,NULL,NULL,'2022-01-12 10:33:22'),(10,1,8,9,NULL,NULL,NULL,NULL,NULL,'2022-01-12 10:34:29'),(11,3,NULL,NULL,'Imo','Mbano',0,'2022-01-19 17:02:49','2022-01-23 12:54:35','2022-01-19 17:02:49'),(13,3,NULL,NULL,'Imo','Mbano',1,'2022-01-23 12:50:31',NULL,'2022-01-23 12:50:31'),(14,3,1,2,NULL,NULL,NULL,'2022-01-23 13:02:50',NULL,'2022-01-23 12:59:28');
/*!40000 ALTER TABLE `delivery_routes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_delivery_routes` BEFORE UPDATE ON `delivery_routes` FOR EACH ROW INSERT INTO delivery_routes_history SET 
  delivery_route_id = OLD.id,
  origin_route_id = OLD.origin_route_id,
  destination_route_id = OLD.destination_route_id,
  `state` = OLD.state,
  `city` = OLD.city,
  `door_delivery` = OLD.door_delivery */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `delivery_routes_history`
--

DROP TABLE IF EXISTS `delivery_routes_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_routes_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_route_id` bigint(20) NOT NULL,
  `origin_route_id` bigint(20) DEFAULT NULL,
  `destination_route_id` bigint(20) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `door_delivery` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_route_id` (`delivery_route_id`),
  CONSTRAINT `delivery_routes_history_ibfk_1` FOREIGN KEY (`delivery_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_routes_history`
--

LOCK TABLES `delivery_routes_history` WRITE;
/*!40000 ALTER TABLE `delivery_routes_history` DISABLE KEYS */;
INSERT INTO `delivery_routes_history` VALUES (1,1,NULL,NULL,'Abia','Aba North',1,'2022-01-18 14:27:46'),(2,1,NULL,NULL,'Abia','Aba Northj',1,'2022-01-18 14:32:32'),(3,4,NULL,NULL,'Imo','Orlu',1,'2022-01-18 22:06:15'),(5,11,NULL,NULL,'Imo','Mbano',0,'2022-01-19 17:06:03'),(6,11,NULL,NULL,'Imo','Mbano',0,'2022-01-19 18:25:00'),(7,11,NULL,NULL,'Imo','Mbano',0,'2022-01-19 17:26:05'),(8,4,NULL,NULL,'Imo','Orlu',0,'2022-01-23 12:53:11'),(9,11,NULL,NULL,'Imo','Mbano',0,'2022-01-23 13:54:27'),(10,11,NULL,NULL,'Imo','Mbano',0,'2022-01-23 12:54:35'),(11,14,1,2,NULL,NULL,NULL,'2022-01-23 13:02:50');
/*!40000 ALTER TABLE `delivery_routes_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_products`
--

DROP TABLE IF EXISTS `discount_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discount_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `discount_id` (`discount_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `discount_products_ibfk_1` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`),
  CONSTRAINT `discount_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_products`
--

LOCK TABLES `discount_products` WRITE;
/*!40000 ALTER TABLE `discount_products` DISABLE KEYS */;
INSERT INTO `discount_products` VALUES (1,5,9,NULL,'2022-01-04 01:14:16'),(2,5,10,NULL,'2022-01-04 01:14:16'),(5,7,9,'2022-01-04 12:50:32','2022-01-04 12:45:33'),(7,8,7,NULL,'2022-01-06 16:36:57'),(8,8,8,NULL,'2022-01-07 23:50:03'),(9,9,13,NULL,'2022-01-11 21:44:18'),(10,9,7,NULL,'2022-01-11 21:44:32'),(13,10,8,'2022-01-19 12:56:03','2022-01-19 11:56:07'),(14,8,14,'2022-01-23 14:23:50','2022-01-23 14:21:21'),(15,11,8,NULL,'2022-01-23 16:07:12');
/*!40000 ALTER TABLE `discount_products` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_discount_products` BEFORE UPDATE ON `discount_products` FOR EACH ROW INSERT INTO discount_products_history SET 
  discount_product_id = OLD.id,
  `product_id` = OLD.product_id */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `discount_products_history`
--

DROP TABLE IF EXISTS `discount_products_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_products_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discount_product_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `discount_product_id` (`discount_product_id`),
  CONSTRAINT `discount_products_history_ibfk_1` FOREIGN KEY (`discount_product_id`) REFERENCES `discount_products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_products_history`
--

LOCK TABLES `discount_products_history` WRITE;
/*!40000 ALTER TABLE `discount_products_history` DISABLE KEYS */;
INSERT INTO `discount_products_history` VALUES (2,1,9,'2022-01-18 14:57:34'),(3,1,10,'2022-01-18 14:57:46'),(4,13,8,'2022-01-19 11:57:54'),(5,13,8,'2022-01-19 12:59:20'),(6,13,8,'2022-01-19 12:56:03'),(7,14,14,'2022-01-23 14:23:50');
/*!40000 ALTER TABLE `discount_products_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_id` bigint(20) NOT NULL,
  `title` varchar(50) NOT NULL,
  `type` enum('percentage','amount') NOT NULL,
  `value` double NOT NULL,
  `minimium_required_amount` double DEFAULT NULL,
  `minimium_required_quantity` double DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
INSERT INTO `discounts` VALUES (5,5,'New year bonanza','percentage',10,3500,10,'2022-01-06 08:00:00','2022-01-20 08:00:00',NULL,NULL,'2022-01-04 01:14:16'),(7,5,'Eat off','percentage',10,NULL,2,'2022-01-07 08:00:00','2022-01-12 22:00:00',NULL,NULL,'2022-01-04 10:55:51'),(8,7,'Flip meal','amount',5,5000,NULL,'2022-01-05 08:00:00','2022-01-10 11:00:00',NULL,NULL,'2022-01-04 22:56:36'),(9,7,'January save','percentage',20,NULL,2,'2022-01-12 08:00:00','2022-01-20 11:00:00','2022-01-23 14:14:43',NULL,'2022-01-11 21:10:39'),(10,7,'Black monday','percentage',5,NULL,5,'2022-01-20 08:00:00','2022-01-20 11:00:00','2022-01-19 11:51:33','2022-01-23 14:15:20','2022-01-19 11:51:33'),(11,7,'Free monday','percentage',15,2500,NULL,'2022-01-23 14:00:00','2022-01-30 11:00:00','2022-01-23 13:42:36',NULL,'2022-01-23 13:42:36');
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_discounts` BEFORE UPDATE ON `discounts` FOR EACH ROW INSERT INTO discounts_history SET 
  discount_id = OLD.id,
  `title` = OLD.title,
  `type` = OLD.type,
  `value` = OLD.value,
  minimium_required_amount = OLD.minimium_required_amount,
  minimium_required_quantity = OLD.minimium_required_quantity,
  start_date = OLD.start_date,
  end_date = OLD.end_date */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `discounts_history`
--

DROP TABLE IF EXISTS `discounts_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discount_id` bigint(20) NOT NULL,
  `title` varchar(50) NOT NULL,
  `type` enum('percentage','amount') NOT NULL,
  `value` double NOT NULL,
  `minimium_required_amount` double DEFAULT NULL,
  `minimium_required_quantity` double DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `discount_id` (`discount_id`),
  CONSTRAINT `discounts_history_ibfk_1` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts_history`
--

LOCK TABLES `discounts_history` WRITE;
/*!40000 ALTER TABLE `discounts_history` DISABLE KEYS */;
INSERT INTO `discounts_history` VALUES (1,5,'New year bonanza','percentage',10,3500,10,'2022-01-06 08:00:00','2022-01-20 08:00:00','2022-01-18 14:54:49'),(2,5,'New year bonanza','percentage',10,35004,10,'2022-01-06 08:00:00','2022-01-20 08:00:00','2022-01-18 14:55:00'),(3,9,'January savers','percentage',20,NULL,2,'2022-01-12 08:00:00','2022-01-20 11:00:00','2022-01-18 21:59:47'),(4,10,'Black monday','percentage',5,NULL,5,'2022-01-20 08:00:00','2022-01-20 11:00:00','2022-01-19 11:53:50'),(5,10,'Black monday','percentage',5,NULL,5,'2022-01-20 08:00:00','2022-01-20 11:00:00','2022-01-19 12:55:58'),(6,10,'Black monday','percentage',5,NULL,5,'2022-01-20 08:00:00','2022-01-20 11:00:00','2022-01-19 11:57:54'),(7,10,'Black monday','percentage',5,NULL,5,'2022-01-20 08:00:00','2022-01-20 11:00:00','2022-01-19 12:59:06'),(8,9,'January save','percentage',20,NULL,2,'2022-01-12 08:00:00','2022-01-20 11:00:00','2022-01-23 14:12:24'),(9,9,'January save','percentage',20,2,2,'2022-01-12 08:00:00','2022-01-20 11:00:00','2022-01-23 14:14:29'),(10,9,'January save','percentage',20,2,NULL,'2022-01-12 08:00:00','2022-01-20 11:00:00','2022-01-23 14:14:43'),(11,10,'Black monday','percentage',5,NULL,5,'2022-01-20 08:00:00','2022-01-20 11:00:00','2022-01-23 14:15:20'),(12,11,'Free monday','percentage',15,2,NULL,'2022-01-23 14:00:00','2022-01-30 11:00:00','2022-01-23 16:08:11');
/*!40000 ALTER TABLE `discounts_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,9,1,'2022-01-01 23:43:18'),(8,13,1,'2022-01-11 12:29:47'),(9,14,1,'2022-01-23 13:29:02');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) DEFAULT NULL,
  `order_item_id` bigint(20) DEFAULT NULL,
  `transaction_id` bigint(20) DEFAULT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `receiver_id` bigint(20) DEFAULT NULL,
  `application` enum('receiver','sender') DEFAULT NULL,
  `notification` enum('order_created','order_accepted','order_declined','order_cancelled','transaction_created','transaction_cancelled','transaction_declined','transaction_processing','transaction_failed','transaction_approved','order_item_processing','order_item_transported','order_item_delivered') DEFAULT NULL,
  `content` varchar(50) NOT NULL,
  `delivery_status` enum('sent','delivered') NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `product_variant_id` bigint(20) NOT NULL,
  `delivery_weight_id` bigint(20) DEFAULT NULL,
  `delivery_duration_id` bigint(20) DEFAULT NULL,
  `discount_product_id` bigint(20) DEFAULT NULL,
  `quantity` double NOT NULL,
  `amount` double NOT NULL,
  `delivery_fee` double NOT NULL,
  `discount_amount` double NOT NULL,
  `weight` double NOT NULL,
  `processed_at` datetime DEFAULT NULL,
  `transported_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_variant_id` (`product_variant_id`),
  KEY `discount_product_id` (`discount_product_id`),
  KEY `order_items_ibfk_3` (`delivery_weight_id`),
  KEY `order_items_ibfk_4` (`delivery_duration_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`delivery_weight_id`) REFERENCES `delivery_route_weights` (`id`),
  CONSTRAINT `order_items_ibfk_4` FOREIGN KEY (`delivery_duration_id`) REFERENCES `delivery_route_durations` (`id`),
  CONSTRAINT `order_items_ibfk_5` FOREIGN KEY (`discount_product_id`) REFERENCES `discount_products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,2,8,2,10,1,6700,50,1340,2.56,'2022-01-12 20:57:51','2022-01-12 21:00:57','2022-01-12 21:02:43','2022-01-12 19:01:45'),(2,1,11,8,2,10,1,9000,50,1800,6.98,'2022-01-12 21:03:08','2022-01-12 21:03:11','2022-01-12 21:03:14','2022-01-12 19:01:45'),(3,2,3,NULL,NULL,NULL,3,24000,0,0,16.79,NULL,NULL,NULL,'2022-01-12 22:02:59'),(4,3,3,8,2,15,1,8000,50,1200,5.6,'2022-01-23 16:08:16','2022-01-23 16:09:42','2022-01-23 16:11:02','2022-01-23 15:23:09'),(5,3,17,3,2,NULL,4,10000,100,0,24.8,NULL,NULL,NULL,'2022-01-23 15:23:09');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `store_id` bigint(20) NOT NULL,
  `delivery_firm_id` bigint(20) DEFAULT NULL,
  `delivery_route_id` bigint(20) DEFAULT NULL,
  `customer_address_id` bigint(20) DEFAULT NULL,
  `number` varchar(50) NOT NULL,
  `status` enum('pending','processing','declined','cancelled','fulfilled') NOT NULL,
  `store_status` enum('pending','accepted','declined') NOT NULL,
  `delivery_firm_status` enum('pending','accepted','declined') DEFAULT NULL,
  `delivery_method` enum('door','store') NOT NULL,
  `payment_method` enum('cashless','cash') NOT NULL,
  `payment_status` enum('pending','approved','failed') DEFAULT NULL,
  `refund_status` enum('pending','approved','failed','declined','cancelled') DEFAULT NULL,
  `sub_total` double NOT NULL,
  `delivery_total` double NOT NULL,
  `discount_total` double NOT NULL,
  `note` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `store_id` (`store_id`),
  KEY `delivery_firm_id` (`delivery_firm_id`),
  KEY `customer_address_id` (`customer_address_id`),
  KEY `orders_ibfk_5` (`delivery_route_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`delivery_firm_id`) REFERENCES `delivery_firms` (`id`),
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`customer_address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`delivery_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,7,3,7,1,'0215876899','fulfilled','accepted','accepted','door','cashless','approved',NULL,15700,100,3140,'Add extra pepper to food','2022-01-12 19:01:44'),(2,1,7,NULL,NULL,NULL,'0670089684','fulfilled','pending',NULL,'store','cashless','approved','failed',24000,0,0,NULL,'2022-01-12 22:02:59'),(3,1,7,3,7,1,'9926222349','cancelled','accepted','accepted','door','cashless','approved','pending',18000,150,1200,'Add extra pepper to food','2022-01-23 15:23:09');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) DEFAULT NULL,
  `administrator_id` bigint(20) DEFAULT NULL,
  `token` varchar(50) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `administrator_id` (`administrator_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `password_resets_ibfk_2` FOREIGN KEY (`administrator_id`) REFERENCES `administrators` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES (1,1,NULL,'V3N856B3GN','2022-01-13 11:40:46','2022-01-13 11:25:46'),(2,1,NULL,'0PI8MMVLRM','2022-01-13 11:41:05','2022-01-13 11:26:05'),(3,1,NULL,'XNFUW9B0W3','2022-01-13 11:41:31','2022-01-13 11:26:31'),(6,NULL,1,'7AIXCS6E0M','2022-01-13 12:47:40','2022-01-13 12:32:40'),(7,NULL,6,'EQ6Z59N8WN','2022-01-13 12:47:43','2022-01-13 12:32:43'),(9,NULL,2,'MCKBQBLMTN','2022-01-23 14:49:48','2022-01-23 14:34:48'),(10,NULL,6,'DAJ2RGTWGC','2022-01-23 14:51:03','2022-01-23 14:36:03'),(11,NULL,1,'DFILSQWXF2','2022-01-23 14:53:52','2022-01-23 14:38:52');
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` double NOT NULL,
  `quantity` double NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT (true),
  `weight` double NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (2,7,'small',6500,20,1,2.56,'2022-01-23 12:44:01',NULL,'2021-12-27 21:10:07'),(3,8,'small',8000,2,1,5.6,'2022-01-23 15:53:16',NULL,'2021-12-27 21:27:40'),(4,8,'medium',10000,6,1,7.2,NULL,NULL,'2021-12-27 21:27:40'),(5,8,'large',15000,4,1,10.3,NULL,NULL,'2021-12-27 21:27:40'),(6,7,'large',12500,11,1,10.5,NULL,'2022-01-01 19:48:11','2021-12-27 22:39:59'),(7,9,'small plate',8000,3,1,5.6,NULL,NULL,'2021-12-29 02:38:24'),(8,9,'medium plate',10000,6,1,7.2,NULL,NULL,'2021-12-29 02:38:24'),(9,10,'small plate',7000,3,1,5.6,NULL,NULL,'2022-01-01 19:13:36'),(10,10,'medium plate',9500,6,1,7.2,NULL,NULL,'2022-01-01 19:13:36'),(11,7,'medium',9000,23,1,6.98,NULL,NULL,'2022-01-01 19:48:11'),(12,11,'small plate',8000,3,1,5.6,NULL,'2022-01-18 23:50:45','2022-01-01 19:55:23'),(13,11,'medium plate',10000,6,1,7.2,NULL,'2022-01-23 12:45:37','2022-01-01 19:55:23'),(14,7,'large',11000,11,1,9.32,NULL,'2022-01-04 18:40:45','2022-01-04 18:12:50'),(16,7,'large',1200,11,1,9.32,NULL,NULL,'2022-01-11 12:10:33'),(17,13,'small tin',2500,22,1,6.2,'2022-01-23 15:53:16',NULL,'2022-01-11 12:11:56'),(18,13,'large tin',5600,6,1,9.8,'2022-01-23 12:42:36',NULL,'2022-01-23 12:42:36');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_product_variants` BEFORE UPDATE ON `product_variants` FOR EACH ROW INSERT INTO product_variants_history SET 
  product_variant_id = OLD.id,
  `name` = OLD.name,
  `price` = OLD.price,
  `quantity` = OLD.quantity,
  available = OLD.available,
  weight = OLD.weight */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `product_variants_history`
--

DROP TABLE IF EXISTS `product_variants_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_variant_id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` double NOT NULL,
  `quantity` double NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT (true),
  `weight` double NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `product_variant_id` (`product_variant_id`),
  CONSTRAINT `product_variants_history_ibfk_1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants_history`
--

LOCK TABLES `product_variants_history` WRITE;
/*!40000 ALTER TABLE `product_variants_history` DISABLE KEYS */;
INSERT INTO `product_variants_history` VALUES (1,2,'small',6700,5,1,2.56,'2022-01-18 14:47:49'),(2,2,'smallf',6700,5,1,2.56,'2022-01-18 14:48:05'),(3,2,'small',6700,5,1,2.56,'2022-01-18 21:57:13'),(4,13,'medium plate',10000,6,1,7.2,'2022-01-18 23:41:46'),(5,12,'small plate',8000,3,1,5.6,'2022-01-18 23:41:46'),(6,12,'small plate',8000,3,1,5.6,'2022-01-18 22:42:42'),(7,13,'medium plate',10000,6,1,7.2,'2022-01-18 22:42:42'),(8,12,'small plate',8000,3,1,5.6,'2022-01-18 23:52:34'),(9,12,'small plate',8000,3,1,5.6,'2022-01-18 22:52:45'),(10,2,'small',6500,20,1,2.56,'2022-01-18 23:00:28'),(11,11,'medium',9000,23,1,6.98,'2022-01-18 23:00:28'),(12,16,'large',1200,11,1,9.32,'2022-01-18 23:00:28'),(13,2,'small',6500,20,1,2.56,'2022-01-19 00:02:44'),(14,16,'large',1200,11,1,9.32,'2022-01-19 00:02:44'),(15,11,'medium',9000,23,1,6.98,'2022-01-19 00:02:44'),(16,12,'small plate',8000,3,1,5.6,'2022-01-19 00:50:06'),(17,13,'medium plate',10000,6,1,7.2,'2022-01-19 00:50:06'),(18,12,'small plate',8000,3,1,5.6,'2022-01-18 23:50:45'),(19,13,'medium plate',10000,6,1,7.2,'2022-01-18 23:50:45'),(20,13,'medium plate',10000,6,1,7.2,'2022-01-19 00:59:42'),(21,13,'medium plate',10000,6,1,7.2,'2022-01-19 00:01:59'),(22,2,'small',6500,20,1,2.56,'2022-01-23 12:44:01'),(23,13,'medium plate',10000,6,1,7.2,'2022-01-23 13:44:43'),(24,13,'medium plate',10000,6,1,7.2,'2022-01-23 12:45:37'),(25,17,'small tin',2500,26,0,6.2,'2022-01-23 16:22:38'),(26,3,'small',8000,3,1,5.6,'2022-01-23 15:53:16'),(27,17,'small tin',2500,26,1,6.2,'2022-01-23 15:53:16');
/*!40000 ALTER TABLE `product_variants_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_id` bigint(20) NOT NULL,
  `sub_category_id` bigint(20) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `photo` varchar(50) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  KEY `sub_category_id` (`sub_category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (7,7,6,'Vanilla cake','It is very sweet with vanilla taste','UIDSHSDFKSD','product-7.jpg','2022-01-23 12:21:54',NULL,'2021-12-27 21:10:07'),(8,7,6,'strawberry cake','It is as sweet as strawberry','UIDSHSD334D',NULL,NULL,NULL,'2021-12-27 21:27:40'),(9,5,9,'Egusi and goat meat','Sweet soup','UIDSHSD334Q',NULL,NULL,NULL,'2021-12-29 02:38:24'),(10,5,9,'Egusi and Turkey meat','Sweet soup','UIDSHSD33AA',NULL,NULL,NULL,'2022-01-01 19:13:36'),(11,5,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,NULL,NULL,'2022-01-01 19:55:23'),(12,5,9,'Ofo soup','Sweet OFO soup','UIDSHSD3WAA',NULL,NULL,NULL,'2022-01-04 18:50:17'),(13,7,9,'Hot dog','Best hot dog in the state',NULL,NULL,'2022-01-18 21:53:59',NULL,'2022-01-11 11:48:36'),(14,7,9,'Egusi and turkey','Egusi soup with matured turkey meat.',NULL,NULL,'2022-01-23 12:19:29',NULL,'2022-01-19 17:08:50'),(15,7,13,'Red soap','It removes black spots',NULL,NULL,'2022-01-23 12:15:42','2022-01-23 12:26:26','2022-01-23 12:15:42');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_products` BEFORE UPDATE ON `products` FOR EACH ROW INSERT INTO products_history SET 
  product_id = OLD.id,
  `sub_category_id` = OLD.sub_category_id,
  `title` = OLD.title,
  `description` = OLD.description,
  code = OLD.code,
  photo = OLD.photo */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `products_history`
--

DROP TABLE IF EXISTS `products_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `sub_category_id` bigint(20) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `photo` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `products_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_history`
--

LOCK TABLES `products_history` WRITE;
/*!40000 ALTER TABLE `products_history` DISABLE KEYS */;
INSERT INTO `products_history` VALUES (1,7,6,'Vanilla cake pro','It is very sweet with vanilla taste','UIDSHSDFKSD','product-7.jpg','2022-01-18 14:45:15'),(2,13,9,'Hot dog','Best hot dog in town',NULL,NULL,'2022-01-18 21:53:59'),(3,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-18 23:41:57'),(4,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-18 22:42:42'),(5,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-18 23:43:23'),(6,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-18 22:43:40'),(7,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-18 23:48:02'),(8,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-18 22:52:45'),(9,7,6,'Vanilla cake','It is very sweet with vanilla taste','UIDSHSDFKSD','product-7.jpg','2022-01-18 23:00:28'),(10,7,6,'Vanilla cake','It is very sweet with vanilla taste','UIDSHSDFKSD','product-7.jpg','2022-01-19 00:01:46'),(11,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-19 00:50:18'),(12,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-18 23:50:45'),(13,11,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-19 01:01:55'),(14,14,9,'Pen','Pan vil ejnda; djdnfd ',NULL,NULL,'2022-01-23 12:19:08'),(15,14,9,'Egusi and turkey','Egusi soup with matured turkey meat.',NULL,NULL,'2022-01-23 12:19:29'),(16,7,6,'Vanilla cake','It is very sweet with vanilla taste','UIDSHSDFKSD','product-7.jpg','2022-01-23 12:21:54'),(17,15,13,'Red soap','It removes black spots',NULL,NULL,'2022-01-23 12:26:26');
/*!40000 ALTER TABLE `products_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `store_id` bigint(20) DEFAULT NULL,
  `delivery_firm_id` bigint(20) DEFAULT NULL,
  `rating` enum('1','2','3','4','5') NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`),
  KEY `store_id` (`store_id`),
  KEY `delivery_firm_id` (`delivery_firm_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`delivery_firm_id`) REFERENCES `delivery_firms` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (3,1,7,NULL,NULL,'4','Great product','2022-01-17 16:59:18'),(9,1,NULL,7,NULL,'5','Great store service','2022-01-23 17:09:39'),(10,1,NULL,NULL,3,'2','The delivery was not on time.','2022-01-23 17:11:58');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_cart_items`
--

DROP TABLE IF EXISTS `saved_cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `saved_cart_id` bigint(20) NOT NULL,
  `product_variant_id` bigint(20) NOT NULL,
  `quantity` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `saved_cart_id` (`saved_cart_id`),
  KEY `product_variant_id` (`product_variant_id`),
  CONSTRAINT `saved_cart_items_ibfk_1` FOREIGN KEY (`saved_cart_id`) REFERENCES `saved_carts` (`id`),
  CONSTRAINT `saved_cart_items_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_cart_items`
--

LOCK TABLES `saved_cart_items` WRITE;
/*!40000 ALTER TABLE `saved_cart_items` DISABLE KEYS */;
INSERT INTO `saved_cart_items` VALUES (1,2,9,4),(2,2,5,2),(6,4,2,42),(7,4,3,21),(8,4,8,10),(9,5,2,4),(10,5,3,2),(21,10,2,4),(22,10,3,2),(23,11,2,4),(24,11,3,2),(25,12,2,4),(26,12,3,2),(27,13,2,4),(28,13,3,2);
/*!40000 ALTER TABLE `saved_cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_carts`
--

DROP TABLE IF EXISTS `saved_carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `saved_carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_carts`
--

LOCK TABLES `saved_carts` WRITE;
/*!40000 ALTER TABLE `saved_carts` DISABLE KEYS */;
INSERT INTO `saved_carts` VALUES (2,1,'CARTF9CQY','Food stuffs','2022-01-02 23:56:38'),(4,1,'CARTXPHGH','Holiday package','2022-01-03 00:22:06'),(5,7,'CARTZ8CGF','Mr chuks package','2022-01-11 12:48:17'),(10,7,'CARTU8YWF','Lunch package','2022-01-23 21:03:08'),(11,7,'CARTYF2CC','Lunch package','2022-01-23 21:03:16'),(12,7,'CARTW74M4','Lunch package','2022-01-23 21:08:08'),(13,7,'CART8P5MC','Lunch package','2022-01-23 21:15:03');
/*!40000 ALTER TABLE `saved_carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `sub_category_id` bigint(20) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sub_category_id` (`sub_category_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stores_ibfk_2` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`),
  CONSTRAINT `stores_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (5,5,1,NULL),(6,6,2,NULL),(7,7,1,'2022-01-22 16:08:51'),(8,8,4,NULL),(9,15,4,NULL),(12,20,2,'2022-01-22 15:59:03');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_stores` BEFORE UPDATE ON `stores` FOR EACH ROW INSERT INTO stores_history SET 
  store_id = OLD.id,
  `sub_category_id` = OLD.sub_category_id */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `stores_history`
--

DROP TABLE IF EXISTS `stores_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_id` bigint(20) NOT NULL,
  `sub_category_id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `stores_history_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores_history`
--

LOCK TABLES `stores_history` WRITE;
/*!40000 ALTER TABLE `stores_history` DISABLE KEYS */;
INSERT INTO `stores_history` VALUES (1,5,1,'2022-01-18 22:46:02'),(2,5,3,'2022-01-18 22:46:02'),(3,7,1,'2022-01-18 22:46:02'),(4,7,1,'2022-01-18 21:48:01'),(5,7,1,'2022-01-22 16:08:51');
/*!40000 ALTER TABLE `stores_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `photo` varchar(50) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,1,'African kitchen',NULL,'Awesome african dishes','2021-12-25 13:44:32'),(2,2,'Longrich',NULL,NULL,'2021-12-25 13:45:52'),(3,2,'Fow-How',NULL,NULL,'2021-12-25 13:49:51'),(4,1,'Chinese restuarant',NULL,NULL,'2021-12-25 13:54:11'),(5,3,'Mini Mart','sub-category-5.jpg','Buy all you need','2021-12-25 13:55:11'),(6,6,'Cake',NULL,NULL,'2021-12-27 16:29:52'),(7,6,'Pizza',NULL,NULL,'2021-12-27 16:30:03'),(8,6,'Pie',NULL,NULL,'2021-12-27 16:30:24'),(9,7,'Egusi',NULL,NULL,'2021-12-27 16:30:37'),(10,7,'Okra',NULL,NULL,'2021-12-27 16:30:42'),(11,7,'Oha',NULL,NULL,'2021-12-27 16:30:48'),(12,7,'Banga',NULL,NULL,'2021-12-27 16:30:54'),(13,9,'Body cream',NULL,NULL,'2022-01-20 13:00:28'),(14,2,'Optometry',NULL,NULL,'2022-01-22 03:16:47');
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `application` tinyint(1) NOT NULL,
  `reference` varchar(50) NOT NULL,
  `status` enum('approved','pending','failed','cancelled','processing','declined') NOT NULL,
  `type` enum('payment','withdrawal','deposit','refund','income','charge') NOT NULL,
  `amount` double NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,1,0,'DNTX_1HQUU74ZX95NI1U','approved','payment',-12660,'2022-01-12 21:55:18'),(2,7,1,0,'DNTX_FTHLP4K57IN96RS','approved','income',12560,'2022-01-12 21:58:52'),(3,7,1,0,'DNTX_Y5EF2JIILL8RUSI','approved','charge',-1256,'2022-01-12 21:58:52'),(4,NULL,1,1,'DNTX_XJHN0XKG0FYGLME','approved','income',1256,'2022-01-12 21:58:52'),(5,11,1,0,'DNTX_FE4JZJQQXKHMB22','approved','income',100,'2022-01-12 21:58:52'),(6,11,1,0,'DNTX_NTQCDJ06VYU6ZRV','approved','charge',-5,'2022-01-12 21:58:52'),(7,NULL,1,1,'DNTX_J7HQ8AE2RP0X3H5','approved','income',5,'2022-01-12 21:58:52'),(8,1,2,0,'DNTX_2LMXPMAWL76GVUV','approved','payment',-24000,'2022-01-12 23:01:33'),(9,1,2,0,'DNTX_0PIU4BFB8Y613ZA','declined','refund',24000,'2022-01-12 23:14:34'),(11,7,NULL,0,'DNTX_HVXC7TK1AUL19RB','declined','withdrawal',-5000,'2022-01-12 23:42:16'),(12,1,2,0,'DNTX_L2VESWTD2OCMOI3','failed','refund',24000,'2022-01-13 09:20:13'),(13,1,3,0,'DNTX_73PYKOSF52E9L9F','pending','payment',-16950,'2022-01-23 16:21:45'),(14,1,3,0,'DNTX_W6G03OQEPGRPIQZ','pending','refund',16950,'2022-01-23 16:32:05'),(15,7,NULL,0,'DNTX_ANOZ9J5R6TUCQSL','declined','withdrawal',-5000,'2022-01-23 16:39:27');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` enum('customer','store','delivery_firm') NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `photo` varchar(50) DEFAULT NULL,
  `status` enum('active','activating','deactivated') NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'customer','Jasper Anelechukwu','jasperanels@gmail.com','08048490901','customer-1.jpg','active','2022-01-23 22:26:39','2021-12-23 10:17:39'),(2,'customer','Richard Chukwu','richchuks@gmail.com','09039283744',NULL,'active',NULL,'2021-12-23 12:08:02'),(3,'customer','Fred Cake','cakefred@yahoo.com','08038476211',NULL,'active',NULL,'2021-12-25 15:31:20'),(4,'customer','White Black','wb@yahoo.com','07083745655',NULL,'active',NULL,'2021-12-25 15:34:59'),(5,'store','Yam zone','yamzone@gmail.com','09183571123',NULL,'activating',NULL,'2021-12-25 21:42:25'),(6,'store','Get-well','wellhealth@gmail.com','08187347666',NULL,'activating',NULL,'2021-12-25 21:51:35'),(7,'store','Shoppa','shoppax@gmail.com','08084837423','store-7.jpeg','active','2022-01-22 16:11:05','2021-12-25 22:13:26'),(8,'store','HappyBite','jasperanels@gmail.com','07094823744',NULL,'activating','2022-01-22 16:22:39','2021-12-26 12:17:21'),(9,'delivery_firm','Freeway logistics','freeway@gmail.com','09023839393',NULL,'active',NULL,'2021-12-27 23:54:52'),(10,'delivery_firm','Fast track delivery','fasttrack@gmail.com','09023839390',NULL,'activating','2022-01-23 11:52:07','2021-12-27 23:56:01'),(11,'delivery_firm','All round logistics','allroundlogistics@gmail.com','08039457321','delivery-firm-3.jpg','active','2022-01-23 11:52:17','2021-12-27 23:57:18'),(14,'customer','Husk Blue','huskb@ygmail.com','09093838722',NULL,'active',NULL,'2021-12-29 20:46:07'),(15,'store','Gray Foods','grayfoods@gmail.com','09048473888',NULL,'activating',NULL,'2021-12-29 20:55:47'),(16,'customer','Bullet Gun','bulletgun@ygmail.com','09093838790',NULL,'active','2022-01-20 17:49:57','2022-01-20 17:49:57'),(17,'customer','Round Ball','roundball@ygmail.com','09093838721',NULL,'active','2022-01-21 18:12:32','2022-01-21 18:12:33'),(20,'store','Black health','blackhealth@gmail.com','09048473881',NULL,'activating','2022-01-22 15:59:03','2022-01-22 15:59:03'),(21,'delivery_firm','Real roads','realroadsdelivery@gmail.com','09023839311',NULL,'activating','2022-01-22 18:00:27','2022-01-22 18:00:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_update_users` BEFORE UPDATE ON `users` FOR EACH ROW INSERT INTO users_history SET 
  user_id = OLD.id,
  `type` = OLD.type,
  `name` = OLD.name,
  `email` = OLD.email,
  `phone_number` = OLD.phone_number,
  `photo`= OLD.photo,
  status = OLD.status */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users_history`
--

DROP TABLE IF EXISTS `users_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `type` enum('customer','store','delivery_firm') NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `photo` varchar(50) DEFAULT NULL,
  `status` enum('active','activating','deactivated') NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `users_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_history`
--

LOCK TABLES `users_history` WRITE;
/*!40000 ALTER TABLE `users_history` DISABLE KEYS */;
INSERT INTO `users_history` VALUES (1,15,'store','Gray Foods','grayfoods@gmail.com','09048473888',NULL,'activating','2022-01-18 13:53:10'),(2,15,'store','Gray Foodsx','grayfoods@gmail.com','09048473888',NULL,'activating','2022-01-18 13:53:28'),(3,1,'customer','Jasper Anelechukwu','jasperanels@gmail.com','08048490901','user-1.jpg','active','2022-01-18 21:42:42'),(4,1,'customer','Jaspe Anelechukwu','jasperanels@gmail.com','08048490901','user-1.jpg','active','2022-01-18 21:43:46'),(5,7,'store','Shoppa','shoppax@gmail.com','08084837423','user-7.jpeg','active','2022-01-18 21:44:29'),(6,7,'store','Shoppas','shoppax@gmail.com','08084837423','user-7.jpeg','active','2022-01-18 21:48:01'),(7,1,'customer','Jasper Anelechukwu','jasperanels@gmail.com','08048490901','user-1.jpg','active','2022-01-19 17:29:09'),(8,1,'customer','Jasp Anelechukwu','jasperanels@gmail.com','08048490901','user-1.jpg','active','2022-01-20 11:26:07'),(9,1,'customer','Jaspx Anelechukwu','jasperanels@gmail.com','08048490901','user-1.jpg','active','2022-01-21 18:17:15'),(10,1,'customer','Jasper Anelechukwu','jasperanels@gmail.com','08048490901','user-1.jpg','active','2022-01-21 18:27:49'),(11,1,'customer','Jasper Anelechukwu','jasperanels@gmail.com','08048490901','customer-1.jpg','active','2022-01-21 18:48:47'),(12,7,'store','Shoppa','shoppax@gmail.com','08084837423','user-7.jpeg','active','2022-01-22 16:08:51'),(13,7,'store','Shoppa','shoppax@gmail.com','08084837423','user-7.jpeg','active','2022-01-22 16:11:05'),(14,8,'store','HappyBite','jasperanels@gmail.com','07094823744',NULL,'activating','2022-01-22 16:22:39'),(15,11,'delivery_firm','All round logistics','allroundlogistics@gmail.com','08039457321','delivery-firm-3.jpg','active','2022-01-22 18:21:55'),(16,11,'delivery_firm','All round logistics','allroundlogistics@gmail.com','08039457321','delivery-firm-3.jpg','active','2022-01-22 18:23:30'),(17,10,'delivery_firm','Fast track delivery','fasttrack@gmail.com','09023839390',NULL,'activating','2022-01-23 11:52:07'),(18,11,'delivery_firm','All round logistics','allroundlogistics@gmail.com','08039457321','delivery-firm-3.jpg','active','2022-01-23 11:52:17'),(19,1,'customer','Jasper Anelechukwu','jasperanels@gmail.com','08048490901','customer-1.jpg','active','2022-01-23 22:26:39');
/*!40000 ALTER TABLE `users_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawal_accounts`
--

DROP TABLE IF EXISTS `withdrawal_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawal_accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `paystack_recipient_code` varchar(50) NOT NULL,
  `bank_name` varchar(50) NOT NULL,
  `account_name` varchar(50) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `account_type` enum('savings','current') NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `withdrawal_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_accounts`
--

LOCK TABLES `withdrawal_accounts` WRITE;
/*!40000 ALTER TABLE `withdrawal_accounts` DISABLE KEYS */;
INSERT INTO `withdrawal_accounts` VALUES (1,7,'RCP_s1ucx6j7pyp5sgf','Union Bank of Nigeria','Anelechukwu Jasper','0055107074','savings','2021-12-27 15:42:02'),(2,11,'RCP_s1ucx6j7pyp5sgf','Union Bank of Nigeria','Jasper Anelechukwu','0055107074','savings','2021-12-29 01:25:33'),(3,1,'RCP_s1ucx6j7pyp5sgf','Union Bank of Nigeria','Jasper Anelechukwu','0055107074','savings','2022-01-10 22:24:59');
/*!40000 ALTER TABLE `withdrawal_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `working_hours`
--

DROP TABLE IF EXISTS `working_hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `working_hours` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `day` enum('sunday','monday','tuesday','wednesday','thursday','friday','saturday') NOT NULL,
  `opening` time NOT NULL,
  `closing` time NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `working_hours_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `working_hours`
--

LOCK TABLES `working_hours` WRITE;
/*!40000 ALTER TABLE `working_hours` DISABLE KEYS */;
INSERT INTO `working_hours` VALUES (1,7,'monday','08:00:00','18:00:00','2021-12-26 22:57:23'),(8,7,'tuesday','08:00:00','18:00:00','2021-12-27 14:11:24'),(14,9,'monday','07:00:00','22:00:00','2022-01-06 14:11:52'),(15,9,'wednesday','07:00:00','22:00:00','2022-01-06 14:11:52'),(16,9,'saturday','07:00:00','22:00:00','2022-01-06 14:11:52'),(17,7,'wednesday','08:00:00','15:00:00','2022-01-22 16:18:20'),(18,11,'monday','07:00:00','22:00:00','2022-01-23 11:39:51'),(19,11,'wednesday','07:00:00','22:00:00','2022-01-23 11:39:51'),(20,11,'saturday','07:00:00','22:00:00','2022-01-23 11:39:51');
/*!40000 ALTER TABLE `working_hours` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-25 13:44:32
