/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { appURL } from "@/lib/utils";

const UserComponent = ({ user, index, halfIndex, isSecondHalf }: any) => {
  const newIndex = isSecondHalf ? halfIndex + index : index;
  return (
    <div tw="flex flex-row justify-around h-[70px] w-[480px] my-[10px] mx-auto px-[20px]">
      <p tw="text-[26px] my-auto w-[60px]" style={{ fontFamily: "Inter-Bold" }}>
        {`#${newIndex + 1}`}
      </p>

      <div tw="flex flex-row items-center w-[250px]">
        <img
          src={user.profile_picture_url}
          tw="h-[56px] w-[56px] rounded-full my-auto object-cover mr-[20px]"
        />
        <div tw="flex flex-col">
          <p
            tw="text-[19px] text-[#F0F4F8] my-auto"
            style={{ fontFamily: "Inter-Bold" }}
          >
            {user.name}
          </p>
          <p tw="text-[17px] text-[#9FA6AD] my-auto">{`@${user.username}`}</p>
        </div>
      </div>

      <p tw="flex text-[19px] px-[9px] rounded-[6px] text-white border-2 border-[#32383E] my-auto">
        {`${user.current_user_votes_count} votes`}
      </p>
    </div>
  );
};

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

    const index = parseInt(ctx.url.searchParams.get("index") || "1");

    const url = `${process.env.TALENT_API_URL}/api/v1/votings/eth-cc/candidates_leaderboard?page=${index}&per_page=10`;
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.TALENT_API_TOKEN || "",
    };
    const response = await fetch(url, { headers });
    const data = (await response.json()) as any;
    const halfIndex = Math.floor(data.leaderboard.results.length / 2);

    if (
      !response.ok ||
      response.status !== 200 ||
      data.error ||
      !data.leaderboard
    ) {
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

    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          <img
            src={`${appURL()}/images/voting/frame-leaderboard.jpg`}
            tw="w-full"
          />
          <div tw="absolute top-[450px] left-0 w-[1025px] h-[480px] flex flex-row px-[55px] text-[#F7F7F7]">
            <div tw="flex flex-row my-auto">
              <div tw="flex flex-col mx-[5px] border-r-2 border-[#7459EC]">
                {data.leaderboard.results
                  .slice(0, halfIndex)
                  .map((user: any, index: number) => (
                    <UserComponent
                      user={user}
                      index={index}
                      halfIndex={halfIndex}
                      key={user.username}
                      isSecondHalf={false}
                    />
                  ))}
              </div>
              <div tw="flex flex-col">
                {data.leaderboard.results
                  .slice(halfIndex)
                  .map((user: any, index: number) => (
                    <UserComponent
                      user={user}
                      index={index}
                      halfIndex={halfIndex}
                      key={user.username}
                      isSecondHalf={true}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ),
      textInput: "Select a candidate to vote for: ",
      buttons: [
        <Button action="post" key="1" target={`/vote/address`}>
          Vote
        </Button>,
        <Button action="post" key="2" target={`/vote?index=${index + 1}`}>
          Next
        </Button>,
        <Button action="post" key="3" target="/">
          Back
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  } catch (error) {
    console.error("error on vote route", error);
    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          <img
            src={`${appURL()}/images/voting/frame-leaderboard.jpg`}
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
          target="https://play.talentprotocol.com/votings/eth-cc"
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
