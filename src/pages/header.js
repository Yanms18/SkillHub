// Header.js
import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Contact from './contact';
import NotFound from './NotFound';
import Signin from './signin';
import ErrorBoundary from '../ErrorBoundary';
import Consumer from './consumer';
import Artisan from './Artisan';
import '../nav.css';
import Getstarted from './getstarted';
import ViewProfile from '../viewprofile';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTrades } from '../TradesContext'; 
import ChatBox from './chatBox';
import ConsumerBTN from './consumerbtn';
import Nextstep from './nextstep';
import Laststep from './laststep';
import Consumerpages from './consumerpages';
import Hire from './hirepage';
import HiringartisanPage from './hiringartisanpage';
import ConsumerNextPage from './consumerNextpage';
import ConsumerVerificationPage from './consumerVericationPage';
import Dashboard from '../loginSection/dashboard';
import PaymentCallback from './PaymentCallback';
function Header() {
  const { tradespeople } = useTrades();
  const tradesperson = tradespeople[2]; // Using the first tradesperson as default
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          {/* Logo */}
          <div className="nav-logo">
            <Link to="/">
              <img src="/image.png" alt="Logo" />
            </Link>
          </div>

          {/* Sidebar Toggle Icon (Mobile) */}
          <div className="nav-toggle" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/artisan">Artisans</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li className="signin">
              <Link to="/signin">Sign In</Link>
            </li>
            <li className="get-started">
              <Link to="/consumerpages">Get Started</Link>
            </li>
          </ul>
        </nav>

        {/* Sidebar Menu (Mobile) */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <FaTimes className="close-icon" onClick={() => setSidebarOpen(false)} />
          </div>
          <ul className="sidebar-list">
            <li>
              <Link to="/" onClick={() => setSidebarOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/artisan" onClick={() => setSidebarOpen(false)}>
                Artisans
              </Link>
            </li>
            <li>
              <Link to="/consumer" onClick={() => setSidebarOpen(false)}>
                Consumer
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setSidebarOpen(false)}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="signin" to="/signin" onClick={() => setSidebarOpen(false)}>
                Sign In
              </Link>
            </li>
            <li className="get-started">
              <Link to="/consumerNextpage" onClick={() => setSidebarOpen(false)}>
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        {/* Overlay when sidebar is open */}
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      </div>

      <Routes>
        {/* Routes now don't need props */}
        <Route path="/" element={<Home />} />
        <Route path="/Artisan" element={< Artisan/>} />
        <Route path="/consumer" element={<Consumer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={< Signin/>} />
        <Route path="/getstarted" element={<Getstarted />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
        <Route path='/chatbox' element={<ChatBox tradesperson={tradesperson} />} />
         <Route path="/consumerbtn" element={< ConsumerBTN />} />
         <Route path="/nextstep" element={< Nextstep />} /> 
         <Route path="/laststep" element={< Laststep  />} />
         <Route path="/consumerpages" element={< Consumerpages  />} />
         <Route path="/hirepage" element={< Hire  />} /> 
         <Route path="/hiringartisanPage/:id" element={< HiringartisanPage   />} /> 
         <Route path="/consumerNextpage" element={ <ConsumerNextPage/>} />
        <Route path="/consumerVericationPage" element={<ConsumerVerificationPage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/PaymentCallback" element={<PaymentCallback />} />

        <Route path="*" element={<NotFound />} />
      
      </Routes>
    </div>
  );
}

export default Header;