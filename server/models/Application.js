import { db } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Application Model for Firestore operations
 */
class Application {
  constructor() {
    this.collection = db.collection('applications');
  }

  /**
   * Create a new job application
   */
  async create(applicationData) {
    try {
      const applicationId = uuidv4();
      
      const applicationDoc = {
        id: applicationId,
        jobId: applicationData.jobId,
        jobseekerId: applicationData.jobseekerId,
        employerId: applicationData.employerId,
        coverLetter: applicationData.coverLetter,
        resume: applicationData.resume || '',
        status: 'pending', // pending, reviewed, shortlisted, rejected, accepted
        notes: applicationData.notes || '',
        appliedAt: new Date(),
        updatedAt: new Date(),
      };

      await this.collection.doc(applicationId).set(applicationDoc);
      return applicationDoc;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  /**
   * Get application by ID
   */
  async getById(applicationId) {
    try {
      const doc = await this.collection.doc(applicationId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting application:', error);
      throw error;
    }
  }

  /**
   * Get applications by jobseeker
   */
  async getByJobseeker(jobseekerId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const snapshot = await this.collection
        .where('jobseekerId', '==', jobseekerId)
        .orderBy('appliedAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const applications = [];
      snapshot.forEach(doc => {
        applications.push({ id: doc.id, ...doc.data() });
      });
      
      return applications;
    } catch (error) {
      console.error('Error getting applications by jobseeker:', error);
      throw error;
    }
  }

  /**
   * Get applications by employer
   */
  async getByEmployer(employerId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const snapshot = await this.collection
        .where('employerId', '==', employerId)
        .orderBy('appliedAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const applications = [];
      snapshot.forEach(doc => {
        applications.push({ id: doc.id, ...doc.data() });
      });
      
      return applications;
    } catch (error) {
      console.error('Error getting applications by employer:', error);
      throw error;
    }
  }

  /**
   * Get applications for a specific job
   */
  async getByJob(jobId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const snapshot = await this.collection
        .where('jobId', '==', jobId)
        .orderBy('appliedAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const applications = [];
      snapshot.forEach(doc => {
        applications.push({ id: doc.id, ...doc.data() });
      });
      
      return applications;
    } catch (error) {
      console.error('Error getting applications by job:', error);
      throw error;
    }
  }

  /**
   * Check if user already applied for a job
   */
  async checkExisting(jobId, jobseekerId) {
    try {
      const snapshot = await this.collection
        .where('jobId', '==', jobId)
        .where('jobseekerId', '==', jobseekerId)
        .limit(1)
        .get();
      
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking existing application:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  async updateStatus(applicationId, status, notes = '') {
    try {
      await this.collection.doc(applicationId).update({
        status,
        notes,
        updatedAt: new Date(),
      });
      
      return await this.getById(applicationId);
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  /**
   * Update application
   */
  async update(applicationId, updateData) {
    try {
      const updates = {
        ...updateData,
        updatedAt: new Date(),
      };

      await this.collection.doc(applicationId).update(updates);
      return await this.getById(applicationId);
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }

  /**
   * Delete application
   */
  async delete(applicationId) {
    try {
      await this.collection.doc(applicationId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  /**
   * Get application statistics for employer
   */
  async getStats(employerId) {
    try {
      const snapshot = await this.collection
        .where('employerId', '==', employerId)
        .get();
      
      const stats = {
        total: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        rejected: 0,
        accepted: 0,
      };
      
      snapshot.forEach(doc => {
        const data = doc.data();
        stats.total++;
        stats[data.status] = (stats[data.status] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting application stats:', error);
      throw error;
    }
  }
}

export default new Application();
