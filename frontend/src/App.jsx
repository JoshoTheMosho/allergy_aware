import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import SearchPage2 from './pages/SearchPage2';
import EditPage from './pages/EditPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ComingSoon from './components/common/ComingSoon';
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/search" element={<SearchPage />} /> */}
                <Route path="/search" element={<SearchPage2 />} />
                <Route path="/edit" element={<EditPage />} />
                <Route path="/profile" element={<ComingSoon />} />
                <Route path="/edit" element={<ComingSoon />} />
                <Route path="/help" element={<ComingSoon />} />
                <Route path="/privacy" element={<ComingSoon />} />
                <Route path="/terms" element={<ComingSoon />} />
            </Routes>
            {/* <Footer /> */}
        </Router>
    );

}

export default App
