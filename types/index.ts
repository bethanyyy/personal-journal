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
