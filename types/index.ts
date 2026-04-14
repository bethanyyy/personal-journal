export type ArticleItem = {
  id: string;
  date: string;
  tags: string[];
  thumbnail: string | null;
};

export type JournalImage = {
  key: string;
  url: string;
  size?: number;
};

export type MediaItem = {
  key: string;
  url: string;
  type: string;
  size?: number;
  thumbnail?: string; // For video thumbnails
};
