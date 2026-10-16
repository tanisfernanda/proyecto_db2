require('dotenv').config();
const mysql = require('mysql2');
// Configuración de la conexión a la base de datos
const host=process.env.DB_HOST || 'localhost';
const port=Number(process.env.DB_PORT) || 3306;
const user=process.env.DB_USER || 'root';
const password=process.env.DB_PASSWORD || '';
const database= process.env.DB_NAME || 'tienda';

//opciones de configuración 
const configuracion = {
  host,
  port,
  user,
  password,
  database,
};

//si el host es remoto(TiDB Cloud),habilitar SSL automaticamente
if (host !== 'localhost' && host !== '127.0.0.1') {
  configuracion.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  };
}

//ccreación de la coneexion con mysql o TiDB Cloud
const connection = mysql.createConnection(configuracion);

//comprobar la conexión fue exitosa
connection.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
  return;
  } 
  console.log(`Conexión exitosa a la base de datos  ${host}:${port}`);
});
// exportar la conexion para reutilizarla en las rutas de servidor
module.exports=connection