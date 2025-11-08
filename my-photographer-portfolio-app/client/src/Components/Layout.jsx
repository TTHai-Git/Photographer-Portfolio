import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Render current page here */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
