import { PropsWithChildren } from "react";
import ConfettiBackground from "./ConfettiBackground";
import { BottomNav, TopNav } from "./Nav";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative min-h-screen">
      <ConfettiBackground />
      <TopNav />
      <main className="pt-6 pb-28 md:pt-24 md:pb-12">{children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout;
