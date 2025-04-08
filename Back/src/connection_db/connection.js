//Archivo para la conexión a la base de datos

import  mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'OpenQuizzerDB1703',
    database: 'OpenQuizzerDataBase'
}
const connection = await mysql.createConnection(config);

export default connection;