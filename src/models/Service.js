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
    },
    service_state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});


Service.belongsToMany(Category, {
    through: ServiceCategories,
});
Category.belongsToMany(Service, {
    through: ServiceCategories,
});


Category.hasMany(ServiceCategories, {
});
ServiceCategories.belongsTo(Category, {
});


Service.hasMany(ServiceCategories, {
});
ServiceCategories.belongsTo(Service, {
});


