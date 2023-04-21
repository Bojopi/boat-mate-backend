import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { ServiceCategories } from "./ServiceCategories.js";

export const Category = sequelize.define('categories', {
    id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false
});

// Category.belongsToMany(Service, { through: ServiceCategories });
