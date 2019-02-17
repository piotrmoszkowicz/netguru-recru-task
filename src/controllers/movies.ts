import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put
} from "routing-controllers";

@JsonController()
export class CommentsController {
  @Get("/movies")
  private getAllMovies() {
    return [
      {
        id: 1,
        title: "test",
        content: "awesome comment"
      }
    ];
  }

  @Get("/movies/:id")
  private getMovieById(@Param("id") id: number) {
    return {
      onemovie: true
    };
  }

  @Post("/movies")
  private addMovie(@Body() movie: any) {
    return {
      added: true
    };
  }

  @Put("/movies/:id")
  private updateMovie(@Param("id") id: number, @Body() movie: any) {
    return {
      updated: true
    };
  }

  @Delete("/movies/:id")
  private deleteMovie(@Param("id") id: number) {
    return {
      deleted: true
    };
  }
}
