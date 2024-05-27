/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { appURL } from "@/lib/utils";

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
    const userName = ctx.message?.requesterUserData?.username || "";

    if (!userAddress) {
      throw new Error("User not found");
    }

    const api_url = process.env.TALENT_API_URL;
    const api_token = process.env.TALENT_API_TOKEN || "";
    // voting url const url = `${api_url}/api/v1/votings/eth-cc`;
    const url = `${api_url}/api/v2/passports/${userAddress}`;
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": api_token || "",
    };
    const response = await fetch(url, { headers });
    const data = (await response.json()) as any;
    if (
      !response.ok ||
      response.status !== 200 ||
      data.error ||
      !data.passport
    ) {
      return {
        image: (
          <div tw="relative flex flex-col text-center items-center justify-center">
            <img
              src={`${appURL()}/images/frame-passport-not-found.png`}
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

    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          <img src={`${appURL()}/images/frame-passport.png`} tw="w-full" />
          <div tw="absolute top-[150px] left-0 w-full h-full flex flex-col gap-0 px-[20px] text-[#F7F7F7] text-[98px]">
            <p tw="mx-auto">{`Hey ${userName},`}</p>
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
          target="https://play.talentprotocol.com/votings/eth-cc"
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
            src={`${appURL()}/images/frame-passport-not-found.png`}
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
