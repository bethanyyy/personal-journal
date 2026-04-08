import Link from "next/link";
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
    <div className="flex flex-col gap-2.5 font-sans text-lg">
      {articles.map((article, id) => (
        <Link
          href={`/${article.id}`}
          key={id}
          className="text-neutral-900 hover:text-amber-700 transition duration-150"
        >
          {article.date}
        </Link>
      ))}
    </div>
  );
};

export default ArticleItemList;
