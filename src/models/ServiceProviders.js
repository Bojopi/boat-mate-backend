import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Rating } from "./Rating.js";

export const ServiceProviders = sequelize.define('service_providers', {
    id_service_provider: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.FLOAT,
    }
}, {
    timestamps: false
});

ServiceProviders.hasMany(Rating, {
    foreignKey: 'serviceProviderId',
    sourceKey: 'id_service_provider'
});
Rating.belongsTo(ServiceProviders, {
    foreignKey: 'serviceProviderId',
    targetKey: 'id_service_provider'
});