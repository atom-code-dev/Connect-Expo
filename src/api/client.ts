import Constants from 'expo-constants';

// Get the base URL from environment or use localhost for development
const getBaseURL = () => {
  if (__DEV__) {
    // For development, use the Next.js server URL
    return 'http://localhost:3000';
  }
  // For production, this should be your deployed Next.js URL
  return Constants.expoConfig?.extra?.baseURL || 'http://localhost:3000';
};

const BASE_URL = getBaseURL();

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signIn(email: string, password: string) {
    return this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signOut() {
    return this.request('/api/auth/signout', {
      method: 'POST',
    });
  }

  async getSession() {
    return this.request('/api/auth/session');
  }

  // Training endpoints
  async getTrainings() {
    return this.request('/api/trainings');
  }

  async getTraining(id: string) {
    return this.request(`/api/trainings/${id}`);
  }

  // User profile endpoints
  async getProfile() {
    return this.request('/api/users/profile');
  }

  async updateProfile(data: any) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Freelancer endpoints
  async getFreelancerProfile() {
    return this.request('/api/freelancers/profile');
  }

  async updateFreelancerProfile(data: any) {
    return this.request('/api/freelancers/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Organization endpoints
  async getOrganizationProfile() {
    return this.request('/api/organizations/profile');
  }

  async updateOrganizationProfile(data: any) {
    return this.request('/api/organizations/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;