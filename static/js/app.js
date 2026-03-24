const state = {
    genres: [],
    selectedGenres: new Set(),
    stats: {},
    moviesCache: {}
};

const app = {
    async init() {
        // Initial setup
        await Promise.all([
            this.fetchStats(),
            this.fetchGenres()
        ]);
        
        ui.loadView('home');
        
        // Handle Back/Forward browser navigation if History API was used (optional for SPA)
        // Set up global modal close click
        document.getElementById('movieModal').addEventListener('click', (e) => {
            if(e.target === document.getElementById('movieModal')) {
                ui.closeModal();
            }
        });
    },
    
    async fetchStats() {
        try {
            state.stats = await api.getStats();
            document.getElementById('stat-movies').textContent = state.stats.total_movies || 0;
            document.getElementById('stat-genres').textContent = state.stats.total_genres || 0;
        } catch (e) {}
    },
    
    async fetchGenres() {
        try {
            state.genres = await api.getGenres();
        } catch(e) {}
    },

    async initHome() {
        this.loadRandomMovie();
        this.loadLatestMovies();
    },

    async loadRandomMovie() {
        const container = document.getElementById('random-movie-container');
        container.innerHTML = '<div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>';
        
        try {
            const movie = await api.getRandomMovie();
            if (movie && !movie.error) {
                container.innerHTML = `
                    <div class="flex flex-col md:flex-row gap-6 w-full cursor-pointer hover:bg-white/5 p-4 rounded-xl transition" onclick="app.showMovieModal('${movie.id}')">
                        <img src="${movie.poster || ''}" alt="poster" class="w-32 rounded-lg shadow-lg object-cover">
                        <div class="flex flex-col justify-center">
                            <h3 class="text-3xl font-bold mb-2">${movie.title}</h3>
                            <p class="text-blue-400 font-semibold mb-2">${movie.year} | ⭐ ${movie.imdb_rating || 'N/A'}</p>
                            <div class="flex gap-2 flex-wrap mb-4">
                                ${movie.genres.map(g => `<span class="bg-gray-700 px-3 py-1 rounded-full text-sm">${g}</span>`).join('')}
                            </div>
                            <p class="text-gray-300 line-clamp-3 text-sm">${movie.plot_summary || 'No summary available.'}</p>
                        </div>
                    </div>
                `;
            }
        } catch(e) {
            container.innerHTML = '<p class="text-red-400">Failed to load movie.</p>';
        }
    },

    async loadLatestMovies() {
        const grid = document.getElementById('latest-movies-grid');
        grid.innerHTML = '<div class="col-span-full text-center py-4">Loading...</div>';
        try {
            const data = await api.getMovies();
            // take first 5 from latest (already sorted by year desc in backend)
            const latest = data.movies.slice(0, 5);
            grid.innerHTML = latest.map(m => ui.createMovieCard(m)).join('');
        } catch (e) {
            grid.innerHTML = '<div class="col-span-full text-red-400">Error loading latest movies</div>';
        }
    },

    async loadRecommendSetup() {
        const picker = document.getElementById('genre-picker');
        if(!state.genres.length) await this.fetchGenres();
        
        picker.innerHTML = state.genres.map(g => `
            <label class="cursor-pointer select-none">
                <input type="checkbox" value="${g}" class="hidden peer" ${state.selectedGenres.has(g) ? 'checked' : ''} onchange="app.toggleGenre('${g}', this.checked)">
                <div class="px-5 py-2 glass rounded-full peer-checked:bg-purple-600 peer-checked:border-purple-500 peer-checked:text-white transition-all peer-hover:border-purple-400">
                    ${g}
                </div>
            </label>
        `).join('');
    },

    toggleGenre(genre, isChecked) {
        if(isChecked) {
            state.selectedGenres.add(genre);
        } else {
            state.selectedGenres.delete(genre);
        }
    },

    async getRecommendations() {
        if(state.selectedGenres.size === 0) {
            ui.showToast('Please select at least one genre.', 'error');
            return;
        }

        const btn = event.currentTarget;
        const oText = btn.textContent;
        btn.textContent = 'Searching...';
        btn.disabled = true;

        try {
            const data = await api.getRecommendations(Array.from(state.selectedGenres));
            const resultsSection = document.getElementById('recommend-results');
            resultsSection.classList.remove('hidden');
            
            document.getElementById('results-count').textContent = `(${data.total_found} found)`;
            
            const featuredContainer = document.getElementById('featured-recommendation');
            if(data.featured_recommendation) {
                const f = data.featured_recommendation;
                featuredContainer.innerHTML = `
                    <div class="flex flex-col md:flex-row shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform" onclick="app.showMovieModal('${f.id}')">
                        <div class="md:w-1/3">
                            <img src="${f.poster || ''}" class="w-full h-full object-cover">
                        </div>
                        <div class="md:w-2/3 p-8 text-left flex flex-col justify-center bg-gray-800">
                            <div class="text-purple-400 font-bold tracking-widest text-sm uppercase mb-2">⭐ Top Pick</div>
                            <h3 class="text-4xl font-extrabold mb-3">${f.title} <span class="text-gray-500 font-light">(${f.year})</span></h3>
                            <div class="flex gap-2 mb-6">
                                ${f.genres.map(g => `<span class="bg-gray-700 px-3 py-1 rounded-full text-sm">${g}</span>`).join('')}
                            </div>
                            <p class="text-gray-300 text-lg leading-relaxed mb-6">${f.plot_summary || 'No summary available.'}</p>
                            <div class="mt-auto">
                                <span class="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg font-bold">
                                    IMDb: ${f.imdb_rating || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                featuredContainer.style.display = 'block';
            } else {
                featuredContainer.style.display = 'none';
            }

            const grid = document.getElementById('recommend-grid');
            if(data.results.length) {
                // Filter out featured
                const others = data.results.filter(m => m.id !== (data.featured_recommendation?.id));
                grid.innerHTML = others.map(m => ui.createMovieCard(m)).join('');
            } else {
                grid.innerHTML = '<div class="col-span-full text-gray-400 text-center py-8">No other matches found.</div>';
            }
            
            // smooth scroll down
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (e) {
            console.error(e);
        } finally {
            btn.textContent = oText;
            btn.disabled = false;
        }
    },

    async loadCategories() {
        const container = document.getElementById('categories-container');
        if(!state.genres.length) await this.fetchGenres();
        
        container.innerHTML = '<div class="text-center">Loading categories...</div>';
        
        try {
            const promises = state.genres.map(async g => {
                const data = await api.getMovies(g);
                return { genre: g, movies: data.movies };
            });
            
            const results = await Promise.all(promises);
            
            container.innerHTML = results.map(r => {
                if(!r.movies.length) return '';
                const displayMovies = r.movies.slice(0, 5);
                return `
                    <div class="glass p-6 rounded-2xl">
                        <div class="flex justify-between items-end mb-6 border-b border-gray-700 pb-2">
                            <h3 class="text-2xl font-bold text-blue-400">${r.genre} <span class="text-sm font-normal text-gray-400">(${r.movies.length})</span></h3>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            ${displayMovies.map(m => ui.createMovieCard(m)).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        } catch (e) {
            container.innerHTML = '<div class="text-red-400 text-center">Failed to load categories.</div>';
        }
    },

    async showMovieModal(id) {
        try {
            const movie = await api.getMovie(id);
            const html = `
                <div class="flex flex-col md:flex-row max-h-[90vh]">
                    <div class="md:w-2/5 shrink-0 bg-gray-900">
                        <img src="${movie.poster || ''}" alt="${movie.title}" class="w-full h-full object-cover">
                    </div>
                    <div class="md:w-3/5 p-8 overflow-y-auto bg-gray-800 flex flex-col">
                        <h2 class="text-4xl font-extrabold mb-2">${movie.title}</h2>
                        <div class="flex items-center gap-4 text-gray-400 mb-6 font-semibold">
                            <span>${movie.year}</span>
                            <span>⭐ ${movie.imdb_rating || 'N/A'}</span>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mb-6 cursor-pointer">
                            ${movie.genres.map(g => `<span class="bg-purple-600/30 text-purple-300 border border-purple-500/50 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-600/50 transition-colors" onclick="ui.closeModal(); state.selectedGenres.clear(); state.selectedGenres.add('${g}'); ui.loadView('recommend'); app.getRecommendations();">${g}</span>`).join('')}
                        </div>
                        
                        <div class="mb-8 flex-grow">
                            <h3 class="text-xl font-bold mb-3 border-b border-gray-700 pb-2">Synopsis</h3>
                            <p class="text-gray-300 leading-relaxed text-lg">${movie.plot_summary || 'No overview provided for this title.'}</p>
                        </div>
                        
                        <button onclick="ui.closeModal()" class="w-full bg-gray-700 hover:bg-gray-600 font-bold py-3 rounded-xl transition-colors mt-auto">Close</button>
                    </div>
                </div>
            `;
            ui.openModal(html);
        } catch (e) {
            ui.showToast('Could not load movie details.', 'error');
        }
    }
};

window.app = app;

// Init single page application
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
