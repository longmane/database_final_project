/* This script was used to prepopulate the tables in the database with values */

INSERT INTO VLAN (id, name, secLevel)
VALUES 	("0070", "it_range", "1"),
		("0010", "exec_range", "0"),
		("0020", "engr_range", "0"),
		("0030", "acct_range", "1"),
		("0040", "sales_range", "0");

INSERT INTO Department (id, name, location, vlanID)
VALUES 	("007", "IT", "Basement Floor", "0070"),
		("001", "Executive", "8th Floor", "0010"),
		("002", "Engineering", "4th Floor", "0020"),
		("003", "Accounting", "3rd Floor", "0030"),
		("004", "Sales", "5th Floor", "0040");


INSERT INTO `IP Range` (id, network, size, DHCPEn, vlanID)
VALUES 	("0071", "10.240.1.0", "255.255.255.128", "1", "0070"),
		("0072", "10.240.2.0", "255.255.255.0", "0", "0070"),
		("0011", "10.240.3.0", "255.255.255.128", "1", "0010"),
		("0012", "10.240.4.0", "255.255.255.0", "0", "0010"),
		("0021", "128.193.24.0", "255.255.255.128", "1", "0020"),
		("0022", "128.193.25.0", "255.255.255.0", "0", "0020"),
		("0031", "10.240.30.0", "255.255.255.128", "1", "0030"),
		("0032", "10.240.31.0", "255.255.255.0", "0", "0030"),
		("0041", "10.240.50.0", "255.255.255.128", "1", "0040"),
		("0042", "10.240.51.0", "255.255.255.0", "0", "0040");

INSERT INTO `IP Address` (address, rangeID, DNSEn)
VALUES 	("10.240.1.1", "0071", "1"),
		("10.240.1.2", "0071", "1"),
		("10.240.3.5", "0011", "1"),
		("10.240.4.3", "0012", "0"),
		("128.193.24.4", "0021", "1"),
		("128.193.25.23", "0022", "0"),
		("128.193.25.22", "0022", "1"),
		("10.240.30.9", "0031", "1"),
		("10.240.31.34", "0032", "0"),
		("10.240.50.50", "0041", "1"),
		("10.240.51.52", "0042", "0");

INSERT INTO Employee (id, username, deptID, name, isAdmin)
VALUES	("99775", "longmane", "007", "Emily Longman", "1"),
		("99420", "schmidtm", "007", "Max Schmidt", "1"),
		("34018", "instructor", "001", "Barry Good", "1"),
		("34000", "freemang", "002", "Gordon Freeman", "0"),
		("34001", "glados", "003", "Sabine Glado", "0"),
		("35802", "arans", "004", "Samus Aran", "0");

INSERT INTO Device (MACAddress, username, description, type, IPAddress, deptOwner)
VALUES 	("ac:2b:c8:91:aa:b5", "longmane", "sec_desktop", "desktop", "10.240.1.1", "007"),
		("cc:72:c8:21:8a:ec", "schmidtm", "it_desktop", "desktop", "10.240.1.2", "007"),
		("07:11:2a:bb:66:42", "instrctr", "el_prez", "laptop", "10.240.3.5", "001"),
		("bc:33:01:91:9a:65", "freemang", "engr_desktop1", "desktop", "10.240.30.9", "002"),
		("e8:61:ed:dd:dd:dd", "glados", "acct_laptop", "laptop", "10.240.50.50", "003"),
		("69:ae:55:78:6e:98", "arans", "sales_laptop", "laptop", "10.240.4.3", "004");
