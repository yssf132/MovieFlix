import Search from "./components/Search.jsx";
import {useState, useEffect} from "react";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from 'react-use';
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_BASE_URL='https://api.themoviedb.org/3';

const API_KEY=import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS={
    method:"GET",
    headers:{
        accept:"application/json",
        Authorization:`Bearer ${API_KEY}`,
    }
}

const App = () => {
    const [debouncedSearchTerm, setDebouncedSearchTerm]=useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [movieList, setMovieList]=useState([]);
    const [errorMessage1, setErrorMessage1] = useState('');
    const [isLoading1, setIsLoading1]=useState(false);

    const [trendingMovies, setTrendingMovies]=useState([]);
    const [errorMessage2, setErrorMessage2] = useState('');
    const [isLoading2, setIsLoading2]=useState(false);

    //Debounce the search term to prevent making too many API requests
    //by waiting for the user to stop typing for 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query='') => {
        setIsLoading1(true);
        setErrorMessage1('')
        try {
            const endpoint= query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok){
                throw new Error('Failed to fetch movies');
            }

            const data=await response.json();

            if (data.Response==='False'){
                setErrorMessage1(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            // Only track search if Appwrite is configured (for local development)
            if (query && data.results.length > 0 && import.meta.env.VITE_APPWRITE_PROJECT_ID) {
                try {
                    await updateSearchCount(query, data.results[0]);
                } catch (error) {
                    console.log('Search tracking unavailable:', error.message);
                }
            }
        }
        catch (e) {
            console.error(`Error in fetchMovies: ${e}`);
            setErrorMessage1('error in fetchMovies. please try again later.');
        } finally {
            setIsLoading1(false);
        }
    }

    const loadTrendingMovies = async () => {
        setIsLoading2(true);
        setErrorMessage2('');
        try {
            // Only load trending from Appwrite if configured
            if (import.meta.env.VITE_APPWRITE_PROJECT_ID) {
                const movies = await getTrendingMovies();
                if (movies) {
                    setTrendingMovies(movies);
                } else {
                    setErrorMessage2('Failed to fetch trending movies');
                }
            } else {
                // For deployed version without Appwrite, just show empty trending
                setTrendingMovies([]);
            }
        } catch (e) {
            console.error(`Error in loadTrendingMovies: ${e}`);
            setErrorMessage2('error in loadTrendingMovies. please try again later.');
        } finally {
            setIsLoading2(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main>
            <div className="pattern"/>

            <div className="wrapper">
                <header>
                    <img src="/hero.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        {isLoading2 ? (
                            <Spinner/>
                        ) : errorMessage2 ? (
                            <p className="text-red-500">{errorMessage2}</p>
                        ) : (
                            <ul>
                                {trendingMovies.map((movie, index) => (
                                    <li key={movie.$id}>
                                        <p>{index+1}</p>
                                        <img src={movie.poster_url} alt={movie.title}/>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>

                    {isLoading1 ? (
                        <Spinner/>
                    ) : errorMessage1 ? (
                        <p className="text-red-500">{errorMessage1}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;