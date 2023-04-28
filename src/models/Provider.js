import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Service } from "./Service.js";
import { Schedule } from './Schedule.js'
import { Rating } from "./Rating.js";
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
    zip: {
        type: DataTypes.STRING
    },
    provider_description: {
        type: DataTypes.STRING
    },
    provider_position: {
        type: DataTypes.STRING,
    },
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
    // uniqueKey: 'providerId',
    // foreignKey: 'providerId'
});
Service.belongsToMany(Provider, { 
    through: ServiceProviders,
    // uniqueKey: 'serviceId',
    // foreignKey: 'serviceId'
});


Service.hasMany(ServiceProviders, {
    // foreignkey: 'serviceId',
    // sourceKey: 'id_service'
});
ServiceProviders.belongsTo(Service, {
    // foreignKey: 'serviceId',
    // targetKey: 'id_service'
});


Provider.hasMany(ServiceProviders, {
    // foreignkey: 'providerId',
    // sourceKey: 'id_provider',
});
ServiceProviders.belongsTo(Provider, {
    // foreignKey: 'providerId',
    // targetKey: 'id_provider'
});