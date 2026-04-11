import React from "react";
import Link from "next/link";
import path from "path";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

import { JournalImage } from "@/types";
import ImageGrid from "@/components/ImageGrid";
import { getSortedArticles } from "@/lib/articles";
import { getImagesForDate } from "@/lib/images";
import { getAllImageJournalDates } from "@/lib/images";

const articlesDirectory = path.join(process.cwd(), "articles");

export async function generateStaticParams() {
  //   const dates = await getAllImageJournalDates();
  const articles = await getSortedArticles();
  return articles.map((article) => ({ slug: article.id }));
}

const Article = async ({ params }: { params: { slug: string } }) => {
  const param = await params;
  //   const articleData = await getArticleData(param.slug);
  const images = await getImagesForDate(param.slug);

  const fullPath = path.join(articlesDirectory, `${param.slug}.mdx`); //run time
  const { default: MDXContent } = await import(`@/articles/${param.slug}.mdx`); //build time

  // Create a wrapper component that passes images to ImageGrid
  const MDXWithImages = () => {
    return <MDXContent images={images} slug={param.slug} />;
  };

  return (
    <section className="mx-auto w-10/12 md:w-1/2 mt-20 mb-20 flex flex-col gap-5">
      <div className="flex justify-between font-sans mb-5">
        <Link href={"/"} className="flex flex-row gap-1 place-items-center">
          <ArrowLeftIcon width={20} />
          <p>home</p>
        </Link>
        <p>{param.slug}</p>
      </div>
      <article className="article font-serif">
        <MDXContent />
      </article>
      {/* Image grid */}
      <ImageGrid images={images} slug={param.slug} />
    </section>
  );
};

export default Article;

// pre-computes exactly which slugs exist at build time
export const dynamicParams = false;
export const revalidate = 60;
