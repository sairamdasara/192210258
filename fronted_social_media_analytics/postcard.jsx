export default function PostCard({ post, comments }) {
  return (
    <div className="p-4 bg-white shadow rounded-xl mb-4">
      <h3 className="font-bold">Post #{post.id}</h3>
      <p>{post.content}</p>
      <p className="text-sm text-gray-500">Comments: {comments?.length || 0}</p>
    </div>
  );
}