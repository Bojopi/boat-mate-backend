import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Message } from "./Message.js";

export const Conversation = sequelize.define('conversations', {
    id_conversation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    conversation_state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
})

Conversation.hasMany(Message, {
    foreignKey: 'conversationId',
    sourceKey: 'id_conversation'
});
Message.belongsTo(Conversation, {
    foreignKey: 'conversationId',
    targetKey: 'id_conversation'
});