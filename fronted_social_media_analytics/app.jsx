import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Feed from './pages/Feed';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';

export default function App() {
  return (
    <Router>
      <nav className="bg-blue-600 p-4 flex gap-6 text-white">
        <NavLink to="/">Feed</NavLink>
        <NavLink to="/top-users">Top Users</NavLink>
        <NavLink to="/trending-posts">Trending Posts</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/top-users" element={<TopUsers />} />
        <Route path="/trending-posts" element={<TrendingPosts />} />
      </Routes>
    </Router>
  );
}