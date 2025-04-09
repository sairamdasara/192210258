import { useEffect, useState } from 'react';
import { fetchUsers, fetchUserPosts } from '../services/api';
import PostCard from '../components/PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let interval;

    async function fetchAllPosts() {
      const userRes = await fetchUsers();
      const userMap = userRes.data.users;
      const allPosts = [];

      for (let userId in userMap) {
        const postsRes = await fetchUserPosts(userId);
        allPosts.push(...postsRes.data.posts);
      }

      const sorted = allPosts.sort((a, b) => b.id - a.id); // Assuming id correlates with recency
      setPosts(sorted);
    }

    fetchAllPosts();
    interval = setInterval(fetchAllPosts, 10000); // Polling every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Live Feed</h2>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}