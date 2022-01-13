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
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'Home address','45 young street','Owerri-West','Imo','sub','2021-12-23 23:22:06'),(2,1,'Office address','3 Paul street','Owerri','Imo State','sub','2021-12-24 00:05:27'),(3,2,'Main','39 Black road','Ihiagwa-Owerri','Imo State','sub','2021-12-24 11:58:49'),(4,2,'Office address','44 Okey street','Control-Owerri','Imo State','default','2021-12-25 15:29:45'),(5,3,'Home address','2 Buns street','Rumuola','Rivers State','default','2021-12-25 15:35:57'),(6,7,NULL,'2 Ben street','Orlu','Imo','default','2021-12-26 14:44:25'),(7,11,NULL,'50 dead road','Owerri-Mbaise','Imo State','default','2021-12-29 00:56:16'),(8,3,'School address','3 Meat lodge','Oyigbo','Rivers','sub','2021-12-29 22:43:07'),(9,9,NULL,'10 Sam street, Dog Road','Owerri-North','Imo','default','2022-01-06 14:10:37'),(10,1,'School address','3 Meat lodge','Oyigbo','Rivers','default','2022-01-11 00:30:40');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` VALUES (1,1,NULL,NULL,'application','super','$2b$10$E2LXGMQMuHQmE4OTPY6lquUf6xVZ4qBqdMyaOzYS4iRavOKhkuM8S','active','2021-12-24 22:14:55'),(2,1,5,NULL,'store','super','$2b$10$Xbul6AL3nGYz6sX/JG03QOoxtmMHgnJiZVy4dUbdxExOG0Kr13OcK','active','2021-12-25 21:42:25'),(3,1,6,NULL,'store','super','$2b$10$kdtvS20kbye2lDfjuhZKs.cG2wyiId8k2ayjChJ5G1LI//q376Uhu','active','2021-12-25 21:51:36'),(4,3,7,NULL,'store','super','$2b$10$8TD2xeBQHdv.fjTjdd4whOelCpYOLRNjwylp5tBaSOklLkx6mGO.K','active','2021-12-25 22:13:27'),(5,1,8,NULL,'store','super','$2b$10$LOTty18MOc/M4ewNX6/TG.t9HniE9szAUwR9ZKeCCyVK4ijYdk0hC','active','2021-12-26 12:17:22'),(6,4,NULL,1,'delivery_firm','super','$2b$10$.zxUpAXPBFXJnDH3EQ81W.YyT/mafZqj43gCu8vMyjFw8oN/iGUzO','active','2021-12-27 23:54:52'),(7,4,NULL,2,'delivery_firm','super','$2b$10$uTtRLUH7AsAvWeI.adIYJ.J7inlfBW4SEs6WubI4tdqhi4RqQkXWC','active','2021-12-27 23:56:01'),(8,4,NULL,3,'delivery_firm','super','$2b$10$IM57/8CYvwEu0ptc2owHSur6jHQSWhSWhPnae1SiKxBnOyNBaAamC','active','2021-12-27 23:57:18'),(9,1,9,NULL,'store','super','$2b$10$MXTtWeIBR1DD9r8uD7cTb.sdpAzGaEmcT7n.ld1WCETXpfjCVaoZ.','active','2021-12-29 20:55:47');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'store','Restuarant','category-1.jpg','Stores to get food','2021-12-25 05:06:21'),(2,'store','Pharmacy',NULL,'Stores to get medicine','2021-12-25 05:07:16'),(3,'store','Supermarket',NULL,'Stores to get other items','2021-12-25 07:43:22'),(4,'store','Snack',NULL,'Stores to get snacks','2021-12-25 07:44:14'),(5,'store','Botique',NULL,'Stores to get clothings','2021-12-25 07:44:35'),(6,'product','Snacks',NULL,'Sweet foods','2021-12-25 15:38:04'),(7,'product','Soup',NULL,'Nice soups','2021-12-27 17:27:39'),(8,'product','Rice',NULL,'All kinds of rice','2021-12-27 16:28:09'),(9,'product','Skin care',NULL,'Get the best for your skin','2021-12-27 16:28:46'),(10,'product','Drinks',NULL,'Tasty drinks','2021-12-27 16:29:12');
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
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'Jasper','Anelechukwu','$2b$10$30mKxCxOCMlcuJw7KfG2GuHe4PuHi5CDRga6B1aLewee8rDuuxJnC'),(2,2,'Richard','Chukwu','$2b$10$aXuVPBNUdvqlm6fGpfjYNOqn.um0K2oXXu7a5UqRc2Vioa/d9NfRO'),(3,3,'Fred','Cake','$2b$10$zkl9QtVS2Z8ZSayGmByLY.UlHC1DMEx9AGZv4XR/ydpMpKlVOoAZm'),(4,4,'White','Black','$2b$10$atK.zjusD8vdZB7B2pBsBOq58muLRqIEiPOmf4z0Ynnj4Ka576fwK'),(7,14,'Husk','Blue','$2b$10$Nma.peF34.cXoXH/um.M6eLNxxzHK1puA5EO6N5PWenGSGNJmNI6i');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_firms`
--

LOCK TABLES `delivery_firms` WRITE;
/*!40000 ALTER TABLE `delivery_firms` DISABLE KEYS */;
INSERT INTO `delivery_firms` VALUES (1,9),(2,10),(3,11);
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
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_route_durations_ibfk_1` (`delivery_route_id`),
  CONSTRAINT `delivery_route_durations_ibfk_1` FOREIGN KEY (`delivery_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_route_durations`
--

LOCK TABLES `delivery_route_durations` WRITE;
/*!40000 ALTER TABLE `delivery_route_durations` DISABLE KEYS */;
INSERT INTO `delivery_route_durations` VALUES (1,1,1,3,0,'day',NULL,'2022-01-11 20:51:33'),(2,7,4,5,0,'day',NULL,'2022-01-12 10:22:34'),(3,7,2,3,50,'day',NULL,'2022-01-12 10:23:01'),(4,4,1,3,100,'day',NULL,'2022-01-12 10:23:17'),(5,4,1,2,0,'week',NULL,'2022-01-12 10:23:36'),(6,8,1,2,0,'day',NULL,'2022-01-12 10:32:58'),(7,9,1,4,0,'day',NULL,'2022-01-12 10:33:34'),(8,10,1,4,0,'day',NULL,'2022-01-12 10:34:50');
/*!40000 ALTER TABLE `delivery_route_durations` ENABLE KEYS */;
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
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_route_weights_ibfk_1` (`delivery_route_id`),
  CONSTRAINT `delivery_route_weights_ibfk_1` FOREIGN KEY (`delivery_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_route_weights`
--

LOCK TABLES `delivery_route_weights` WRITE;
/*!40000 ALTER TABLE `delivery_route_weights` DISABLE KEYS */;
INSERT INTO `delivery_route_weights` VALUES (1,1,5,50,100,NULL,'2022-01-11 20:26:35'),(2,1,51,100,250,NULL,'2022-01-11 20:27:52'),(3,7,10,30,100,NULL,'2022-01-12 10:17:51'),(4,7,35,80,200,NULL,'2022-01-12 10:18:22'),(5,7,90,250,450,NULL,'2022-01-12 10:21:10'),(6,4,1,20,50,NULL,'2022-01-12 10:21:54'),(7,4,21,45,150,NULL,'2022-01-12 10:22:06'),(8,7,2,9,50,NULL,'2022-01-12 10:28:33'),(9,8,1,10,50,NULL,'2022-01-12 10:32:38'),(10,9,4,10,80,NULL,'2022-01-12 10:34:05'),(11,9,5,20,150,NULL,'2022-01-12 10:35:11'),(12,9,25,60,300,NULL,'2022-01-12 10:35:25'),(13,10,5,20,100,NULL,'2022-01-12 10:39:45');
/*!40000 ALTER TABLE `delivery_route_weights` ENABLE KEYS */;
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
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `delivery_firm_id` (`delivery_firm_id`),
  KEY `origin_route_id` (`origin_route_id`),
  KEY `destination_route_id` (`destination_route_id`),
  CONSTRAINT `delivery_routes_ibfk_1` FOREIGN KEY (`delivery_firm_id`) REFERENCES `delivery_firms` (`id`),
  CONSTRAINT `delivery_routes_ibfk_2` FOREIGN KEY (`origin_route_id`) REFERENCES `delivery_routes` (`id`),
  CONSTRAINT `delivery_routes_ibfk_3` FOREIGN KEY (`destination_route_id`) REFERENCES `delivery_routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_routes`
--

LOCK TABLES `delivery_routes` WRITE;
/*!40000 ALTER TABLE `delivery_routes` DISABLE KEYS */;
INSERT INTO `delivery_routes` VALUES (1,3,NULL,NULL,'Abia','Aba North',1,NULL,'2022-01-11 13:41:33'),(2,3,NULL,NULL,'Imo','Owerri-North',1,NULL,'2022-01-11 23:12:43'),(3,3,NULL,NULL,'Imo','Owerri-West',1,NULL,'2022-01-11 23:12:54'),(4,3,NULL,NULL,'Imo','Orlu',1,NULL,'2022-01-11 23:13:01'),(7,3,3,4,NULL,NULL,NULL,NULL,'2022-01-12 08:57:07'),(8,1,NULL,NULL,'Imo','Owerri-West',1,NULL,'2022-01-12 10:32:10'),(9,1,NULL,NULL,'Imo','Orlu',0,NULL,'2022-01-12 10:33:22'),(10,1,8,9,NULL,NULL,NULL,NULL,'2022-01-12 10:34:29');
/*!40000 ALTER TABLE `delivery_routes` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_products`
--

LOCK TABLES `discount_products` WRITE;
/*!40000 ALTER TABLE `discount_products` DISABLE KEYS */;
INSERT INTO `discount_products` VALUES (1,5,9,NULL,'2022-01-04 01:14:16'),(2,5,10,NULL,'2022-01-04 01:14:16'),(4,7,11,NULL,'2022-01-04 10:55:51'),(5,7,9,'2022-01-04 12:50:32','2022-01-04 12:45:33'),(6,5,11,NULL,'2022-01-04 22:17:22'),(7,8,7,NULL,'2022-01-06 16:36:57'),(8,8,8,NULL,'2022-01-07 23:50:03'),(9,9,13,NULL,'2022-01-11 21:44:18'),(10,9,7,NULL,'2022-01-11 21:44:32');
/*!40000 ALTER TABLE `discount_products` ENABLE KEYS */;
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
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
INSERT INTO `discounts` VALUES (5,5,'New year bonanza','percentage',10,3500,10,'2022-01-06 08:00:00','2022-01-20 08:00:00',NULL,'2022-01-04 01:14:16'),(7,5,'Eat off','percentage',10,NULL,2,'2022-01-07 08:00:00','2022-01-12 22:00:00',NULL,'2022-01-04 10:55:51'),(8,7,'Flip meal','amount',5,5000,NULL,'2022-01-05 08:00:00','2022-01-10 11:00:00',NULL,'2022-01-04 22:56:36'),(9,7,'January savers','percentage',20,NULL,2,'2022-01-12 08:00:00','2022-01-20 11:00:00',NULL,'2022-01-11 21:10:39');
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,9,1,'2022-01-01 23:43:18'),(3,7,1,'2022-01-01 23:50:04'),(6,11,1,'2022-01-02 00:04:11'),(8,13,1,'2022-01-11 12:29:47');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,2,8,2,10,1,6700,50,1340,2.56,'2022-01-12 20:57:51','2022-01-12 21:00:57','2022-01-12 21:02:43','2022-01-12 19:01:45'),(2,1,11,8,2,10,1,9000,50,1800,6.98,'2022-01-12 21:03:08','2022-01-12 21:03:11','2022-01-12 21:03:14','2022-01-12 19:01:45'),(3,2,3,NULL,NULL,NULL,3,24000,0,0,16.799999999999997,NULL,NULL,NULL,'2022-01-12 22:02:59');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,7,3,7,1,'0215876899','processing','accepted','accepted','door','cashless','approved',NULL,15700,100,3140,'Add extra pepper to food','2022-01-12 19:01:44'),(2,1,7,NULL,NULL,NULL,'0670089684','cancelled','pending',NULL,'store','cashless','approved','failed',24000,0,0,NULL,'2022-01-12 22:02:59');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES (1,1,NULL,'V3N856B3GN','2022-01-13 11:40:46','2022-01-13 11:25:46'),(2,1,NULL,'0PI8MMVLRM','2022-01-13 11:41:05','2022-01-13 11:26:05'),(3,1,NULL,'XNFUW9B0W3','2022-01-13 11:41:31','2022-01-13 11:26:31'),(6,NULL,1,'7AIXCS6E0M','2022-01-13 12:47:40','2022-01-13 12:32:40'),(7,NULL,6,'EQ6Z59N8WN','2022-01-13 12:47:43','2022-01-13 12:32:43');
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
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (2,7,'small',6700,5,1,2.56,NULL,'2021-12-27 21:10:07'),(3,8,'small',8000,3,1,5.6,NULL,'2021-12-27 21:27:40'),(4,8,'medium',10000,6,1,7.2,NULL,'2021-12-27 21:27:40'),(5,8,'large',15000,4,1,10.3,NULL,'2021-12-27 21:27:40'),(6,7,'large',12500,11,1,10.5,'2022-01-01 19:48:11','2021-12-27 22:39:59'),(7,9,'small plate',8000,3,1,5.6,NULL,'2021-12-29 02:38:24'),(8,9,'medium plate',10000,6,1,7.2,NULL,'2021-12-29 02:38:24'),(9,10,'small plate',7000,3,1,5.6,NULL,'2022-01-01 19:13:36'),(10,10,'medium plate',9500,6,1,7.2,NULL,'2022-01-01 19:13:36'),(11,7,'medium',9000,23,1,6.98,NULL,'2022-01-01 19:48:11'),(12,11,'small plate',8000,3,1,5.6,'2022-01-01 20:08:10','2022-01-01 19:55:23'),(13,11,'medium plate',10000,6,1,7.2,'2022-01-01 20:08:10','2022-01-01 19:55:23'),(14,7,'large',11000,11,1,9.32,'2022-01-04 18:40:45','2022-01-04 18:12:50'),(16,7,'large',1200,11,1,9.32,NULL,'2022-01-11 12:10:33'),(17,13,'small tin',2500,26,0,6.2,NULL,'2022-01-11 12:11:56');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
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
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  KEY `sub_category_id` (`sub_category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (7,7,6,'Vanilla cake pro','It is very sweet with vanilla taste','UIDSHSDFKSD','product-7.jpg',NULL,'2021-12-27 21:10:07'),(8,7,6,'strawberry cake','It is as sweet as strawberry','UIDSHSD334D',NULL,NULL,'2021-12-27 21:27:40'),(9,5,9,'Egusi and goat meat','Sweet soup','UIDSHSD334Q',NULL,NULL,'2021-12-29 02:38:24'),(10,5,9,'Egusi and Turkey meat','Sweet soup','UIDSHSD33AA',NULL,NULL,'2022-01-01 19:13:36'),(11,5,9,'Okra','Sweet soup','UIDSHSD3WQA',NULL,'2022-01-01 20:08:10','2022-01-01 19:55:23'),(12,5,9,'Ofo soup','Sweet OFO soup','UIDSHSD3WAA',NULL,NULL,'2022-01-04 18:50:17'),(13,7,9,'Hot dog','Best hot dog in town',NULL,NULL,NULL,'2022-01-11 11:48:36');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_cart_items`
--

LOCK TABLES `saved_cart_items` WRITE;
/*!40000 ALTER TABLE `saved_cart_items` DISABLE KEYS */;
INSERT INTO `saved_cart_items` VALUES (1,2,9,4),(2,2,5,2),(6,4,2,42),(7,4,3,21),(8,4,8,10),(9,5,2,4),(10,5,3,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_carts`
--

LOCK TABLES `saved_carts` WRITE;
/*!40000 ALTER TABLE `saved_carts` DISABLE KEYS */;
INSERT INTO `saved_carts` VALUES (2,1,'CARTF9CQY','Food stuffs','2022-01-02 23:56:38'),(4,1,'CARTXPHGH','Holiday package','2022-01-03 00:22:06'),(5,7,'CARTZ8CGF','Mr chuks package','2022-01-11 12:48:17');
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
  PRIMARY KEY (`id`),
  KEY `sub_category_id` (`sub_category_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stores_ibfk_2` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`),
  CONSTRAINT `stores_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (5,5,1),(6,6,2),(7,7,1),(8,8,4),(9,15,4);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,1,'African kitchen',NULL,NULL,'2021-12-25 13:44:32'),(2,2,'Longrich',NULL,NULL,'2021-12-25 13:45:52'),(3,2,'Fow-How',NULL,NULL,'2021-12-25 13:49:51'),(4,1,'Chinese restuarant',NULL,NULL,'2021-12-25 13:54:11'),(5,3,'Mini Mart','sub-category-5.jpg','Buy all you need','2021-12-25 13:55:11'),(6,6,'Cake',NULL,NULL,'2021-12-27 16:29:52'),(7,6,'Pizza',NULL,NULL,'2021-12-27 16:30:03'),(8,6,'Pie',NULL,NULL,'2021-12-27 16:30:24'),(9,7,'Egusi',NULL,NULL,'2021-12-27 16:30:37'),(10,7,'Okra',NULL,NULL,'2021-12-27 16:30:42'),(11,7,'Oha',NULL,NULL,'2021-12-27 16:30:48'),(12,7,'Banga',NULL,NULL,'2021-12-27 16:30:54');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,1,0,'DNTX_1HQUU74ZX95NI1U','approved','payment',-12660,'2022-01-12 21:55:18'),(2,7,1,0,'DNTX_FTHLP4K57IN96RS','approved','income',12560,'2022-01-12 21:58:52'),(3,7,1,0,'DNTX_Y5EF2JIILL8RUSI','approved','charge',-1256,'2022-01-12 21:58:52'),(4,NULL,1,1,'DNTX_XJHN0XKG0FYGLME','approved','income',1256,'2022-01-12 21:58:52'),(5,11,1,0,'DNTX_FE4JZJQQXKHMB22','approved','income',100,'2022-01-12 21:58:52'),(6,11,1,0,'DNTX_NTQCDJ06VYU6ZRV','approved','charge',-5,'2022-01-12 21:58:52'),(7,NULL,1,1,'DNTX_J7HQ8AE2RP0X3H5','approved','income',5,'2022-01-12 21:58:52'),(8,1,2,0,'DNTX_2LMXPMAWL76GVUV','approved','payment',-24000,'2022-01-12 23:01:33'),(9,1,2,0,'DNTX_0PIU4BFB8Y613ZA','declined','refund',24000,'2022-01-12 23:14:34'),(11,7,NULL,0,'DNTX_HVXC7TK1AUL19RB','declined','withdrawal',-5000,'2022-01-12 23:42:16'),(12,1,2,0,'DNTX_L2VESWTD2OCMOI3','failed','refund',24000,'2022-01-13 09:20:13');
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
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'customer','Jasper Anelechukwu','jasperanels@gmail.com','08048490901','user-1.jpg','active','2021-12-23 10:17:39'),(2,'customer','Richard Chukwu','richchuks@gmail.com','09039283744',NULL,'active','2021-12-23 12:08:02'),(3,'customer','Fred Cake','cakefred@yahoo.com','08038476211',NULL,'active','2021-12-25 15:31:20'),(4,'customer','White Black','wb@yahoo.com','07083745655',NULL,'active','2021-12-25 15:34:59'),(5,'store','Yam zone','yamzone@gmail.com','09183571123',NULL,'activating','2021-12-25 21:42:25'),(6,'store','Get-well','wellhealth@gmail.com','08187347666',NULL,'activating','2021-12-25 21:51:35'),(7,'store','Shoppa','shoppax@gmail.com','08084837423','user-7.jpeg','active','2021-12-25 22:13:26'),(8,'store','HappyBite','jasperanels@gmail.com','07094823744',NULL,'activating','2021-12-26 12:17:21'),(9,'delivery_firm','Freeway logistics','freeway@gmail.com','09023839393',NULL,'active','2021-12-27 23:54:52'),(10,'delivery_firm','Fast track delivery','fasttrack@gmail.com','09023839390',NULL,'activating','2021-12-27 23:56:01'),(11,'delivery_firm','All round logistics','allroundlogistics@gmail.com','08039457321','delivery-firm-3.jpg','active','2021-12-27 23:57:18'),(14,'customer','Husk Blue','huskb@ygmail.com','09093838722',NULL,'active','2021-12-29 20:46:07'),(15,'store','Gray Foods','grayfoods@gmail.com','09048473888',NULL,'activating','2021-12-29 20:55:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
  `account_type` varchar(50) NOT NULL,
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
INSERT INTO `withdrawal_accounts` VALUES (1,7,'ldsjoifdjfoi','union bank','Freddrick','0055907456','savings','2021-12-27 15:42:02'),(2,11,'oijiwoijenwls','access bank','All round ltd','0055907432','current','2021-12-29 01:25:33'),(3,1,'iowejfwofjsdo','gtbank','Jasper Anelechukwu','0055907484','savings','2022-01-10 22:24:59');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `working_hours`
--

LOCK TABLES `working_hours` WRITE;
/*!40000 ALTER TABLE `working_hours` DISABLE KEYS */;
INSERT INTO `working_hours` VALUES (1,7,'monday','08:00:00','18:00:00','2021-12-26 22:57:23'),(8,7,'tuesday','08:00:00','18:00:00','2021-12-27 14:11:24'),(9,11,'monday','07:00:00','22:00:00','2021-12-29 01:17:44'),(13,7,'wednesday','08:00:00','15:00:00','2022-01-01 22:13:55'),(14,9,'monday','07:00:00','22:00:00','2022-01-06 14:11:52'),(15,9,'wednesday','07:00:00','22:00:00','2022-01-06 14:11:52'),(16,9,'saturday','07:00:00','22:00:00','2022-01-06 14:11:52');
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

-- Dump completed on 2022-01-13 13:36:00
