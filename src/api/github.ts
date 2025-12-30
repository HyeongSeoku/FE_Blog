const GIT_API_URL = "https://api.github.com";
const TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export interface GithubUserInfo {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email?: string;
  hireable?: string;
  bio?: string;
  twitter_username?: null;
  notification_email?: null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export const fetchGithubUserInfo = async (): Promise<GithubUserInfo | null> => {
  if (!TOKEN) {
    return null;
  }

  try {
    const response = await fetch(`${GIT_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      console.warn("Failed to fetch GitHub user info");
      return null;
    }

    return response.json();
  } catch (error) {
    console.warn("Failed to fetch GitHub user info", error);
    return null;
  }
};
