import config from "config";
import { pick } from "lodash";
import { mapKeys } from "lodash/fp";
import moment from "moment";
import rp from "request-promise";

import Movie from "@models/Movie";
import Logger from "@utils/logger";

import MovieApiResponse from "MovieApiResponse";
import { InternalServerError, NotAcceptableError } from "routing-controllers";

export default class MovieService {
  /**
   * Converter for N/A values
   * @param {string}     value            Value to convert
   * @param {Function}   fun              Converter function
   * @private
   * @return {T}                          Null / converted value
   */
  public static notavailableCheck<T>(value: string, fun: (v: string) => T): T {
    return value === "N/A" ? null : fun(value);
  }

  /**
   * Makes first letter of object's key lower
   * @param  {object}    obj              Object to change key for
   * @return {object}                     Object with correct keys
   */
  public static firstLetterOfKeyToLower(obj: object): object {
    return mapKeys(k => {
      const [f, ...r] = k;
      return [f.toLowerCase(), ...r].reduce((acc, letter) => acc + letter);
    }, obj);
  }

  /**
   * Changes date format from API to DATETIME of MySQL
   * @param  {string}    date             Date from API
   * @return {string}                     Date correctly formatted
   */
  public static reformatDate(date: string): string {
    if (moment(`${date} 00:00:00 GMT`).isValid()) {
      return moment(`${date} 00:00:00 GMT`).format("YYYY-MM-DD");
    } else {
      return "1970-01-01";
    }
  }

  /**
   * Reformats API response to our model
   * @param  {MovieApiResponse}   movie   Response from API
   * @private
   * @return {object}                     Object, which model can be built from
   */
  public static reformatMovieObject(movie: MovieApiResponse): object {
    const {
      Released,
      Runtime,
      Poster,
      Metascore,
      imdbRating,
      imdbVotes,
      DVD,
      Ratings,
      ...rest
    } = movie;
    const cleanRest = MovieService.firstLetterOfKeyToLower(rest);

    return {
      ...cleanRest,
      released: MovieService.reformatDate(Released),
      runtime: MovieService.notavailableCheck(Runtime, v =>
        parseInt(v.replace(" min", ""), 10)
      ),
      metascore: MovieService.notavailableCheck(Metascore, v =>
        parseInt(v, 10)
      ),
      posterUrl: Poster,
      imdbRating: parseFloat(imdbRating),
      imdbVotes: MovieService.notavailableCheck(imdbVotes, v =>
        parseInt(v.replace(",", ""), 10)
      ),
      dvdPremiere: MovieService.reformatDate(DVD),
      ratings: Ratings.map(rating =>
        MovieService.firstLetterOfKeyToLower(rating)
      )
    };
  }

  constructor(
    readonly movieModel: any = Movie,
    readonly apiUrl: string = `http://www.omdbapi.com/?apikey=${config.get(
      "app.apiKey"
    )}&type=movie`,
    readonly ALLOWED_UPDATES: string[] = [
      "title",
      "year",
      "rated",
      "released",
      "runtime",
      "genre",
      "director",
      "writer",
      "actors",
      "plot",
      "language",
      "country",
      "awards",
      "posterUrl",
      "ratings",
      "dvdPremiere",
      "boxOffice",
      "production",
      "website"
    ]
  ) {}

  /**
   * Returns all movies from database
   */
  public getAll(): Promise<Movie[]> {
    return this.movieModel.findAll();
  }

  /**
   * Finds movie by movieId
   * @param  {number}    movieId          ID of movie
   * @return {Promise<Movie>}             Promise, which resolves with movie
   */
  public getMovieById(movieId: number): Promise<Movie> {
    return this.movieModel.findOne({
      where: {
        id: movieId
      }
    });
  }

  /**
   * Adds movie to database via API search
   * @param {string}     id?              API movie ID
   * @param {string}     title?           Movie title to search for
   * @return {Promise<Movie>}             Instance of new movie
   */
  public async addMovie(id?: string, title?: string): Promise<any> {
    if (id === undefined && title === undefined) {
      throw new NotAcceptableError("Wrong request params");
    }

    try {
      const movie =
        id === undefined
          ? await this._findMovieByTitleInApi(title)
          : await this._findMovieByIDInApi(id);
      const newMovie = new Movie(MovieService.reformatMovieObject(movie));
      await newMovie.save();
      return newMovie;
    } catch (error) {
      Logger.log("error", "Can not add movie to database", { error });
      throw new InternalServerError("Can not add movie to database");
    }
  }

  /**
   * Updates movie with certain ID
   * @param  {number}     id              ID of movie to update
   * @param  {object}     updates         Requested updates
   * @return {Promise<Movie>}             Promise, which resolves with updated object
   */
  public async updateMovie(id: number, updates: object): Promise<Movie> {
    const allowedUpdates = this._pickAllowedUpdates(updates);
    if (Object.keys(allowedUpdates).length === 0) {
      throw new NotAcceptableError("No acceptable updates");
    }
    try {
      const movie = await this.getMovieById(id);
      return movie.updateAttributes(allowedUpdates);
    } catch (error) {
      Logger.log("error", "Can not update movie", { error });
      throw new InternalServerError("Can not update movie");
    }
  }

  /**
   * Removes movie from database
   * @param  {number}   id              ID of movie
   * @return {Promise<boolean>}         Resolves with result of deletion
   */
  public deleteMovie(id: number): Promise<boolean> {
    return this.movieModel.destroy({
      where: {
        id
      }
    });
  }

  /**
   * Find movie in API by it's ID
   * @param {string}    id                API movie ID
   * @private
   * @return {Promise<MovieApiResponse>}  Object with data from API
   */
  private _findMovieByIDInApi(id: string): Promise<MovieApiResponse> {
    const opts = {
      uri: `${this.apiUrl}&i=${id}`,
      json: true
    };

    return this._requestApi(opts);
  }

  /**
   * Find movie in API by it's title
   * @param {string}    title             Movie title
   * @private
   * @return {Promise<MovieApiResponse>}  Object with data from API
   */
  private _findMovieByTitleInApi(title: string): Promise<MovieApiResponse> {
    const opts = {
      uri: `${this.apiUrl}&t=${title}`,
      json: true
    };

    return this._requestApi(opts);
  }

  /**
   * Request wrapper for connection with API
   * @param {object}    opts              Request option
   * @private
   * @return {Promise<MovieApiResponse>}  Object with data from API
   */
  private _requestApi(opts: object): Promise<MovieApiResponse> {
    return rp(opts).then((response: MovieApiResponse) => {
      if (response !== null && response.Response === "True") {
        return response;
      } else {
        Logger.log("error", "Error while getting response from API", {
          response
        });
        throw new InternalServerError("Error while getting response from API");
      }
    });
  }

  /**
   * Returns object with fields, which are allowed to be updated
   * @param  {object}    data             Data with updates
   * @private
   * @return {object}                     Data with allowed updates
   */
  private _pickAllowedUpdates(data: object): object {
    return pick(data, this.ALLOWED_UPDATES);
  }
}
