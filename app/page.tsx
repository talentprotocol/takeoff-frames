import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { FRAMES_BASE_PATH, appURL } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "frames.js starter",
    description: "This is a frames.js starter template",
    other: {
      ...(await fetchMetadata(new URL(FRAMES_BASE_PATH, appURL()))),
    },
  };
}

// This is a react server component only
export default async function Home() {
  // then, when done, return next frame
  return (
    <div className="p-4">
      Apply to TakeOff Brussels{" "}
      <a
        href="https://play.talentprotocol.com/votings/eth-cc"
        target="_blank"
        className="underline cursor-pointer"
      >
        here
      </a>
      !
    </div>
  );
}
