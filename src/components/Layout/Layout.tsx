import React from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

interface LayoutProps {
  content: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ content }) => {
  return (
    <div>
      <Navbar />
      <div style={{ position: "relative", width: "100vw" }}>
        {content}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;