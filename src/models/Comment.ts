import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Length,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";

import Movie from "@models/Movie";

@Table({
  tableName: "comments"
})
export default class Comment extends Model<Comment> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number;

  @Length({ min: 5, max: 128 })
  @Column({
    type: DataType.STRING(128)
  })
  public title: string;

  @Length({ min: 5, max: 256 })
  @Column({
    type: DataType.STRING(256)
  })
  public content: string;

  @ForeignKey(() => Movie)
  public movieId: number;

  @CreatedAt
  public creationDate: Date;

  @UpdatedAt
  public updatedOn: Date;

  @DeletedAt
  public deletedOn: Date;
}
