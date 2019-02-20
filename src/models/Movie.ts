import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  DeletedAt,
  HasMany,
  IsDate,
  Length,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt
} from "sequelize-typescript";

import Comment from "@models/Comment";

import Rating from "Rating";

@DefaultScope({
  include: [
    {
      model: () => Comment
    }
  ]
})
@Scopes({
  withoutComments: {}
})
@Table({
  tableName: "movies"
})
export default class Movie extends Model<Movie> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number;

  @Length({ min: 3, max: 64 })
  @Column({
    type: DataType.STRING(64)
  })
  public title: string;

  @Length({ min: 3, max: 9 })
  @Column({
    type: DataType.STRING(9)
  })
  public year: string;

  @Length({ min: 3, max: 32 })
  @Column({
    type: DataType.STRING(32)
  })
  public rated: string;

  @IsDate
  @Column
  public released: Date;

  @Column
  public runtime: number;

  @Length({ min: 3, max: 128 })
  @Column({
    type: DataType.STRING(128)
  })
  public genre: string;

  @Length({ min: 3, max: 64 })
  @Column({
    type: DataType.STRING(64)
  })
  public writer: string;

  @Length({ min: 3, max: 64 })
  @Column({
    type: DataType.STRING(64)
  })
  public director: string;

  @Length({ min: 3, max: 128 })
  @Column({
    type: DataType.STRING(128)
  })
  public actors: string;

  @Length({ min: 3, max: 512 })
  @Column({
    type: DataType.STRING(512)
  })
  public plot: string;

  @Length({ min: 3, max: 15 })
  @Column({
    type: DataType.STRING(15)
  })
  public language: string;

  @Length({ min: 3, max: 15 })
  @Column({
    type: DataType.STRING(15)
  })
  public country: string;

  @Length({ min: 3, max: 128 })
  @Column({
    type: DataType.STRING(128)
  })
  public awards: string;

  @Length({ min: 3, max: 256 })
  @Column({
    type: DataType.STRING(256)
  })
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
  @Length({ min: 1, max: 10 })
  @Column({
    type: DataType.STRING(10)
  })
  public imdbID: string;

  @IsDate
  @Column
  public dvdPremiere?: Date;

  @Length({ min: 3, max: 32 })
  @Column({
    type: DataType.STRING(32)
  })
  public boxOffice: string;

  @Length({ min: 3, max: 32 })
  @Column({
    type: DataType.STRING(32)
  })
  public production: string;

  @Length({ min: 3, max: 256 })
  @Column({
    type: DataType.STRING(256)
  })
  public website: string;

  @CreatedAt
  public creationDate: Date;

  @UpdatedAt
  public updatedOn: Date;

  @DeletedAt
  public deletedOn: Date;

  @HasMany(() => Comment, "movieId")
  public comments?: Comment[];
}
