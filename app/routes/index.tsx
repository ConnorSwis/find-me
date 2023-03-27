import { Link } from "@remix-run/react";

export default function Index() {
  return (<>
    <h1>ooga booga</h1>
    <Link to="/login">Login</Link>
  </>);
}
