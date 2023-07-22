module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define(
      "address",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.BIGINT
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        map_longitude: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        map_latitude: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        appartment_no: {
          type: DataTypes.STRING,
          allowNull: true
        },
        note: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        address_type: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        address_type_note: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        extra_note: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        customer_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: new Date()
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: new Date()
        }
      },
      {}
    );
    Address.associate = (models) => {
      // associations can be defined here
      Address.belongsTo(models.customer, {foreignKey: 'customer_id', sourceKey:'id', as: 'customer'})
    };
    return Address;
  };