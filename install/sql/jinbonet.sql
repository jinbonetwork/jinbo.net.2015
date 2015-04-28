DROP TABLE IF EXISTS `jinbo_section`;
CREATE TABLE `jinbo_section` (
	id			int(10) not null primary key auto_increment,
	section		char(80) not null default '',
	component	char(128) not null default '',
	content		mediumtext not null default '',
	modified	int(10) not null default 0,

	KEY `SECTION` (`section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
