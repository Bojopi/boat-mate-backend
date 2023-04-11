import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/boatmate')