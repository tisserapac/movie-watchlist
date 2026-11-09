import { Link } from 'react-router';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <section className="not-found">
      <h2>Page not found</h2>
      <p>There is nothing at this address.</p>
      <Link to="/">Back to your watchlist</Link>
    </section>
  );
}

export default NotFoundPage;
