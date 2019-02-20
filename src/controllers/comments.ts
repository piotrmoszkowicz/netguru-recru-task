import {
  Body,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put
} from "routing-controllers";

import CommentService from "@services/comment";

import CommentApi from "CommentApi";

@JsonController()
export class CommentsController {
  constructor(private commentService = new CommentService()) {}

  @Get("/comments")
  private getAllComments() {
    return this.commentService
      .getAll()
      .then(comments => comments.map(comment => comment.toJSON()));
  }

  @Get("/comments/:id")
  private async getCommentById(@Param("id") id: number) {
    const movie = await this.commentService.getCommentById(id);
    if (!movie) {
      throw new NotFoundError("Comment not found!");
    }
    return movie.toJSON();
  }

  @Post("/comments")
  private async addComment(@Body() comment: CommentApi) {
    return (await this.commentService.addComment(comment)).toJSON();
  }

  @Put("/comments/:id")
  private async updateComment(
    @Param("id") id: number,
    @Body() comment: CommentApi
  ) {
    return (await this.commentService.updateComment(id, comment)).toJSON();
  }

  @Delete("/comments/:id")
  private deleteComment(@Param("id") id: number) {
    return this.commentService.deleteComment(id);
  }
}
