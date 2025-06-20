// Utilitaire pour les appels API côté client
const API_BASE_URL = '/api';

class ApiClient {
    constructor() {
        this.token = null;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Méthodes d'authentification
    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: userData,
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: credentials,
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    logout() {
        this.setToken(null);
    }

    async checkAuth() {
        try {
            return await this.request('/auth/protected');
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    // Méthodes pour les articles
    async getArticles(published = false) {
        const query = published ? '?published=true' : '';
        return await this.request(`/articles${query}`);
    }

    async getArticle(id) {
        return await this.request(`/articles/${id}`);
    }

    async createArticle(articleData) {
        return await this.request('/articles', {
            method: 'POST',
            body: articleData,
        });
    }

    async updateArticle(id, articleData) {
        return await this.request(`/articles/${id}`, {
            method: 'PUT',
            body: articleData,
        });
    }

    async deleteArticle(id) {
        return await this.request(`/articles/${id}`, {
            method: 'DELETE',
        });
    }

    // Méthodes pour les films
    async getFilms() {
        return await this.request('/films');
    }

    async getFilm(id) {
        return await this.request(`/films/${id}`);
    }

    async createFilm(filmData) {
        return await this.request('/films', {
            method: 'POST',
            body: filmData,
        });
    }

    async updateFilm(id, filmData) {
        return await this.request(`/films/${id}`, {
            method: 'PUT',
            body: filmData,
        });
    }

    async deleteFilm(id) {
        return await this.request(`/films/${id}`, {
            method: 'DELETE',
        });
    }
}

export const apiClient = new ApiClient();
export default apiClient;
