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
  @Get("/comments")
  private getAllComments() {
    return [
      {
        id: 1,
        title: "test",
        content: "awesome comment"
      }
    ];
  }

  @Get("/comments/:id")
  private getCommentById(@Param("id") id: number) {
    return {
      onecomment: true
    };
  }

  @Post("/comments")
  private addComment(@Body() comment: any) {
    return {
      added: true
    };
  }

  @Put("/comments/:id")
  private updateComment(@Param("id") id: number, @Body() comment: any) {
    return {
      updated: true
    };
  }

  @Delete("/comments/:id")
  private deleteComment(@Param("id") id: number) {
    return {
      deleted: true
    };
  }
}
