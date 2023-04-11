import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Service } from "./Service.js";
import { Schedule } from './Schedule.js'

export const Provider = sequelize.define('providers', {
    id_provider: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.BLOB,
    },
    postal: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    position: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false
});

Provider.hasMany(Service, {
    foreignKey: 'providerId',
    sourceKey: 'id_provider'
});
Service.belongsTo(Provider, {
    foreignKey: 'providerId',
    targetKey: 'id_provider'
});

Provider.hasMany(Schedule, {
    foreignKey: 'providerId',
    sourceKey: 'id_provider'
});
Schedule.belongsTo(Provider, {
    foreignKey: 'providerId',
    targetKey: 'id_provider'
});

