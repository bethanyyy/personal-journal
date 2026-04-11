import fs from "fs";
import matter from "gray-matter";
import path from "path";
import moment from "moment";
import { remark } from "remark";
import html from "remark-html";

import type { ArticleItem } from "@/types";
import { getFirstImageForDate } from "./images";

const articlesDirectory = path.join(process.cwd(), "articles");

export const getSortedArticles = async (): Promise<ArticleItem[]> => {
  const fileNames = fs.readdirSync(articlesDirectory); // returns list of file names

  const allArticlesData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.mdx$/, ""); // replace markdown extension

      const fullPath = path.join(articlesDirectory, fileName);

      const fileContent = fs.readFileSync(fullPath, "utf-8");

      const matterResult = matter(fileContent); // process metadata

      // Parse tags - handles both array and string formats
      let tags: string[] = [];
      if (matterResult.data.tags) {
        if (Array.isArray(matterResult.data.tags)) {
          tags = matterResult.data.tags;
        } else if (typeof matterResult.data.tags === "string") {
          tags = matterResult.data.tags.split(",").map((tag) => tag.trim());
        }
      }

      const originalThumbnail = await getFirstImageForDate(id);
      const thumbnail = originalThumbnail;

      return {
        id,
        date: matterResult.data.date,
        tags: tags,
        thumbnail: thumbnail,
      };
    }),
  );

  return allArticlesData.sort((a, b) => {
    const format = "DD-MM-YYYY";
    const dateOne = moment(a.date, format);
    const dateTwo = moment(b.date, format);
    if (dateOne.isBefore(dateTwo)) {
      return 1;
    } else if (dateOne.isAfter(dateTwo)) {
      return -1;
    } else {
      return 0;
    }
  });
};

// export const getCategorisedArticles = (): Record<string, ArticleItem[]> => {
//   const sortedArticles = getSortedArticles();
//   const categorisedArticles: Record<string, ArticleItem[]> = {};

//   sortedArticles.forEach((article) => {
//     if (!categorisedArticles[article.category]) {
//       categorisedArticles[article.category] = [];
//     }
//     categorisedArticles[article.category].push(article);
//   });

//   return categorisedArticles;
// };

// export const getArticleData = async (id: string) => {
//   const fullPath = path.join(articlesDirectory, `${id}.mdx`);

//   const fileContents = fs.readFileSync(fullPath, "utf-8");

//   const matterResult = matter(fileContents);
//   console.log(matterResult.content);

//   const processedContent = await remark()
//     .use(html)
//     .process(matterResult.content);

//   const contentHtml = processedContent.toString();

//   return {
//     id,
//     contentHtml,
//     category: matterResult.data.category,
//     date: moment(matterResult.data.date, "DD-MM-YYYY").format("MMMM Do YYYY"),
//   };
// };
