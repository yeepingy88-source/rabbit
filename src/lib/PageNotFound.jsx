import { useLocation, Link } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-slate-600 mb-6">
        Page not found: <code className="bg-slate-200 px-1 rounded">{pageName}</code>
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition"
      >
        Back to Game
      </Link>
    </div>
  );
}
