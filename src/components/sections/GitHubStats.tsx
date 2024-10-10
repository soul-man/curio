import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GitHubStats {
  totalRepos: number;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
}

const GitHubStats: React.FC<{ username: string }> = ({ username }) => {
  const { data, error } = useSWR<GitHubStats>(`/api/github-stats?username=${username}`, fetcher);

  if (error) return <div>Failed to load GitHub stats</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="bg-black/30 p-5 rounded-md">
      <h2 className="text-2xl font-bold mb-4">GitHub Stats for {username}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-semibold">Total Repositories</p>
          <p className="text-3xl">{data.totalRepos}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Total Commits</p>
          <p className="text-3xl">{data.totalCommits}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Total Additions</p>
          <p className="text-3xl">{data.totalAdditions}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Total Deletions</p>
          <p className="text-3xl">{data.totalDeletions}</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;