"use client";

interface ArticleLinkProps {
  text: string;
  url: string;
}

export default function ArticleLink({ text, url }: ArticleLinkProps) {
  return (
    <span>
      <a href={url} className="hover:text-amber-700 transition duration-150">
        {text}
      </a>
    </span>
  );
}
