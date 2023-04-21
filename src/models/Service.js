import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Category } from "./Category.js";
import { ServiceCategories } from "./ServiceCategories.js";

export const Service = sequelize.define('services', {
    id_service: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    detail: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING
    },
    cost: {
        type: DataTypes.FLOAT
    },
}, {
    timestamps: false
});


Service.belongsToMany(Category, { 
    through: ServiceCategories,
    uniqueKey: 'serviceId',
    foreignKey: 'serviceId',
});
Category.belongsToMany(Service, { 
    through: ServiceCategories, 
    uniqueKey: 'categoryId',
    foreignKey: 'categoryId',
});
