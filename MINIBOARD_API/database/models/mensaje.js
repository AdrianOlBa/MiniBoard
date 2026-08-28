const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mensaje', {
    mid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    did: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diagrama',
        key: 'did'
      }
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    emisor: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mensaje',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "mensaje_pkey",
        unique: true,
        fields: [
          { name: "mid" },
        ]
      },
    ]
  });
};
