const mysql = require('mysql2');
// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost', // Cambia esto si tu base de datos está en otro host
  user: 'root', //usuario de la base de datos
  password: '',
  database: 'tienda' //nombre de la base de datos
});

// comprobar la conexión
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    return;
  } 
    console.log('Conexión a la base de datos establecida');
  }
);
// exportar la conexion para reutilizarla en las rutas de servidor
module.exports=connection