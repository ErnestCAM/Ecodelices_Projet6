import mysql from "mysql2/promise";

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: "3307",
      user: "root",
      password: "root",
      database: "ecodelices",
    });
    console.log("Connexion réussie à MySQL !");
    
    const [rows] = await connection.execute("SHOW TABLES;");
    console.log("Tables :", rows);
    
    await connection.end();
  } catch (error) {
    console.error("Erreur de connexion :", error.message);
  }
}

testConnection();
