import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Schedule = sequelize.define('schedules', {
    id_schedule: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    start_hour: {
        type: DataTypes.STRING,
    },
    end_hour: {
        type: DataTypes.STRING
    },
}, {
    timestamps: false
});



