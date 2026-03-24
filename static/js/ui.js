const ui = {
    loadView(viewName) {
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none';
        });
        
        const target = document.getElementById(`view-${viewName}`);
        if(target) {
            target.classList.add('active');
            target.style.display = 'block';
            
            // Re-trigger auth-fade animation
            target.classList.remove('animate-fade');
            void target.offsetWidth;
            target.classList.add('animate-fade');
            
            if(viewName === 'home') app.initHome();
            if(viewName === 'categories') app.loadCategories();
            if(viewName === 'recommend') app.loadRecommendSetup();
        }
    },

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const msg = document.getElementById('toast-message');
        msg.textContent = message;
        
        if(type === 'error') {
            toast.classList.replace('bg-gray-800', 'bg-red-600');
        } else {
            toast.classList.replace('bg-red-600', 'bg-gray-800');
        }

        toast.classList.replace('translate-y-20', 'translate-y-0');
        toast.classList.replace('opacity-0', 'opacity-100');
        
        setTimeout(() => {
            toast.classList.replace('translate-y-0', 'translate-y-20');
            toast.classList.replace('opacity-100', 'opacity-0');
        }, 3000);
    },

    createMovieCard(movie) {
        const posterUrl = movie.poster || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18768e77a29%20text%20%7B%20fill%3A%236c757d%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18768e77a29%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%23343a40%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2267.5%22%20y%3D%22156.4%22%3EPoster%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
        return `
            <div class="glass rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300 shadow-lg relative group h-full flex flex-col" onclick="app.showMovieModal('${movie.id}')">
                <div class="relative pt-[150%]">
                    <img src="${posterUrl}" alt="${movie.title}" class="absolute top-0 left-0 w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <p class="text-sm font-medium line-clamp-4 text-center">${movie.plot_summary || 'No summary available.'}</p>
                    </div>
                </div>
                <div class="p-4 flex-grow flex flex-col justify-between bg-black/40">
                    <div>
                        <h4 class="font-bold text-lg mb-1 leading-tight">${movie.title}</h4>
                        <div class="text-xs text-gray-400 mb-2">${movie.year} ${movie.imdb_rating ? '⭐' + movie.imdb_rating : ''}</div>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-2">
                        ${movie.genres.map(g => `<span class="px-2 py-0.5 text-[10px] bg-white/10 rounded-full">${g}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    openModal(html) {
        const modal = document.getElementById('movieModal');
        const content = document.getElementById('modal-content');
        const wrapper = document.getElementById('modal-content-wrapper');
        
        content.innerHTML = html;
        modal.style.display = 'flex';
        // force layout reflow
        void modal.offsetWidth;
        modal.classList.replace('opacity-0', 'opacity-100');
        wrapper.classList.replace('scale-95', 'scale-100');
        wrapper.classList.replace('opacity-0', 'opacity-100');
    },

    closeModal() {
        const modal = document.getElementById('movieModal');
        const wrapper = document.getElementById('modal-content-wrapper');
        
        wrapper.classList.replace('scale-100', 'scale-95');
        wrapper.classList.replace('opacity-100', 'opacity-0');
        modal.classList.replace('opacity-100', 'opacity-0');
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
};

window.ui = ui;
