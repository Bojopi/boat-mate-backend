import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Gallery = sequelize.define('galleries', {
    id_gallery: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gallery_image: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false
})

