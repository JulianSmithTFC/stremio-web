// movieService.js

// URL endpoints (update these URLs to match your API endpoints)
const BASE_URL = process.env.Personal_Middleware_URL;
const MOVIE_DATA_ENDPOINT = `${BASE_URL}/endpoint/movie/getMovieDetailsByIMDBCode.php`;
const TORRENT_DOWNLOAD_ENDPOINT = `${BASE_URL}/endpoint/torrent/movie/addTorrent.php`;

// Utility function to convert an object to form data
const createFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });
    return formData;
};

// Fetch movie data by IMDB ID
export const getMovieDataByIMDBID = async (imdbId) => {
    try {
        const formData = new FormData();
        formData.append("imdb_id", imdbId); // Map imdbId parameter to "imdb_id"
        formData.append("api-key", process.env.Personal_Middleware_API_Key); // Add the API key

        const response = await fetch(MOVIE_DATA_ENDPOINT, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json(); // Assuming the API returns JSON data



    } catch (error) {
        console.error("Failed to fetch movie data:", error);
        throw error;
    }
};

// Start torrent download
export const startTorrentDownload = async (magnetURL, movieName) => {
    try {

        const formData = new FormData();
        formData.append("url", magnetURL); // Map imdbId parameter to "imdb_id"
        formData.append("torrent_name", movieName); // Map imdbId parameter to "imdb_id"
        formData.append("api-key", process.env.Personal_Middleware_API_Key); // Add the API key

        const response = await fetch(TORRENT_DOWNLOAD_ENDPOINT, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json(); // Assuming the API returns JSON data

    } catch (error) {
        console.error("Failed to start torrent download:", error);
        throw error;
    }
};
