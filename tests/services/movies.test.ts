import moviesService from "@services/movie";

import na from "../mocks/na.json";
import naCorrect from "../mocks/na_correct.json";

import full from "../mocks/full.json";
import fullCorrect from "../mocks/full_correct.json";

describe("Movies Service - NotAvailable function", () => {
  it("should return null when N/A", done => {
    expect(
      moviesService.notavailableCheck("N/A", v => parseInt(v, 10))
    ).toBeNull();
    done();
  });

  it("should correctly convert when it's not N/A", done => {
    expect(moviesService.notavailableCheck("10", v => parseInt(v, 10))).toEqual(
      10
    );
    done();
  });
});

describe("Movies Service - firstLetterOfKeyToLower function", () => {
  it("shouldn't touch later letters", done => {
    const testObj = {
      tEst: true
    };

    expect(moviesService.firstLetterOfKeyToLower(testObj)).toEqual({
      tEst: true
    });

    done();
  });

  it("should transfor key when needed", done => {
    const testObj = {
      Test: true
    };

    expect(moviesService.firstLetterOfKeyToLower(testObj)).toEqual({
      test: true
    });

    done();
  });
});

describe("Movies Service - reformatDate", () => {
  it("should return 1970 when date is incorrect", done => {
    expect(moviesService.reformatDate(null)).toEqual("1970-01-01");
    done();
  });

  it("should correctly reformat date", done => {
    expect(moviesService.reformatDate("11 Jan 2010")).toEqual("2010-01-11");
    done();
  });
});

describe("Movies Service - reformatMovieObject", () => {
  it("should correctly reformat with N/As", done => {
    expect(moviesService.reformatMovieObject(na)).toEqual(naCorrect);
    done();
  });

  it("should correctly reformat full response", done => {
    expect(moviesService.reformatMovieObject(full)).toEqual(fullCorrect);
    done();
  });
});
