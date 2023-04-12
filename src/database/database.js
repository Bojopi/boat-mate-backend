import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('postgres://gfkzngutksumgg:61879c145effce3acc1ccb2fad7f25e3c3e8053953d59ad1a70dfbe24b007300@ec2-3-234-204-26.compute-1.amazonaws.com:5432/dbj4csnpe5otg5', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})
// export const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/boatmate')