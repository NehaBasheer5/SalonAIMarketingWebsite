import Image, { type StaticImageData } from "next/image";
import { isVideoPath, resolveImageUrl } from "@/lib/content";

type Props = {
  /** Value coming from the CMS. An empty string falls back to `fallback`. */
  value?: string | null;
  /** Bundled image used when the CMS has nothing set. */
  fallback?: StaticImageData;
  alt: string;
  className?: string;
  fill?: boolean;
  /** Intrinsic size for CMS uploads, which are bare URLs with no dimensions. */
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

/**
 * Renders a CMS supplied media file, transparently falling back to the bundled
 * asset whenever the admin has not uploaded a replacement.
 *
 * Section media can be an image or a video, so videos bypass `next/image`,
 * which cannot handle them.
 */
export default function CmsImage({
  value,
  fallback,
  alt,
  className,
  fill,
  width: widthProp,
  height: heightProp,
  sizes,
  priority,
}: Props) {
  const resolved = resolveImageUrl(value);

  if (!resolved && fallback) {
    return <Image src={fallback} alt={alt} className={className} fill={fill} sizes={sizes} priority={priority} />;
  }

  if (!resolved) return null;

  if (isVideoPath(resolved)) {
    return (
      <video
        src={resolved}
        className={className}
        poster={undefined}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
        aria-label={alt}
        width={fill ? undefined : widthProp}
        height={fill ? undefined : heightProp}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : undefined}
      />
    );
  }

  // A CMS upload is a bare URL string, so `next/image` has no intrinsic size to
  // read. Use the explicit size, then the fallback's, and only resort to `fill`
  // when the caller gave us nothing to size the box with.
  const width = widthProp ?? fallback?.width;
  const height = heightProp ?? fallback?.height;
  const useFill = fill || !width || !height;

  return (
    <Image
      src={resolved}
      alt={alt}
      className={className}
      fill={useFill}
      sizes={useFill ? sizes ?? "100vw" : sizes}
      width={useFill ? undefined : width}
      height={useFill ? undefined : height}
      priority={priority}
    />
  );
}
