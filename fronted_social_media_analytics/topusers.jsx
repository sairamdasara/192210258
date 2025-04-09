import { useEffect, useState } from 'react';
import { fetchUsers, fetchUserPosts, fetchPostComments } from '../services/api';
import UserCard from '../components/UserCard';

export default function TopUsers() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    async function loadTopUsers() {
      const userRes = await fetchUsers();
      const userMap = userRes.data.users;

      const commentCounts = [];

      for (let userId in userMap) {
        const postsRes = await fetchUserPosts(userId);
        let totalComments = 0;

        for (const post of postsRes.data.posts) {
          const commentsRes = await fetchPostComments(post.id);
          totalComments += commentsRes.data.comments.length;
        }

        commentCounts.push({ userId, userName: userMap[userId], commentCount: totalComments });
      }

      commentCounts.sort((a, b) => b.commentCount - a.commentCount);
      setTopUsers(commentCounts.slice(0, 5));
    }

    loadTopUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Top Users</h2>
      {topUsers.map(user => (
        <UserCard key={user.userId} user={user.userName} commentCount={user.commentCount} />
      ))}
    </div>
  );
}