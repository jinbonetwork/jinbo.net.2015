DROP TABLE IF EXISTS `jinbo_section`;
CREATE TABLE `jinbo_section` (
	version		int(10) not null primary key auto_increment,
	data		mediumtext not null default ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `jinbo_section` (data) VALUES (''); 

DROP TABLE IF EXISTS `jinbo_item`;
CREATE TABLE `jinbo_item` (
	version		int(10) not null primary key auto_increment,
	data		mediumtext not null default ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `jinbo_item` (data) VALUES (''); 
