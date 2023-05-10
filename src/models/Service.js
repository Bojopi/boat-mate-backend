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
    service_name: {
        type: DataTypes.STRING,
    },
    service_description: {
        type: DataTypes.STRING
    }
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


Category.belongsToMany(Service, {
    through: ServiceCategories,
});
Service.belongsToMany(Category, {
    through: ServiceCategories,
});


Service.hasMany(ServiceCategories);
ServiceCategories.belongsTo(Service);


Category.hasMany(ServiceCategories);
ServiceCategories.belongsTo(Category);


