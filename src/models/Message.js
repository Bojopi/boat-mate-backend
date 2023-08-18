import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Message = sequelize.define('messages', {
    id_message: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message_text: {
        type: DataTypes.STRING,
    },
    message_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    message_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
})

