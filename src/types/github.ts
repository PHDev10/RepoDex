export interface GitHubRepo {
  id: number;
  repoName: string;
  repoUrl: string;
  stars: number;
  language: string | null;
  ownerName: string;
  ownerAvatar: string;
  ownerUrl: string;
  ownerBio: string | null;
  ownerReposCount: number;
}
