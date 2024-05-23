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
        : ctx.message?.verifiedWalletAddress; // XMTP wallet address

    if (!userAddress) {
      throw new Error("User address not found");
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
    console.log("passport data", data);
    if (!response.ok || response.status !== 200 || data.error || !data.passport)
      throw new Error("Error fetching passport data");

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
        <Button
          action="link"
          key="1"
          target="https://play.talentprotocol.com/votings/eth-cc"
        >
          Successfully applied
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
            src={`${appURL()}/images/frame-application-brussels.png`}
            tw="w-full"
          />
        </div>
      ),
      buttons: [
        <Button action="link" key="1" target="https://play.talentprotocol.com/">
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
  }
});

export const GET = handler;
export const POST = handler;
