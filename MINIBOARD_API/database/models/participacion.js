const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('participacion', {
    did: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'diagrama',
        key: 'did'
      }
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'usuarios',
        key: 'uid'
      }
    },
    rnombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Espectador",
      references: {
        model: 'rol',
        key: 'rnombre'
      }
    },
    es_favorito: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'participacion',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "participacion_pkey",
        unique: true,
        fields: [
          { name: "did" },
          { name: "uid" },
        ]
      },
    ]
  });
};
