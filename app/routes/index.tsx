import { Link } from "@remix-run/react";
import { Layout } from "~/components/layout";

export default function Index() {
  return (
    <Layout>
      <div className="flex flex-col gap-10 justify-center items-center">
        <h1 className="text-5xl "><span className="p-1 pr-2 rounded-md text-black bg-primary-500">find</span>.me</h1>
        <Link to="/login">Login</Link>
      </div>
    </Layout>
  );
}
