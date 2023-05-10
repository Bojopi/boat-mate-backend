import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ServiceCategories = sequelize.define('service_categories', {
    id_service_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    timestamps: false
});
