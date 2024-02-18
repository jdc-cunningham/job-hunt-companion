require('dotenv').config({
  path: '.env'
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

// connect to mysql, assumes above works eg. mysql is running/credentials exist
connection.connect((err) => {
  if (err) {
      console.error('error connecting: ' + err.stack);
      return;
  }
});

// check if database exists, if not create it
connection.query('CREATE DATABASE IF NOT EXISTS `job_applications`', (error, results, fields) => {
  if (error) {
      console.log('error checking if job_applications database exists:', error.sqlMessage);
      return;
  }
});

// use the database
connection.query('USE job_applications', (error, results, fields) => {
  if (error) {
      console.log('an error occurred trying to use the job_applications database', error);
      return;
  }
});

// build the various tables and their schemas

connection.query(
  'CREATE TABLE `job_applications` (' +
      '`id` int(11) NOT NULL AUTO_INCREMENT,' +
      '`company_name` varchar(255) NOT NULL,' +
      '`job_info` varchar(255),' +
      '`source` varchar(255),' +
      '`tech_stack` varchar(255),' +
      '`why_not_apply` varchar(255),' +
      '`status` varchar(255),' +
      '`created` datetime NOT NULL,' +
      'PRIMARY KEY (`id`),' +
      'INDEX `company_name` (`company_name`),' + // important for speed
      'INDEX `tech_stack` (`tech_stack`)' +
     ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
  (error, results, fields) => {
      if (error) {
          console.log('error creating table notes:', error.sqlMessage);
          return;
      }
  }
)

connection.end();