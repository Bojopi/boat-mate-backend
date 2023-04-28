import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Portofolio = sequelize.define('portofolios', {
    id_portofolio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    portofolio_image: {
        type: DataTypes.STRING,
    },
    portofolio_description: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false
})

