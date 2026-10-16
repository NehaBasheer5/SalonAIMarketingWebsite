"use client";

import { useParams } from "next/navigation";
import FeaturePostForm from "@/components/FeaturePostForm";

export default function EditFeaturePostPage() {
  const params = useParams<{ id: string }>();

  return <FeaturePostForm postId={Number(params.id)} />;
}
