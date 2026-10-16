export interface GitHubRepo {
  id: number;
  repoName: string;
  stars: number;         // Dado 1 do repositório
  language: string;      // Dado 2 do repositório
  ownerName: string;
  ownerAvatar: string;   // Dado 1 do dono do repositório
  ownerUrl: string;      // Dado 2 do dono do repositório
}