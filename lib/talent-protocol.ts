import { unstable_cache } from "next/cache";

export const CACHE_1_MINUTE = 60;
export const CACHE_5_MINUTES = 60 * 5;
export const CACHE_1_HOUR = 60 * 60;
export type CacheKey =
  | `talent_protocol_${string}`
  | `talent_protocol_search_${string}`
  | `talent_protocol_voting_${string}`
  | `talent_protocol_voting_eth-cc_page_${string}`;

export const getTalentProtocolUser = async (walletId: string) => {
  return unstable_cache(
    async (id: string) => {
      const api_url = process.env.TALENT_API_URL;
      const api_token = process.env.TALENT_API_TOKEN;
      const url = `${api_url}/api/v2/passports/${id}`;
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
      )
        throw new Error("Passport not found");

      return data.passport;
    },
    [`talent_protocol_${walletId}`] as CacheKey[],
    { revalidate: CACHE_5_MINUTES }
  )(walletId);
};

export const searchTalentProtocolUser = async (query: string) => {
  return unstable_cache(
    async (query: string) => {
      const api_url = process.env.TALENT_API_URL;
      const api_token = process.env.TALENT_API_TOKEN;
      const url = `${api_url}/api/v2/passports?keyword=${query}&page=1&per_page=1`;
      const headers = {
        "Content-Type": "application/json",
        "X-API-KEY": api_token || "",
      };

      if (!api_token || !api_url) {
        throw new Error("API token or URL not found");
      }

      const response = await fetch(url, { headers });
      if (!response.ok || response.status !== 200)
        throw new Error("User not found");

      const data = (await response.json()) as any;
      return data.passports[0];
    },
    [`talent_protocol_search_${query}`] as CacheKey[],
    { revalidate: CACHE_5_MINUTES }
  )(query);
};

export const getTalentProtocolVoting = async (votingSlug: string) => {
  return unstable_cache(
    async (votingSlug: string) => {
      const api_url = process.env.TALENT_API_URL;
      const api_token = process.env.TALENT_API_TOKEN;
      const url = `${api_url}/api/v1/votings/${votingSlug}`;
      const headers = {
        "Content-Type": "application/json",
        "X-API-KEY": api_token || "",
      };

      if (!api_token || !api_url) {
        throw new Error("API token or URL not found");
      }

      const response = await fetch(url, { headers });
      if (!response.ok || response.status !== 200)
        throw new Error("Voting not found");

      const data = (await response.json()) as any;
      return data.voting;
    },
    [`talent_protocol_voting_${votingSlug}`] as CacheKey[],
    { revalidate: CACHE_1_HOUR }
  )(votingSlug);
};

export const getTalentProtocolVotingLeaderboard = async (
  query: string,
  index: number
) => {
  return unstable_cache(
    async (query: string, index: number) => {
      const api_url = process.env.TALENT_API_URL;
      const api_token = process.env.TALENT_API_TOKEN;
      const url = `${api_url}/api/v1/votings/${query}/candidates_leaderboard?page=${index}&per_page=6`;
      const headers = {
        "Content-Type": "application/json",
        "X-API-KEY": api_token || "",
      };

      if (!api_token || !api_url) {
        throw new Error("API token or URL not found");
      }

      const response = await fetch(url, { headers });
      if (!response.ok || response.status !== 200)
        throw new Error("Voting not found");

      const data = (await response.json()) as any;
      return data.leaderboard?.results;
    },
    [`talent_protocol_voting_${query}_page_${index}`] as CacheKey[],
    { revalidate: CACHE_5_MINUTES }
  )(query, index);
};
