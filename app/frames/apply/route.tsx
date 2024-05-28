/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { appURL } from "@/lib/utils";
import { getTalentProtocolUser } from "@/lib/talent-protocol";

const handler = frames(async (ctx) => {
  try {
    if (!ctx.message?.isValid) {
      throw new Error("Invalid message");
    }

    const userAddress =
      ctx.message?.requesterVerifiedAddresses &&
      ctx.message?.requesterVerifiedAddresses.length > 0
        ? ctx.message?.requesterVerifiedAddresses[0]
        : ctx.message?.requesterCustodyAddress ||
          ctx.message?.verifiedWalletAddress; // XMTP wallet address
    if (!userAddress) throw new Error("User not found");

    const talentProtocolUser = await getTalentProtocolUser(userAddress);

    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          <img src={`${appURL()}/images/frame-passport.jpg`} tw="w-full" />
          <div tw="absolute top-[150px] left-0 w-full h-full flex flex-col gap-0 px-[20px] text-[#F7F7F7] text-[90px]">
            <p tw="mx-auto">{`Hey ${talentProtocolUser.user.name},`}</p>
            <p tw="mx-auto" style={{ marginTop: "-90px" }}>
              ready for Brussels?
            </p>
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="link"
          key="1"
          target={`https://play.talentprotocol.com/votings/eth-cc`}
        >
          Confirm apply
        </Button>,
        <Button action="post" key="2" target="/">
          Back
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  } catch (error) {
    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          <img
            src={`${appURL()}/images/frame-passport-not-found.jpg`}
            tw="w-full"
          />
        </div>
      ),
      buttons: [
        <Button
          action="link"
          key="1"
          target="https://passport.talentprotocol.com/signin"
        >
          Create Passport
        </Button>,
        <Button
          action="link"
          key="2"
          target="https://www.notion.so/talentprotocol/Scholarships-EthCC-Take-Off-How-To-Apply-Guide-ec06928c69aa49699649256690d4b781?pvs=4"
        >
          Learn More
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  }
});

export const GET = handler;
export const POST = handler;
