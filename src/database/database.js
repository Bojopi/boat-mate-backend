import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('postgres://postgres:LGBoating1234!@database-boatmate.cclvjjaprbkj.us-east-2.rds.amazonaws.com:5432/boatmatedb', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})
// export const sequelize = new Sequelize('postgres://hiadiwkyvzqxry:4e55cae2f3590b6749ac5f7708375d8cfdf9c63b1cf38cd255038dfba464f85d@ec2-52-0-79-72.compute-1.amazonaws.com:5432/da840e81fdjbb8', {
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false
//         }
//     }
// })
// export const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/boatmate')