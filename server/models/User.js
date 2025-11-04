import { db } from '../config/firebase.js';

/**
 * User Model for Firestore operations
 */
class User {
  constructor() {
    this.collection = db.collection('users');
  }

  /**
   * Create a new user
   */
  async create(uid, userData) {
    try {
      const userDoc = {
        uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'jobseeker',
        phone: userData.phone || '',
        bio: userData.bio || '',
        skills: userData.skills || [],
        experience: userData.experience || [],
        education: userData.education || [],
        profileImage: userData.profileImage || '',
        resume: userData.resume || '',
        savedJobs: [],
        appliedJobs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      await this.collection.doc(uid).set(userDoc);
      return userDoc;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by UID
   */
  async getById(uid) {
    try {
      const doc = await this.collection.doc(uid).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getByEmail(email) {
    try {
      const snapshot = await this.collection
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(uid, updateData) {
    try {
      const updates = {
        ...updateData,
        updatedAt: new Date(),
      };

      await this.collection.doc(uid).update(updates);
      return await this.getById(uid);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(uid) {
    try {
      await this.collection.doc(uid).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  async getAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const snapshot = await this.collection
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Search users by criteria
   */
  async search(criteria, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      let query = this.collection;

      if (criteria.role) {
        query = query.where('role', '==', criteria.role);
      }

      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Add job to saved jobs
   */
  async saveJob(uid, jobId) {
    try {
      const user = await this.getById(uid);
      
      if (!user.savedJobs.includes(jobId)) {
        await this.collection.doc(uid).update({
          savedJobs: [...user.savedJobs, jobId],
          updatedAt: new Date(),
        });
      }
      
      return await this.getById(uid);
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  /**
   * Remove job from saved jobs
   */
  async unsaveJob(uid, jobId) {
    try {
      const user = await this.getById(uid);
      
      await this.collection.doc(uid).update({
        savedJobs: user.savedJobs.filter(id => id !== jobId),
        updatedAt: new Date(),
      });
      
      return await this.getById(uid);
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  }
}

export default new User();
