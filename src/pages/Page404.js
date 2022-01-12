import { Link } from "react-router-dom";

export const Page404 = () => (
  <div className="text-center">
    <h1>404 Error Page</h1>
    <p className="zoom-area">Page was not found</p>
    <section className="error-container">
      <span className="four">
        <span className="screen-reader-text">4</span>
      </span>
      <span className="zero">
        <span className="screen-reader-text">0</span>
      </span>
      <span className="four">
        <span className="screen-reader-text">4</span>
      </span>
    </section>
    <div className="link-container">
      <Link to="/" className="btn btn-light">
        Go to home
      </Link>
    </div>
  </div>
);
