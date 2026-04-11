import ArticleItemList from "@/components/ArticleListItem";
import { getSortedArticles } from "@/lib/articles";
import React from "react";

const HomePage = async () => {
  // const articles = getCategorisedArticles();
  const articles = await getSortedArticles();

  return (
    <div className="h-screen flex items-center">
      <section className="mx-auto w-11/12 md:w-1/2 mt-20 flex flex-col gap-20 mb-20">
        <header className="font-serif font-light text-6xl text-neutral-900 text-center">
          <h1>life dump</h1>
        </header>
        <section className="flex flex-col gap-10">
          {/* {articles !== null &&
          Object.keys(articles).map((article) => (
            <ArticleItemList
              category={article}
              articles={articles[article]}
              key={article}
            />
          ))} */}
          {articles !== null && <ArticleItemList articles={articles} />}
        </section>
      </section>
    </div>
  );
};

export default HomePage;
