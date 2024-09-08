import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface TwitterApiResponse {
  data: {
    public_metrics: {
      followers_count: number;
    };
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  const bearerToken = process.env.NEXT_TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    return res.status(500).json({ error: 'Twitter bearer token is not configured' });
  }

  try {
    // Note: This URL might need to be updated based on the latest Twitter API documentation
    const response = await axios.get<TwitterApiResponse>(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        params: {
          'user.fields': 'public_metrics',
        },
      }
    );

    const followerCount = response.data.data.public_metrics.followers_count;
    return res.status(200).json({ username, followerCount });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response from Twitter API:', axiosError.response.data);
        return res.status(axiosError.response.status).json({ 
          error: `Twitter API error: ${axiosError.response.status}`,
          message: axiosError.response.data
        });
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error('No response received from Twitter API');
        return res.status(500).json({ error: 'No response from Twitter API' });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', axiosError.message);
        return res.status(500).json({ error: 'Error setting up request to Twitter API' });
      }
    } else {
      // Non-Axios error
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Unexpected error occurred' });
    }
  }
}