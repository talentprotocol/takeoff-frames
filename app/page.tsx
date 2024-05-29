import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { FRAMES_BASE_PATH, appURL } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "TakeOff EthCC Brussels",
    description: "TakeOff by Talent Protocol",
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
