import { useEffect, useState } from 'react';
import { fetchUsers, fetchUserPosts, fetchPostComments } from '../services/api';
import PostCard from '../components/PostCard';

export default function TrendingPosts() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    async function loadTrending() {
      const userRes = await fetchUsers();
      const userMap = userRes.data.users;
      const postsWithCommentCount = [];

      for (let userId in userMap) {
        const postsRes = await fetchUserPosts(userId);

        for (const post of postsRes.data.posts) {
          const commentsRes = await fetchPostComments(post.id);
          postsWithCommentCount.push({
            ...post,
            commentCount: commentsRes.data.comments.length,
          });
        }
      }

      const max = Math.max(...postsWithCommentCount.map(p => p.commentCount));
      const trendingPosts = postsWithCommentCount.filter(p => p.commentCount === max);

      setTrending(trendingPosts);
    }

    loadTrending();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Trending Posts</h2>
      {trending.map(post => (
        <PostCard key={post.id} post={post} comments={Array(post.commentCount)} />
      ))}
    </div>
  );
}