import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from "sequelize-typescript";

import Rating from "Rating";

// TODO: Add scopes to get movie with comments
// TODO: Add association with comments

@Table({
  tableName: "movies"
})
export default class Movie extends Model<Movie> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number;

  @Column
  public title: string;

  @Column
  public year: string;

  @Column
  public rated: string;

  @Column
  public released: Date;

  @Column
  public runtime: number;

  @Column
  public genre: string;

  @Column
  public writer: string;

  @Column
  public director: string;

  @Column
  public actors: string;

  @Column
  public plot: string;

  @Column
  public language: string;

  @Column
  public country: string;

  @Column
  public awards: string;

  @Column
  public posterUrl: string;

  @Column({
    type: DataType.JSON
  })
  public ratings: Rating[];

  @Column
  public metascore: number;

  @Column({
    type: DataType.FLOAT(2, 1)
  })
  public imdbRating: number;

  @Column
  public imdbVotes: number;

  @Unique
  @Column
  public imdbID: string;

  @Column
  public dvdPremiere?: Date;

  @Column
  public boxOffice: string;

  @Column
  public production: string;

  @Column
  public website: string;

  @CreatedAt
  public creationDate: Date;

  @UpdatedAt
  public updatedOn: Date;

  @DeletedAt
  public deletedOn: Date;
}
