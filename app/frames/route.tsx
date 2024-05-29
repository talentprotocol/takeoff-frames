/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { appURL } from "@/lib/utils";
import { getTalentProtocolVoting } from "@/lib/talent-protocol";

const handler = frames(async (ctx) => {
  const voting = await getTalentProtocolVoting("eth-cc");
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "code",
  });
  const prize_pool = formatter
    .format(voting?.prize_pool || 0)
    .replace("USD", "");

  return {
    image: (
      <div tw="relative flex flex-col text-center items-center justify-center">
        <img
          src={`${appURL()}/images/voting/frame-voting-landing.jpg`}
          tw="w-full"
        />
        <div tw="absolute top-[250px] left-[75px] w-[975px] flex text-[#DFDFE1]">
          <p tw="text-[80px]" style={{ fontFamily: "Inter-Bold" }}>
            {`${prize_pool || "XXX"} $TAL`}
          </p>
          <div tw="flex flex-col mx-auto items-center justify-around my-[25px]"></div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" key="1" target="/apply">
        Apply
      </Button>,
      <Button action="post" key="2" target="/vote">
        Vote
      </Button>,
      <Button
        action="link"
        key="3"
        target="https://www.notion.so/talentprotocol/Scholarships-EthCC-Take-Off-How-To-Guides-35161a8e649942a6b636b9e4d6b295c0"
      >
        Learn more
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = handler;
export const POST = handler;
