import Sequelize from "sequelize";
import dotenv from "dotenv";


dotenv.config({path: '.env'});


const db = new Sequelize(process.env.MYSQL_DB,process.env.MYSQL_USER,process.env.MYSQL_PASS,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        port: process.env.MYSQL_PORT,
        logging: false,
        define: {
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);


export default db;