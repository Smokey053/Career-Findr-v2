/**
 * @file Algolia Search Service
 * Provides full-text search capabilities for jobs and courses using Algolia
 * 
 * To set up Algolia:
 * 1. Create an account at https://www.algolia.com/
 * 2. Create an application and get your Application ID and API Key
 * 3. Add credentials to your .env file:
 *    VITE_ALGOLIA_APP_ID=your_app_id
 *    VITE_ALGOLIA_SEARCH_KEY=your_search_only_api_key
 */

import { liteClient as algoliasearch } from 'algoliasearch/lite';

// Initialize Algolia client with environment variables
const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

// Only initialize if credentials are available
const searchClient = ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY 
  ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)
  : null;

// Index names
const INDICES = {
  JOBS: 'jobs',
  COURSES: 'courses',
};

/**
 * Check if Algolia is configured and available
 * @returns {boolean} True if Algolia is configured
 */
export const isAlgoliaConfigured = () => {
  return searchClient !== null;
};

/**
 * Search jobs with full-text search
 * @param {string} query - Search query string
 * @param {Object} filters - Additional filters to apply
 * @param {number} [page=0] - Page number for pagination
 * @param {number} [hitsPerPage=20] - Number of results per page
 * @returns {Promise<Object>} Search results with hits and metadata
 */
export const searchJobs = async (query = '', filters = {}, page = 0, hitsPerPage = 20) => {
  if (!searchClient) {
    console.warn('Algolia not configured. Falling back to Firebase search.');
    return { hits: [], nbHits: 0, nbPages: 0, page: 0, fallback: true };
  }

  try {
    const index = searchClient.initIndex(INDICES.JOBS);
    
    // Build filter string from filters object
    const filterParts = [];
    if (filters.type) filterParts.push(`type:"${filters.type}"`);
    if (filters.location) filterParts.push(`location:"${filters.location}"`);
    if (filters.experienceLevel) filterParts.push(`experienceLevel:"${filters.experienceLevel}"`);
    if (filters.status) filterParts.push(`status:"${filters.status}"`);
    
    const filterString = filterParts.length > 0 ? filterParts.join(' AND ') : '';

    const results = await index.search(query, {
      page,
      hitsPerPage,
      filters: filterString || 'status:active',
      attributesToRetrieve: [
        'objectID', 'title', 'companyName', 'companyId', 'type', 'location',
        'salaryMin', 'salaryMax', 'currency', 'experienceLevel', 'description',
        'requirements', 'skills', 'benefits', 'status', 'applicationDeadline',
        'createdAt'
      ],
      attributesToHighlight: ['title', 'description', 'companyName'],
    });

    // Map Algolia hits to expected format
    const hits = results.hits.map(hit => ({
      id: hit.objectID,
      ...hit,
    }));

    return {
      hits,
      nbHits: results.nbHits,
      nbPages: results.nbPages,
      page: results.page,
      processingTimeMS: results.processingTimeMS,
    };
  } catch (error) {
    console.error('Algolia search error:', error);
    return { hits: [], nbHits: 0, nbPages: 0, page: 0, error: error.message };
  }
};

/**
 * Search courses with full-text search
 * @param {string} query - Search query string
 * @param {Object} filters - Additional filters to apply
 * @param {number} [page=0] - Page number for pagination
 * @param {number} [hitsPerPage=20] - Number of results per page
 * @returns {Promise<Object>} Search results with hits and metadata
 */
export const searchCourses = async (query = '', filters = {}, page = 0, hitsPerPage = 20) => {
  if (!searchClient) {
    console.warn('Algolia not configured. Falling back to Firebase search.');
    return { hits: [], nbHits: 0, nbPages: 0, page: 0, fallback: true };
  }

  try {
    const index = searchClient.initIndex(INDICES.COURSES);
    
    // Build filter string from filters object
    const filterParts = [];
    if (filters.field) filterParts.push(`field:"${filters.field}"`);
    if (filters.level) filterParts.push(`level:"${filters.level}"`);
    if (filters.location) filterParts.push(`location:"${filters.location}"`);
    if (filters.status) filterParts.push(`status:"${filters.status}"`);
    
    const filterString = filterParts.length > 0 ? filterParts.join(' AND ') : '';

    const results = await index.search(query, {
      page,
      hitsPerPage,
      filters: filterString || 'status:active',
      attributesToRetrieve: [
        'objectID', 'name', 'code', 'institutionId', 'institutionName', 
        'field', 'level', 'duration', 'description', 'location',
        'fees', 'currency', 'startDate', 'applicationDeadline',
        'capacity', 'enrolled', 'status', 'createdAt'
      ],
      attributesToHighlight: ['name', 'description', 'institutionName', 'field'],
    });

    // Map Algolia hits to expected format
    const hits = results.hits.map(hit => ({
      id: hit.objectID,
      ...hit,
    }));

    return {
      hits,
      nbHits: results.nbHits,
      nbPages: results.nbPages,
      page: results.page,
      processingTimeMS: results.processingTimeMS,
    };
  } catch (error) {
    console.error('Algolia search error:', error);
    return { hits: [], nbHits: 0, nbPages: 0, page: 0, error: error.message };
  }
};

/**
 * Get search suggestions/autocomplete for jobs
 * @param {string} query - Partial search query
 * @returns {Promise<Array>} Array of suggestions
 */
export const getJobSuggestions = async (query) => {
  if (!searchClient || !query || query.length < 2) {
    return [];
  }

  try {
    const index = searchClient.initIndex(INDICES.JOBS);
    const results = await index.search(query, {
      hitsPerPage: 5,
      attributesToRetrieve: ['title', 'companyName'],
      filters: 'status:active',
    });

    return results.hits.map(hit => ({
      title: hit.title,
      companyName: hit.companyName,
      display: `${hit.title} at ${hit.companyName}`,
    }));
  } catch (error) {
    console.error('Error getting job suggestions:', error);
    return [];
  }
};

/**
 * Get search suggestions/autocomplete for courses
 * @param {string} query - Partial search query
 * @returns {Promise<Array>} Array of suggestions
 */
export const getCourseSuggestions = async (query) => {
  if (!searchClient || !query || query.length < 2) {
    return [];
  }

  try {
    const index = searchClient.initIndex(INDICES.COURSES);
    const results = await index.search(query, {
      hitsPerPage: 5,
      attributesToRetrieve: ['name', 'institutionName', 'field'],
      filters: 'status:active',
    });

    return results.hits.map(hit => ({
      name: hit.name,
      institutionName: hit.institutionName,
      field: hit.field,
      display: `${hit.name} - ${hit.institutionName}`,
    }));
  } catch (error) {
    console.error('Error getting course suggestions:', error);
    return [];
  }
};

export default {
  isAlgoliaConfigured,
  searchJobs,
  searchCourses,
  getJobSuggestions,
  getCourseSuggestions,
  INDICES,
};
