import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Articles",
  description: "Read Zacchary's articles.",
};

export default async function Articles() {
  const posts = await prisma.posts.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl py-20 px-4">
      {/* list latest article */}
      {/* list featured articles */}

      <div className="flex flex-wrap gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/article/${encodeURIComponent(post.slug)}`}
              prefetch={false}
              aria-label={post.title}
              className="relative p-4 border-2  hover:bg-neutral-900 duration-300 transition rounded-lg h-[200px]"
            >
              <Badge
                variant="secondary"
                className="absolute bottom-4 right-4 font-mono"
              >
                {post.views} views
              </Badge>
              <Badge
                variant="secondary"
                className="absolute bottom-4 left-4 font-mono"
              >
                {post.tag}
              </Badge>
              <div className="space-y-2">
                <p className="font-semibold">{post.title}</p>

                <Badge variant="secondary" className="font-mono">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>

                <p className="text-sm text-muted-foreground">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
