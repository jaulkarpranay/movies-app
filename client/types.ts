type Genre = {
  id: string;
  name: string;
};

type ImageSet = {
  verticalPoster: {
    w240: string;
    w360: string;
    w480: string;
    w600: string;
    w720: string;
  };
  horizontalPoster: {
    w360: string;
    w480: string;
    w720: string;
    w1080: string;
  };
  horizontalBackdrop: {
    w360: string;
    w480: string;
    w720: string;
    w1080: string;
  };
};

// export type Movie = {
//   itemType: 'show';
//   showType: 'movie';
//   id: string;
//   imdbId: string;
//   tmdbId: string;
//   title: string;
//   overview: string;
//   releaseYear: number;
//   originalTitle: string;
//   genres: Genre[];
//   directors: string[];
//   cast: string[];
//   rating: number;
//   imageSet: ImageSet;
// };

export interface Movie {
  _id?: string;
  title: string;
  directors: string | string[];
  rating: number;
  releaseYear: number;
  imageSet?: ImageSet;
  imdbId: string;
}

export type SearchQuery = {
  rating: number;
  releaseYear: number;
  query: string;
  sortBy: "-rating" | "rating" | "releaseYear" | "-releaseYear";
};
