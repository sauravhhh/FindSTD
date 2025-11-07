class STDCodeFinder {
    constructor() {
        this.searchForm = document.getElementById('searchForm');
        this.searchBtn = document.getElementById('searchBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.resultsContent = document.getElementById('resultsContent');
        this.searchQuery = document.getElementById('searchQuery');
        
        this.citiesData = [];
        this.init();
    }

    async init() {
        await this.loadCitiesData();
        this.initEventListeners();
    }

    async loadCitiesData() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Vynex/indian-cities-geodata/main/src/cities.json');
            this.citiesData = await response.json();
        } catch (error) {
            console.error('Error loading cities data:', error);
            this.citiesData = this.getFallbackData();
        }
    }

    getFallbackData() {
        return [
            {
                "id": 1,
                "city": "Mumbai",
                "district": "Mumbai",
                "std-code": 22,
                "state": "Maharashtra",
                "population": 12442373
            },
            {
                "id": 2,
                "city": "Delhi",
                "district": "Delhi",
                "std-code": 11,
                "state": "Delhi",
                "population": 11034555
            },
            {
                "id": 3,
                "city": "Bangalore",
                "district": "Bangalore",
                "std-code": 80,
                "state": "Karnataka",
                "population": 8443675
            },
            {
                "id": 4,
                "city": "Chennai",
                "district": "Chennai",
                "std-code": 44,
                "state": "Tamil Nadu",
                "population": 4681087
            },
            {
                "id": 5,
                "city": "Kolkata",
                "district": "Kolkata",
                "std-code": 33,
                "state": "West Bengal",
                "population": 4496694
            },
            {
                "id": 6,
                "city": "Hyderabad",
                "district": "Hyderabad",
                "std-code": 40,
                "state": "Telangana",
                "population": 6809970
            },
            {
                "id": 7,
                "city": "Pune",
                "district": "Pune",
                "std-code": 20,
                "state": "Maharashtra",
                "population": 3124458
            },
            {
                "id": 8,
                "city": "Ahmedabad",
                "district": "Ahmedabad",
                "std-code": 79,
                "state": "Gujarat",
                "population": 5577940
            }
        ];
    }

    initEventListeners() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetForm();
        });
    }

    performSearch() {
        const query = this.searchQuery.value.trim();

        if (!query) {
            this.showError('Please enter a city name');
            return;
        }

        this.setLoading(true);
        this.showResults();

        setTimeout(() => {
            const results = this.searchData(query);
            this.displayResults(results);
            this.setLoading(false);
        }, 800);
    }

    resetForm() {
        this.searchQuery.value = '';
        this.hideResults();
        this.searchQuery.focus();
    }

    showResults() {
        this.resultsContainer.classList.add('show');
    }

    hideResults() {
        this.resultsContainer.classList.remove('show');
    }

    searchData(query) {
        return this.citiesData.filter(city => 
            city.city.toLowerCase().includes(query.toLowerCase()) ||
            city.district.toLowerCase().includes(query.toLowerCase())
        );
    }

    formatSTDCode(stdCode) {
        // Add "0" prefix to the STD code
        return "0" + stdCode.toString();
    }

    displayResults(results) {
        if (results.length === 0) {
            this.resultsContent.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div>No results found</div>
                    <div style="font-size: 1rem; margin-top: 12px; opacity: 0.7;">Try a different city name</div>
                </div>
            `;
            return;
        }

        let html = '';

        results.forEach(city => {
            const formattedCode = this.formatSTDCode(city['std-code']);
            html += `
                <div class="result-item">
                    <div class="result-city">
                        <i class="fas fa-map-marker-alt"></i>
                        ${city.city}, ${city.state}
                    </div>
                    <div class="result-std">
                        ${formattedCode}
                    </div>
                </div>
            `;
        });

        this.resultsContent.innerHTML = html;
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.searchBtn.disabled = true;
            this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            this.resultsContent.innerHTML = '<div class="loading">Searching database</div>';
        } else {
            this.searchBtn.disabled = false;
            this.searchBtn.innerHTML = '<i class="fas fa-search"></i> Find STD Code';
        }
    }

    showError(message) {
        this.resultsContent.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                ${message}
            </div>
        `;
        this.showResults();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new STDCodeFinder();
});
