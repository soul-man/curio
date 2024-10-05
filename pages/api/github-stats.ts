import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;
  
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const reposResponse = await axios.get(`${GITHUB_API_BASE}/users/${username}/repos`);
    const repos = reposResponse.data;

    let totalCommits = 0;
    let totalAdditions = 0;
    let totalDeletions = 0;

    for (const repo of repos) {
      try {
        const commitsResponse = await axios.get(`${GITHUB_API_BASE}/repos/${username}/${repo.name}/stats/participation`);
        if (commitsResponse.data.owner) {
          totalCommits += commitsResponse.data.owner.reduce((sum: number, count: number) => sum + count, 0);
        }

        const frequencyResponse = await axios.get(`${GITHUB_API_BASE}/repos/${username}/${repo.name}/stats/code_frequency`);
        for (const week of frequencyResponse.data) {
          totalAdditions += week[1];
          totalDeletions += Math.abs(week[2]);
        }
      } catch (repoError) {
        console.error(`Error fetching stats for repo ${repo.name}:`, repoError);
      }
    }

    res.status(200).json({
      totalRepos: repos.length,
      totalCommits,
      totalAdditions,
      totalDeletions
    });
  } catch (error: any) {
    console.error('Error fetching GitHub stats:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching GitHub stats', details: error.response?.data || error.message });
  }
}