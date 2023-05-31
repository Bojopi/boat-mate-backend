import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Service } from "./Service.js";
import { Schedule } from './Schedule.js'
import { Portofolio } from "./Portofolio.js";
import { ServiceProviders } from "./ServiceProviders.js";

export const Provider = sequelize.define('providers', {
    id_provider: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    provider_name: {
        type: DataTypes.STRING,
    },
    provider_image: {
        type: DataTypes.STRING,
    },
    provider_description: {
        type: DataTypes.STRING
    },
    provider_lat: {
        type: DataTypes.STRING,
    },
    provider_lng: {
        type: DataTypes.STRING,
    },
    zip: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false
});


Provider.hasMany(Schedule, {
    foreignKey: 'providerId',
    sourceKey: 'id_provider'
});
Schedule.belongsTo(Provider, {
    foreignKey: 'providerId',
    targetKey: 'id_provider'
});


Provider.hasMany(Portofolio, {
    foreignKey: 'providerId',
    sourceKey: 'id_provider'
});
Portofolio.belongsTo(Provider, {
    foreignKey: 'providerId',
    targetKey: 'id_provider'
});


Provider.belongsToMany(Service, {
    through: ServiceProviders,
    foreignKeyConstraint: true
});
Service.belongsToMany(Provider, {
    through: ServiceProviders,
});


Service.hasMany(ServiceProviders, {
});
ServiceProviders.belongsTo(Service, {
});


Provider.hasMany(ServiceProviders, {
});
ServiceProviders.belongsTo(Provider, {
});