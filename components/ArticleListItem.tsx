import Link from "next/link";
import HoverPreview from "./HoverPreview";
import type { ArticleItem } from "@/types";

// interface Props {
//   category: string;
//   articles: ArticleItem[];
// }

// const ArticleItemList = ({ category, articles }: Props) => {
//   return (
//     <div className="flex flex-col gap-5">
//       <h2 className="font-serif text-4xl">{category}</h2>
//       <div className="flex flex-col gap-2.5 font-sans text-lg">
//         {articles.map((article, id) => (
//           <Link
//             href={`/${article.id}`}
//             key={id}
//             className="text-neutral-900 hover:text-amber-700 transition duration-150"
//           >
//             {article.title}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

interface Props {
  articles: ArticleItem[];
}

const ArticleItemList = ({ articles }: Props) => {
  return (
    <div className="flex flex-col gap-2.5 font-sans text-base">
      {articles.map((article, id) => (
        <HoverPreview key={id} thumbnailUrl={article.thumbnail}>
          <div className="flex flex-row justify-between">
            <Link
              href={`/${article.id}`}
              className="text-neutral-900 hover:text-amber-700 transition duration-150"
            >
              {article.date}
            </Link>
            <div>
              {article.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </HoverPreview>
      ))}
    </div>
  );
};

export default ArticleItemList;
