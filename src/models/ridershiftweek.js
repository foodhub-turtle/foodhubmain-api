module.exports = (sequelize, DataTypes) => {
    const RiderShiftWeek = sequelize.define(
        "rider_shift_week", {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.BIGINT
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: true
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
        }, {}
    );
    
    return RiderShiftWeek;
};