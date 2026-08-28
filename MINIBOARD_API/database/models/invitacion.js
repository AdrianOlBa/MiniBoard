const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invitacion', {
    iid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ""
    },
    rol: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'rol',
        key: 'rnombre'
      }
    }
  }, {
    sequelize,
    tableName: 'invitacion',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "invitacion_pkey",
        unique: true,
        fields: [
          { name: "iid" },
        ]
      },
    ]
  });
};
