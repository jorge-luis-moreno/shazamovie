const api = {
    baseUrl: '/api',

    // Generic fetch helper
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                ...options
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Failed', error);
            ui.showToast('Error communicating with server', 'error');
            throw error;
        }
    },

    async getMovies(genre = null) {
        return this.request(genre ? `/movies/?genre=${encodeURIComponent(genre)}` : '/movies/');
    },

    async getMovie(id) {
        return this.request(`/movies/${id}/`);
    },

    async getGenres() {
        return this.request('/genres/');
    },

    async getStats() {
        return this.request('/stats/');
    },

    async getRandomMovie() {
        return this.request('/random/');
    },

    async getRecommendations(genres) {
        return this.request('/recommend/', {
            method: 'POST',
            body: JSON.stringify({ genres })
        });
    }
};
window.api = api;
