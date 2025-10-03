import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="pt-16">{children}</div>;
};

export default Layout;