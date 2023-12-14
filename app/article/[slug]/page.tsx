import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Separator } from "@/components/ui/separator";
import CopyLink from "@/components/copy-link";
import type { Metadata, ResolvingMetadata } from "next";

function countWords(text: any) {
  const words = text.trim().split(/\s+/);
  return words.length;
}

async function retrievePost(slug: string) {
  const data = await prisma.posts.findUnique({
    where: {
      slug: slug,
      published: true,
    },
  });

  if (!data) {
    redirect("/404");
  }

  return data;
}

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = params.slug;

  if (!slug) {
    redirect("/404");
  }

  const post = await retrievePost(slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post.title}`,
    description: post.description,
    openGraph: {
      images: [post.image || "/avatar.jpg", ...previousImages],
    },
  };
}

export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) {
    redirect("/404");
  }

  const post = await retrievePost(slug);

  await prisma.posts.update({
    where: { slug },
    data: { views: post.views + 1 },
  });

  const wordCount = countWords(post.content);
  const averageWordsPerMinute = 250; // Adjust this based on audience reading speed
  const readingTime = Math.ceil(wordCount / averageWordsPerMinute);

  const prevPost = await prisma.posts.findFirst({
    where: { createdAt: { lt: post.createdAt }, published: true },
    orderBy: { createdAt: "desc" },
  });

  const nextPost = await prisma.posts.findFirst({
    where: { createdAt: { gt: post.createdAt }, published: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto py-20 space-y-12">
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="flex justify-between gap-8">
          <h1 className="text-xl font-semibold truncate">{post.title}</h1>
          <CopyLink />
        </div>
        <div className="flex justify-between text-muted-foreground text-sm">
          <p>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex gap-4">
            <p>{post.views + 1} views</p>
            <p>{readingTime} minute read</p>
          </div>
        </div>
        <Separator />
      </div>
      <article className="prose prose-muted dark:prose-invert max-w-2xl mx-auto prose-img:shadow-2xl prose-img:rounded-md prose-img:mx-auto dark:prose-p:text-white prose-p:text-black">
        <MDXRemote source={post.content} />
      </article>
      {post.updatedAt && (
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-muted-foreground text-sm flex justify-end">
            Last updated{" "}
            {new Date(post.updatedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      <Separator className="max-w-2xl mx-auto" />

      <div className="flex justify-between max-w-2xl mx-auto gap-4">
        {prevPost && (
          <Link
            href={`/article/${prevPost.slug}`}
            className={`flex gap-2 max-w-[20rem] w-full h-auto ${buttonVariants(
              {
                variant: "ghost",
              },
            )}`}
            style={{ justifyContent: "flex-start" }}
          >
            {prevPost.title}
          </Link>
        )}

        {nextPost && (
          <Link
            href={`/article/${nextPost.slug}`}
            className={`flex gap-2 max-w-[20rem] w-full h-auto ${buttonVariants(
              {
                variant: "ghost",
              },
            )}`}
            style={{ justifyContent: "flex-end" }}
          >
            {nextPost.title}
          </Link>
        )}
      </div>
    </div>
  );
}
