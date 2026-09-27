const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tarjeta', {
    tid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'columna',
        key: 'cid'
      }
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'orden'
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "gray"
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'tarjeta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tarjeta_pkey",
        unique: true,
        fields: [
          { name: "tid" },
        ]
      },
    ]
  });
};
