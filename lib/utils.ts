import ExifReader from "exifreader";
import { headers } from "next/headers";

const DEFAULT_DEBUGGER_URL =
  process.env.DEBUGGER_URL ?? "http://localhost:3010/";

export const DEFAULT_DEBUGGER_HUB_URL =
  process.env.NODE_ENV === "development"
    ? new URL("/hub", DEFAULT_DEBUGGER_URL).toString()
    : undefined;

export function currentURL(pathname: string): URL {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  try {
    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    return new URL("http://localhost:3000");
  }
}

export function appURL() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  } else {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
}

export function createDebugUrl(frameURL: string | URL): string {
  try {
    const url = new URL("/", DEFAULT_DEBUGGER_URL);

    url.searchParams.set("url", frameURL.toString());

    return url.toString();
  } catch (error) {
    return "#";
  }
}

export const FRAMES_BASE_PATH = "/frames";

export const getRotateDeg = async (imgUrl: string): Promise<number> => {
  const exifTags = await ExifReader.load(imgUrl);
  const orientationTag = exifTags?.["Orientation"];
  let rotateDeg = 0;
  if (orientationTag) {
    switch (orientationTag.value) {
      case 3:
        rotateDeg = 180;
        break;
      case 6:
        rotateDeg = 90;
        break;
      case 8:
        rotateDeg = 270;
        break;
    }
  }
  return rotateDeg;
};
