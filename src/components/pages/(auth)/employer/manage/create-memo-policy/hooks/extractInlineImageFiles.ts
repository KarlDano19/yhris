const BASE64_IMG_SRC_REGEX = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;

/**
 * Extracts every base64-embedded image left in a drafted memo body (from the Quill
 * image button/drop) as a File, in the same left-to-right order they appear in the body.
 * These get appended to the same create/update request as `inline_images` — the backend
 * uploads them, ties each to the directive, and swaps the body's base64 src for the
 * resulting storage path, in that same request/response cycle.
 */
export async function extractInlineImageFiles(body: string): Promise<File[]> {
  const matches = Array.from(body.matchAll(BASE64_IMG_SRC_REGEX));
  const files: File[] = [];

  for (const match of matches) {
    const dataUrl = match[1];
    const blob = await (await fetch(dataUrl)).blob();
    // MIME subtypes aren't always valid file extensions on their own — e.g. SVG is
    // "image/svg+xml", and a literal ".svg+xml" file extension gets served with the
    // wrong (or no) Content-Type, so browsers refuse to render it as an <img>.
    const extension = (blob.type.split('/')[1] || 'png').split('+')[0];
    files.push(new File([blob], `inline-image.${extension}`, { type: blob.type }));
  }

  return files;
}
