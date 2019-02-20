import {
  Body,
  BodyParam,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put
} from "routing-controllers";

import MovieService from "@services/movie";

@JsonController()
export class MoviesController {
  constructor(private movieService = new MovieService()) {}

  @Get("/movies")
  private getAllMovies() {
    return this.movieService
      .getAll()
      .then(movies => movies.map(movie => movie.toJSON()));
  }

  @Get("/movies/:id")
  private async getMovieById(@Param("id") id: number) {
    const movie = await this.movieService.getMovieById(id);
    if (!movie) {
      throw new NotFoundError("Movie not found!");
    }
    return movie.toJSON();
  }

  @Post("/movies")
  private async addMovie(
    @BodyParam("id") id?: string,
    @BodyParam("title") title?: string
  ) {
    return (await this.movieService.addMovie(id, title)).toJSON();
  }

  @Put("/movies/:id")
  private async updateMovie(@Param("id") id: number, @Body() updates: any) {
    return (await this.movieService.updateMovie(id, updates)).toJSON();
  }

  @Delete("/movies/:id")
  private deleteMovie(@Param("id") id: number): Promise<boolean> {
    return this.movieService.deleteMovie(id);
  }
}
