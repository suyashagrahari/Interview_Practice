// Strapi API configuration and service
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

class StrapiApiService {
  private baseUrl: string;

  constructor(baseUrl: string = STRAPI_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData: StrapiError = await response.json();
        throw new Error(
          `Strapi API Error: ${errorData.error?.message || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while fetching data');
    }
  }

  // Categories API
  async getCategories(): Promise<StrapiResponse<Category[]>> {
    return this.request<StrapiResponse<Category[]>>('/categories');
  }

  async getCategoryById(id: number): Promise<StrapiResponse<Category>> {
    return this.request<StrapiResponse<Category>>(`/categories/${id}`);
  }

  // Questions API
  async getQuestions(params?: {
    technology?: string;
    level?: string;
    category?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    populate?: string;
  }): Promise<StrapiResponse<Question[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.technology) {
      searchParams.append('filters[technology][slug][$eq]', params.technology);
    }
    if (params?.level) {
      searchParams.append('filters[level][$eq]', params.level);
    }
    if (params?.category) {
      searchParams.append('filters[technology][category][slug][$eq]', params.category);
    }
    if (params?.page) {
      searchParams.append('pagination[page]', params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pagination[pageSize]', params.pageSize.toString());
    }
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    } else {
      // Default populate to get all related data
      searchParams.append('populate[technology][populate]', 'category');
      searchParams.append('populate', 'author');
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/questions?${queryString}` : '/questions';
    
    return this.request<StrapiResponse<Question[]>>(endpoint);
  }

  async getQuestionById(id: number): Promise<StrapiResponse<Question>> {
    return this.request<StrapiResponse<Question>>(`/questions/${id}?populate[technology][populate]=category&populate=author`);
  }

  async getQuestionsByTechnology(technology: string, params?: {
    level?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<StrapiResponse<Question[]>> {
    return this.getQuestions({
      technology,
      ...params,
      sort: params?.sort || 'order:asc',
    });
  }

  async getQuestionsByLevel(level: string, params?: {
    technology?: string;
    category?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<StrapiResponse<Question[]>> {
    return this.getQuestions({
      level,
      ...params,
      sort: params?.sort || 'order:asc',
    });
  }

  // Technologies API
  async getTechnologies(params?: {
    page?: number;
    pageSize?: number;
    populate?: string;
  }): Promise<StrapiResponse<Technology[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) {
      searchParams.append('pagination[page]', params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pagination[pageSize]', params.pageSize.toString());
    }
    if (params?.populate) {
      searchParams.append('populate', params.populate);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/technologies?${queryString}` : '/technologies';
    
    return this.request<StrapiResponse<Technology[]>>(endpoint);
  }

  async getTechnologyById(id: number): Promise<StrapiResponse<Technology>> {
    return this.request<StrapiResponse<Technology>>(`/technologies/${id}`);
  }

  async getTechnologiesByCategory(categorySlug: string, params?: {
    page?: number;
    pageSize?: number;
  }): Promise<StrapiResponse<Category[]>> {
    const searchParams = new URLSearchParams();
    searchParams.append('filters[slug][$eq]', categorySlug);
    searchParams.append('populate', 'technologies');
    
    if (params?.page) {
      searchParams.append('pagination[page]', params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pagination[pageSize]', params.pageSize.toString());
    }

    const endpoint = `/categories?${searchParams.toString()}`;
    return this.request<StrapiResponse<Category[]>>(endpoint);
  }

  // Authors API
  async getAuthors(): Promise<StrapiResponse<Author[]>> {
    return this.request<StrapiResponse<Author[]>>('/authors');
  }

  async getAuthorById(id: number): Promise<StrapiResponse<Author>> {
    return this.request<StrapiResponse<Author>>(`/authors/${id}`);
  }
}

// Export a singleton instance
export const strapiApi = new StrapiApiService();

// Export types for use in components
export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  technologies?: Technology[];
}

export interface Question {
  id: number;
  documentId: string;
  order: string;
  title: string;
  slug: string;
  question: string;
  answer: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isFeatured: boolean;
  viewCount: string;
  lastUpdated: string | null;
  metaTitle: string;
  metaDescription: string;
  keyPoints?: string[];
  example?: string;
  explanation?: string;
  technology: Technology;
  author: Author;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface Technology {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  difficultyLevel: string;
  popularity: string;
  metaTitle: string;
  metaDescription: string;
  icon?: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}
