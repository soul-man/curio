import React, { useEffect, useState } from 'react';
import { FaTelegram, FaDiscord, FaMedium, FaTwitter } from 'react-icons/fa';
import TwitterFeed from './TwitterFeed';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_name: string;
  author_username: string;
}

const SocialMediaSection = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch('/api/twitter');
        if (!response.ok) {
          throw new Error('Failed to fetch tweets');
        }
        const data = await response.json();
        setTweets(data);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-5 mb-20 md:mb-32">

        {/* Social Media Links */}
        <div className="w-full">
          <h4 className="text-2xl font-semibold text-white text-center">Join CURIO DAO Community</h4>
          <p className="text-lg sm:text-xl md:text-xl w-full text-center font-extralight text-blue-300/80 mb-5">
          Stay updated with the latest news and join curio community on various platforms
        </p>
          <div className="flex flex-row justify-center gap-4">
          <a href="https://twitter.com/curio_invest" target="_blank" rel="noopener noreferrer" className="flex items-center text-white rounded-md p-3 transition duration-300">
              <FaTwitter className="text-4xl mr-3" />
            </a>
            <a href="https://t.me/curioinvest" target="_blank" rel="noopener noreferrer" className="flex items-center text-white p-3 transition duration-300">
              <FaTelegram className="text-4xl mr-3" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center text-white p-3 transition duration-300">
              <FaDiscord className="text-4xl mr-3" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center text-white p-3 transition duration-300">
              <FaMedium className="text-4xl mr-3" />
            </a>
          </div>
        </div>

      {/* <div className="flex flex-col md:flex-row gap-5">
        <TwitterFeed />
      </div> */}

    </div>
  );
};

export default SocialMediaSection;