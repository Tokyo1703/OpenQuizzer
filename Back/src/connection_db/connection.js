//Archivo para la conexión a la base de datos

import  mysql from 'mysql2/promise';

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || 'OpenQuizzerDB1703',
    database: process.env.DB_NAME || 'OpenQuizzerDataBase'
}

const connection = await mysql.createConnection(config);

export default connection;