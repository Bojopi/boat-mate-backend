import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Category = sequelize.define('categories', {
    id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false
});
