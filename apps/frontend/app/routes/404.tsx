import { Link } from "@remix-run/react";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
}
