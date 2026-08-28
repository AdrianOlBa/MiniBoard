const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
    uid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "usuarios_nombre_key"
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "usuarios_correo_key"
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "usuarios_correo_key",
        unique: true,
        fields: [
          { name: "correo" },
        ]
      },
      {
        name: "usuarios_nombre_key",
        unique: true,
        fields: [
          { name: "nombre" },
        ]
      },
      {
        name: "usuarios_pkey",
        unique: true,
        fields: [
          { name: "uid" },
        ]
      },
    ]
  });
};
