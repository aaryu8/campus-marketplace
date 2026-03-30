import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = 'force-dynamic';

type Props = {
  children: React.ReactNode;
};

const Layout = async (props: Props) => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_id");

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="overflow-y-clip h-screen">
      <Separator />
      {props.children}
    </div>
  );
};

export default Layout;