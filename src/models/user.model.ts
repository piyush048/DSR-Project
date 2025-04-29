import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public profilePicture!: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'userModel',
    tableName: 'users',
    timestamps: true
  }
);

export { User };
