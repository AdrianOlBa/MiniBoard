const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rol', {
    rnombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    mover: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    escribir: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    permisos_ad: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'rol',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "rol_pkey",
        unique: true,
        fields: [
          { name: "rnombre" },
        ]
      },
    ]
  });
};
