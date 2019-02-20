import { pick } from "lodash";
import { InternalServerError, NotAcceptableError } from "routing-controllers";

import Comment from "@models/Comment";
import Logger from "@utils/logger";

import CommentApi from "CommentApi";

export default class CommentService {
  constructor(
    readonly commentModel: any = Comment,
    readonly ALLOWED_CREATIONS: string[] = ["title", "content", "movieId"],
    readonly ALLOWED_UPDATES: string[] = ["title", "content"]
  ) {}

  /**
   * Returns all comments from database
   * @return  {Promise<Comment[]>}       Promise, which resolves with comments
   */
  public getAll(): Promise<Comment[]> {
    return this.commentModel.findAll();
  }

  /**
   * Finds comment by commentId
   * @param  {number}    commentId        ID of movie
   * @return {Promise<Comment>}           Promise, which resolves with comment
   */
  public getCommentById(commentId: number): Promise<Comment> {
    return this.commentModel.findOne({
      where: {
        id: commentId
      }
    });
  }

  /**
   * Adds comment to database
   * @param {object}     data             Data of new comment
   * @return {Promise<Comment>}           Resolves with new comment if created
   */
  public async addComment(data: CommentApi): Promise<Comment> {
    const serializedData = this._pickAllowedCreations(data);
    if (Object.keys(serializedData).length === 0) {
      throw new NotAcceptableError("No acceptable updates");
    }

    try {
      const newComment = new Comment(serializedData);
      await newComment.save();
      return newComment;
    } catch (error) {
      Logger.log("error", "Can not add comment to database", { error });
      throw new InternalServerError("Can not add comment to database");
    }
  }

  /**
   * Updates comment with certain ID
   * @param  {number}     id              ID of comment to update
   * @param  {object}     updates         Requested updates
   * @return {Promise<Comment>}           Promise, which resolves with updated comment
   */
  public async updateComment(
    id: number,
    updates: CommentApi
  ): Promise<Comment> {
    const allowedUpdates = this._pickAllowedUpdates(updates);
    if (Object.keys(allowedUpdates).length === 0) {
      throw new NotAcceptableError("No acceptable updates");
    }
    try {
      const comment = await this.getCommentById(id);
      return comment.updateAttributes(allowedUpdates);
    } catch (error) {
      Logger.log("error", "Can not update comment", { error });
      throw new InternalServerError("Can not update comment");
    }
  }

  /**
   * Removes comment from database
   * @param  {number}   id              ID of comment
   * @return {Promise<boolean>}         Resolves with result of deletion
   */
  public deleteComment(id: number): Promise<boolean> {
    return this.commentModel.destroy({
      where: {
        id
      }
    });
  }

  /**
   * Returns object with fields, which are allowed to create object
   * @param  {object}    data             Data with creations
   * @private
   * @return {object}                     Data with allowed creation properties
   */
  private _pickAllowedCreations(data: object): CommentApi {
    return pick(data, this.ALLOWED_CREATIONS);
  }

  /**
   * Returns object with fields, which are allowed to be updated
   * @param  {object}    data             Data with updates
   * @private
   * @return {object}                     Data with allowed updates
   */
  private _pickAllowedUpdates(data: object): CommentApi {
    return pick(data, this.ALLOWED_UPDATES);
  }
}
