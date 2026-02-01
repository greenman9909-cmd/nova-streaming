import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingChatbot from './components/FloatingChatbot';
import EmailPopup from './components/EmailPopup';

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const Anime = lazy(() => import('./pages/Anime'));
const Peliculas = lazy(() => import('./pages/Peliculas'));
const Series = lazy(() => import('./pages/Series'));
const Deportes = lazy(() => import('./pages/Deportes'));
const Watch = lazy(() => import('./pages/Watch'));
const MovieWatch = lazy(() => import('./pages/MovieWatch'));
const Login = lazy(() => import('./pages/Login'));
const Plans = lazy(() => import('./pages/Plans'));
const Search = lazy(() => import('./pages/Search'));
const AnimeDetail = lazy(() => import('./pages/AnimeDetail'));
const AnimeWatch = lazy(() => import('./pages/AnimeWatch'));
const SportsWatch = lazy(() => import('./pages/SportsWatch'));

// Loading Fallback
const PageLoader = () => (
    <div className="min-h-screen bg-nova-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-nova-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                <EmailPopup />
                <Navbar />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/anime" element={<Anime />} />
                        <Route path="/anime/:id" element={<AnimeDetail />} />
                        <Route path="/anime/watch/:id" element={<AnimeWatch />} />
                        <Route path="/peliculas" element={<Peliculas />} />
                        <Route path="/series" element={<Series />} />
                        <Route path="/deportes" element={<Deportes />} />
                        <Route path="/deportes/watch/:source/:streamId" element={<SportsWatch />} />
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/watch/:episodeId" element={<Watch />} />
                        <Route path="/watch/:type/:id" element={<MovieWatch />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Suspense>
                <FloatingChatbot />
            </div>
        </Router>
    );
}

export default App;
