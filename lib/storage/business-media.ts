import { supabase } from "@/lib/supabase/client";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getExtension(file: File) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || "";

  if (
    ["jpg", "jpeg", "png", "webp"]
      .includes(extension)
  ) {
    return extension === "jpeg"
      ? "jpg"
      : extension;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function cleanFolder(value: string) {
  return value.replace(
    /[^a-zA-Z0-9_-]/g,
    "",
  );
}

export function validateBusinessImage(
  file: File,
) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      "Use a JPG, PNG or WebP image.",
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "The image must be smaller than 5 MB.",
    );
  }
}

export async function uploadBusinessImage({
  file,
  bucket,
  folder,
}: {
  file: File;
  bucket:
    | "business-images"
    | "deal-images";
  folder: string;
}) {
  validateBusinessImage(file);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be logged in.",
    );
  }

  const extension =
    getExtension(file);

  const path = [
    user.id,
    cleanFolder(folder),
    `${crypto.randomUUID()}.${extension}`,
  ].join("/");

  const { error } =
    await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

  if (error) {
    throw new Error(
      error.message ||
        "Could not upload image.",
    );
  }

  const { data } =
    supabase.storage
      .from(bucket)
      .getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
