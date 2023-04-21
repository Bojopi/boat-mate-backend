import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Provider } from "../models/Provider.js";
import { Customer } from "../models/Customer.js";

export const Profile = sequelize.define('profiles', {
    id_profile: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.BOOLEAN,
    },
    google: {
        type: DataTypes.BOOLEAN,
    }
}, {
    timestamps: false
});

Profile.hasOne(Provider, {
    foreignKey: 'profileId',
    sourceKey: 'id_profile'
});
Provider.belongsTo(Profile, {
    foreignKey: 'profileId',
    targetKey: 'id_profile'
});

Profile.hasOne(Customer, {
    foreignKey: 'profileId',
    sourceKey: 'id_profile'
});
Customer.belongsTo(Profile, {
    foreignKey: 'profileId',
    targetKey: 'id_profile'
});

