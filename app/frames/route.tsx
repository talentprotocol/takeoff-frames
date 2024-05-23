/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { appURL } from "@/lib/utils";

const handler = frames(async (ctx) => {
  return {
    image: (
      <div tw="relative flex flex-col text-center items-center justify-center">
        <img
          src={`${appURL()}/images/frame-application-brussels.png`}
          tw="w-full"
        />
      </div>
    ),
    buttons: [
      <Button action="post" key="1" target="/apply">
        Apply
      </Button>,
      <Button
        action="link"
        key="2"
        target="https://passport.talentprotocol.com/signin"
      >
        Sign up to passport
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = handler;
export const POST = handler;
