import { db } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Job Model for Firestore operations
 */
class Job {
  constructor() {
    this.collection = db.collection('jobs');
  }

  /**
   * Create a new job posting
   */
  async create(jobData, employerId) {
    try {
      const jobId = uuidv4();
      
      const jobDoc = {
        id: jobId,
        employerId,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type, // full-time, part-time, contract, internship, remote
        description: jobData.description,
        requirements: jobData.requirements || [],
        responsibilities: jobData.responsibilities || [],
        skills: jobData.skills || [],
        salary: jobData.salary || {
          min: 0,
          max: 0,
          currency: 'USD',
        },
        benefits: jobData.benefits || [],
        experienceLevel: jobData.experienceLevel || 'entry', // entry, mid, senior
        category: jobData.category || 'other',
        applicationDeadline: jobData.applicationDeadline || null,
        isActive: true,
        views: 0,
        applicationsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.collection.doc(jobId).set(jobDoc);
      return jobDoc;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  /**
   * Get job by ID
   */
  async getById(jobId) {
    try {
      const doc = await this.collection.doc(jobId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      // Increment view count
      await this.collection.doc(jobId).update({
        views: (doc.data().views || 0) + 1,
      });
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting job:', error);
      throw error;
    }
  }

  /**
   * Get all jobs with pagination and filters
   */
  async getAll(filters = {}, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      let query = this.collection.where('isActive', '==', true);

      // Apply filters
      if (filters.type) {
        query = query.where('type', '==', filters.type);
      }

      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }

      if (filters.experienceLevel) {
        query = query.where('experienceLevel', '==', filters.experienceLevel);
      }

      if (filters.employerId) {
        query = query.where('employerId', '==', filters.employerId);
      }

      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const jobs = [];
      snapshot.forEach(doc => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      
      return jobs;
    } catch (error) {
      console.error('Error getting all jobs:', error);
      throw error;
    }
  }

  /**
   * Search jobs by keyword
   */
  async search(keyword, filters = {}, page = 1, limit = 10) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation. For production, consider using Algolia or Elasticsearch
      const allJobs = await this.getAll(filters, 1, 100); // Get more jobs for search
      
      const searchTerm = keyword.toLowerCase();
      const filteredJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm)
      );
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return filteredJobs.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  /**
   * Update job
   */
  async update(jobId, updateData) {
    try {
      const updates = {
        ...updateData,
        updatedAt: new Date(),
      };

      await this.collection.doc(jobId).update(updates);
      return await this.getById(jobId);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  /**
   * Delete job (soft delete)
   */
  async delete(jobId) {
    try {
      await this.collection.doc(jobId).update({
        isActive: false,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  /**
   * Increment application count
   */
  async incrementApplications(jobId) {
    try {
      const job = await this.getById(jobId);
      await this.collection.doc(jobId).update({
        applicationsCount: (job.applicationsCount || 0) + 1,
      });
    } catch (error) {
      console.error('Error incrementing applications:', error);
      throw error;
    }
  }

  /**
   * Get jobs by employer
   */
  async getByEmployer(employerId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const snapshot = await this.collection
        .where('employerId', '==', employerId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const jobs = [];
      snapshot.forEach(doc => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      
      return jobs;
    } catch (error) {
      console.error('Error getting jobs by employer:', error);
      throw error;
    }
  }

  /**
   * Get featured/recommended jobs
   */
  async getFeatured(limit = 6) {
    try {
      const snapshot = await this.collection
        .where('isActive', '==', true)
        .orderBy('views', 'desc')
        .limit(limit)
        .get();
      
      const jobs = [];
      snapshot.forEach(doc => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      
      return jobs;
    } catch (error) {
      console.error('Error getting featured jobs:', error);
      throw error;
    }
  }
}

export default new Job();
