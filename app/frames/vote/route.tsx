/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { appURL, getRotateDeg } from "@/lib/utils";
import {
  getTalentProtocolUser,
  getTalentProtocolVoting,
  getTalentProtocolVotingCandidate,
  getTalentProtocolVotingLeaderboard,
} from "@/lib/talent-protocol";

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

    // check if userAddress has a Talent Protocol Passport associated
    await getTalentProtocolUser(userAddress);

    const nominatedUsername = ctx.message?.inputText
      ?.replaceAll("@", "")
      .trim();

    if (!nominatedUsername) {
      const pageIndex = parseInt(ctx.url.searchParams.get("index") || "1");

      const [voting, leaderboard] = await Promise.all([
        getTalentProtocolVoting("eth-cc"),
        getTalentProtocolVotingLeaderboard("eth-cc", pageIndex),
      ]);
      if (!voting || !leaderboard) throw new Error("Voting not found");

      const leaderboardRotateMap = new Map<string, number>();
      for (let i = 0; i < leaderboard.length; i++) {
        const rotateDeg = await getRotateDeg(
          leaderboard[i].profile_picture_url
        );
        leaderboardRotateMap.set(leaderboard[i].profile_picture_url, rotateDeg);
      }

      const hasNextButton = voting.candidates_count - 6 * pageIndex > 0;
      const halfIndex = Math.floor(leaderboard.length / 2);

      return {
        image: (
          <div tw="relative flex">
            <img
              src={`${appURL()}/images/voting/frame-leaderboard-new.jpg`}
              tw="w-full"
            />
            <div tw="absolute top-[350px] left-0 w-[1025px] h-[575px] flex px-[55px] text-[#F7F7F7]">
              <div tw="flex my-auto">
                <div tw="flex flex-col mx-[5px] border-r-2 border-[#7459EC]">
                  {leaderboard
                    .slice(0, halfIndex)
                    .map((user: any, index: number) => (
                      <UserComponent
                        user={user}
                        pageIndex={pageIndex}
                        index={index}
                        halfIndex={halfIndex}
                        key={user.username}
                        isSecondHalf={false}
                        rotateDeg={
                          leaderboardRotateMap.get(user.profile_picture_url) ||
                          0
                        }
                      />
                    ))}
                </div>
                <div tw="flex flex-col">
                  {leaderboard
                    .slice(halfIndex)
                    .map((user: any, index: number) => (
                      <UserComponent
                        user={user}
                        pageIndex={pageIndex}
                        index={index}
                        halfIndex={halfIndex}
                        key={user.username}
                        isSecondHalf={true}
                        rotateDeg={
                          leaderboardRotateMap.get(user.profile_picture_url) ||
                          0
                        }
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        ),
        textInput: "Candidate username to vote for:",
        buttons: [
          <Button action="post" key="1" target={`/vote?index=${pageIndex}`}>
            {`Vote ✅`}
          </Button>,
          <Button
            action="post"
            key="2"
            target={pageIndex > 1 ? `/vote?index=${pageIndex - 1}` : "/"}
          >
            {`⬅️ Back`}
          </Button>,
          hasNextButton && (
            <Button
              action="post"
              key="3"
              target={`/vote?index=${pageIndex + 1}`}
            >
              {`Next ➡️`}
            </Button>
          ),
        ],
        imageOptions: {
          aspectRatio: "1:1",
        },
      };
    } else {
      const nominatedUser = await getTalentProtocolVotingCandidate(
        "eth-cc",
        nominatedUsername
      );
      if (!nominatedUser) throw new Error("Nominated user not found");

      const imgUrl = nominatedUser.profile_picture_url;
      const rotateDeg = await getRotateDeg(imgUrl);

      return {
        image: (
          <div tw="relative flex">
            <img
              src={`${appURL()}/images/voting/frame-leaderboard-new.jpg`}
              tw="w-full"
            />
            <div tw="absolute top-[365px] left-[55px] w-[975px] h-[555px] flex text-[#F7F7F7]">
              <div tw="flex flex-col mx-auto items-center justify-around my-[25px]">
                <img
                  src={imgUrl}
                  tw="h-[250px] w-[250px] rounded-full"
                  style={{
                    transform: `rotate(${rotateDeg}deg)`,
                    objectFit: "cover",
                  }}
                />
                <div tw="flex flex-col mx-auto text-center items-center">
                  <p
                    tw="text-[58px] text-[#F0F4F8] my-auto"
                    style={{ fontFamily: "Inter-Bold" }}
                  >
                    {nominatedUser.name}
                  </p>
                  <p tw="text-[42px] text-[#9FA6AD] my-auto">
                    {`@${nominatedUser.username}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        buttons: [
          <Button
            action="link"
            key="1"
            target={`https://play.talentprotocol.com/votings/eth-cc?open_voting_modal=true&name=${nominatedUser.username}`}
          >
            {`Vote ✅`}
          </Button>,
          <Button action="post" key="3" target={`/vote`}>
            {`⬅️ Back`}
          </Button>,
        ],
        imageOptions: {
          aspectRatio: "1:1",
        },
      };
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "An error occurred";
    if (errorMessage === "Passport not found") {
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
            target="https://talentprotocol.notion.site/EthCC-Scholarship-How-To-Vote-Guide-47fe0b37b079405787bd4d412973ab15?pvs=4"
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
          <img src={`${appURL()}/images/voting/frame-error.jpg`} tw="w-full" />
          <div tw="absolute bottom-[40px] left-[55px] w-[975px] h-[480px] flex text-[#F7F7F7]">
            <div tw="flex flex-col mx-auto items-center justify-around my-[25px]">
              <p tw="text-[80px]" style={{ fontFamily: "Inter-Bold" }}>
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" key="1" target="/vote">
          {`⬅️ Back to Vote`}
        </Button>,
        <Button action="post" key="2" target="/">
          Home
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

const UserComponent = ({
  user,
  pageIndex,
  index,
  halfIndex,
  isSecondHalf,
  rotateDeg,
}: any) => {
  const tmpIndex = isSecondHalf ? halfIndex + index : index;
  const newIndex = pageIndex > 1 ? tmpIndex + 6 * (pageIndex - 1) : tmpIndex;

  return (
    <div tw="flex justify-around h-[70px] w-[480px] my-[10px] mx-auto px-[20px]">
      <p tw="text-[21px] my-auto w-[50px]" style={{ fontFamily: "Inter-Bold" }}>
        {`#${newIndex + 1}`}
      </p>
      <div tw="flex items-center w-[250px]">
        <img
          src={user.profile_picture_url}
          tw="h-[60px] w-[60px] rounded-full mr-[10px]"
          style={{ transform: `rotate(${rotateDeg}deg)`, objectFit: "cover" }}
        />
        <div tw="flex flex-col">
          <p
            tw="text-[18px] text-[#F0F4F8] my-auto"
            style={{ fontFamily: "Inter-Bold" }}
          >
            {user.name.slice(0, 20)}
          </p>
          <p tw="text-[20px] text-[#E5E7E9] my-auto">{`@${user.username}`}</p>
        </div>
      </div>

      <p tw="flex text-[19px] ml-[10px] px-[9px] rounded-[6px] text-white border-2 border-[#32383E] my-auto">
        {`${user.score} votes`}
      </p>
    </div>
  );
};
