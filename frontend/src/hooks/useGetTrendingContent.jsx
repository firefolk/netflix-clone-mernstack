import { useEffect, useState } from 'react';
import { useContentStore } from '../store/content';
import axios from 'axios';

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const { contentType } = useContentStore();

  console.log('useGetTrendingContent hook rendered');
  console.log('Current contentType:', contentType);

  useEffect(() => {
    const getTrendingContent = async () => {
      try {
        console.log('Fetching trending content for:', contentType);
        const res = await axios.get(`/api/v1/${contentType}/trending`);
        console.log('Response from API:', res);
        console.log('Trending content fetched:', res.data.content);
        setTrendingContent(res.data.content);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      }
    };

    getTrendingContent();
  }, [contentType]);

  console.log('Current trendingContent state:', trendingContent);

  return { trendingContent };
};
export default useGetTrendingContent;
