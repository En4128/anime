import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-[#05060a] text-white">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl px-4 py-8">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;

