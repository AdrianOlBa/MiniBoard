const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
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
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
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
