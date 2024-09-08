import React, { useEffect, useState } from 'react';

const TwitterFeed = () => {
  const [twitterHtml, setTwitterHtml] = useState('');

  useEffect(() => {
    const fetchTweets = async () => {
      const response = await fetch('/api/twitter');
      const data = await response.json();
      setTwitterHtml(data.html);
    };

    fetchTweets();
  }, []);

  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: twitterHtml }} />
  );
};

export default TwitterFeed;