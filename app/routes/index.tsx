import { Link } from "@remix-run/react";
import { Layout } from "~/components/layout";

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col">
        <h1>Welcome</h1>
        <Link to="/login">Login</Link>
      </div>
    </Layout>
  );
};

