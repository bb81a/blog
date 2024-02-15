import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const { userId } = auth();

    if (userId !== process.env.ADMIN_ID) {
      return new Response("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const { id, title, description, slug, tag, published } = json;

    await prisma.posts.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        slug: slug,
        tag: tag,
        published: published,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json("Something went wrong.", { status: 500 });
  }
}
