"use client";

import { useParams } from "next/navigation";
import PageContentEditor from "@/components/PageContentEditor";

export default function EditPageContent() {
  const params = useParams<{ slug: string }>();

  return <PageContentEditor slug={params.slug} />;
}