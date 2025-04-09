export default function UserCard({ user, commentCount }) {
  return (
    <div className="p-4 bg-gray-100 shadow rounded-xl mb-2">
      <h4 className="font-semibold">{user}</h4>
      <p className="text-sm text-gray-500">Total Comments on Posts: {commentCount}</p>
    </div>
  );
}