import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Profile } from './Profile.js'

export const Person = sequelize.define('person', {
    id_person: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    person_name: {
        type: DataTypes.STRING,
    },
    lastname: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING,
    },
    person_image: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false
})

Person.hasMany(Profile, {
    foreignKey: 'personId',
    sourceKey: 'id_person'
});
Profile.belongsTo(Person, {
    foreignKey: 'personId',
    targetKey: 'id_person'
});

