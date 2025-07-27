/**
 * Database Service Module
 * 
 * This module provides a comprehensive interface for all database operations
 * in the BizGenius application. It handles chat history, business plans, and
 * user profiles with proper error handling and type safety.
 * 
 * Key Features:
 * - Chat history management with bookmarking
 * - Business plan CRUD operations
 * - User profile management
 * - Real-time data synchronization
 * - Comprehensive error handling
 * 
 * @author BizGenius Team
 * @version 1.0.0
 */

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Chat History Interfaces
 */
export interface ChatHistoryRecord {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  is_bookmarked: boolean;
  conversation_id: string;
  message_type: 'interaction' | 'system' | 'error';
  tokens_used: number;
  model_used: string;
  response_time_ms: number;
  created_at: string;
  updated_at: string;
}

export interface CreateChatHistoryInput {
  question: string;
  answer: string;
  conversation_id?: string;
  message_type?: 'interaction' | 'system' | 'error';
  tokens_used?: number;
  model_used?: string;
  response_time_ms?: number;
}

/**
 * Business Plan Interfaces
 */
export interface BusinessPlanRecord {
  id: string;
  user_id: string;
  business_name: string;
  industry: string;
  business_type: string;
  location: string;
  target_audience: string;
  value_proposition: string;
  revenue_model: string;
  goals: string;
  generated_plan: any[];
  title: string;
  status: 'draft' | 'complete' | 'archived';
  sections_count: number;
  ai_model_used: string;
  generation_time_ms: number;
  last_modified_at: string;
  is_favorite: boolean;
  export_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessPlanInput {
  business_name: string;
  industry: string;
  business_type: string;
  location: string;
  target_audience: string;
  value_proposition: string;
  revenue_model?: string;
  goals?: string;
  generated_plan: any[];
  title: string;
  ai_model_used?: string;
  generation_time_ms?: number;
}

/**
 * Database Service Class
 * 
 * Main class for handling all database operations with proper error handling
 * and type safety. Provides methods for chat history and business plan management.
 */
export class DatabaseService {
  /**
   * Get current authenticated user
   */
  private async getCurrentUser(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  // ==================== CHAT HISTORY METHODS ====================

  /**
   * Save chat interaction to database
   */
  async saveChatHistory(input: CreateChatHistoryInput): Promise<ChatHistoryRecord> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          question: input.question,
          answer: input.answer,
          conversation_id: input.conversation_id || crypto.randomUUID(),
          message_type: input.message_type || 'interaction',
          tokens_used: input.tokens_used || 0,
          model_used: input.model_used || 'tngtech/deepseek-r1t2-chimera:free',
          response_time_ms: input.response_time_ms || 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving chat history:', error);
      throw new Error('Failed to save chat history');
    }
  }

  /**
   * Get user's chat history with pagination
   */
  async getChatHistory(limit: number = 50, offset: number = 0): Promise<ChatHistoryRecord[]> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw new Error('Failed to fetch chat history');
    }
  }

  /**
   * Get bookmarked chat history
   */
  async getBookmarkedChats(): Promise<ChatHistoryRecord[]> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_bookmarked', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bookmarked chats:', error);
      throw new Error('Failed to fetch bookmarked chats');
    }
  }

  /**
   * Toggle bookmark status of a chat
   */
  async toggleChatBookmark(chatId: string): Promise<ChatHistoryRecord> {
    try {
      const user = await this.getCurrentUser();
      
      // First get current bookmark status
      // Validate that messageId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(messageId)) {
        throw new Error('Invalid message ID format. Cannot bookmark message that is not saved to database.');
      }
      
      const { data: currentData, error: fetchError } = await supabase
        .from('chat_history')
        .select('is_bookmarked')
        .eq('id', chatId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Toggle the bookmark status
      const { data, error } = await supabase
        .from('chat_history')
        .update({ is_bookmarked: !currentData.is_bookmarked })
        .eq('id', chatId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling chat bookmark:', error);
      throw new Error('Failed to toggle bookmark');
    }
  }

  /**
   * Delete chat history record
   */
  async deleteChatHistory(chatId: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting chat history:', error);
      throw new Error('Failed to delete chat history');
    }
  }

  /**
   * Clear all chat history for user
   */
  async clearAllChatHistory(): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw new Error('Failed to clear chat history');
    }
  }

  // ==================== BUSINESS PLAN METHODS ====================

  /**
   * Save business plan to database
   */
  async saveBusinessPlan(input: CreateBusinessPlanInput): Promise<BusinessPlanRecord> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('business_plans')
        .insert({
          user_id: user.id,
          business_name: input.business_name,
          industry: input.industry,
          business_type: input.business_type,
          location: input.location,
          target_audience: input.target_audience,
          value_proposition: input.value_proposition,
          revenue_model: input.revenue_model || '',
          goals: input.goals || '',
          generated_plan: input.generated_plan,
          title: input.title,
          ai_model_used: input.ai_model_used || 'tngtech/deepseek-r1t2-chimera:free',
          generation_time_ms: input.generation_time_ms || 0,
          status: 'complete'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving business plan:', error);
      throw new Error('Failed to save business plan');
    }
  }

  /**
   * Get user's business plans
   */
  async getBusinessPlans(): Promise<BusinessPlanRecord[]> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching business plans:', error);
      throw new Error('Failed to fetch business plans');
    }
  }

  /**
   * Get single business plan by ID
   */
  async getBusinessPlan(planId: string): Promise<BusinessPlanRecord> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('id', planId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching business plan:', error);
      throw new Error('Failed to fetch business plan');
    }
  }

  /**
   * Update business plan
   */
  async updateBusinessPlan(planId: string, updates: Partial<BusinessPlanRecord>): Promise<BusinessPlanRecord> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('business_plans')
        .update({
          ...updates,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', planId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating business plan:', error);
      throw new Error('Failed to update business plan');
    }
  }

  // ==================== PROFILE METHODS ====================

  /**
   * Update user profile
   */
  async updateProfile(updates: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    phone?: string;
    location?: string;
    company?: string;
    position?: string;
    bio?: string;
    website?: string;
    linkedin_url?: string;
    twitter_url?: string;
  }): Promise<any> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<any> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  /**
   * Toggle favorite status of business plan
   */
  async toggleBusinessPlanFavorite(planId: string): Promise<BusinessPlanRecord> {
    try {
      const user = await this.getCurrentUser();
      
      // Get current favorite status
      const { data: currentData, error: fetchError } = await supabase
        .from('business_plans')
        .select('is_favorite')
        .eq('id', planId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Toggle favorite status
      const { data, error } = await supabase
        .from('business_plans')
        .update({ is_favorite: !currentData.is_favorite })
        .eq('id', planId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling business plan favorite:', error);
      throw new Error('Failed to toggle favorite');
    }
  }

  /**
   * Increment export count for business plan
   */
  async incrementExportCount(planId: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      
      const { error } = await supabase
        .from('business_plans')
        .update({ 
          export_count: supabase.raw('export_count + 1')
        })
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing export count:', error);
      throw new Error('Failed to update export count');
    }
  }

  /**
   * Delete business plan
   */
  async deleteBusinessPlan(planId: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      
      const { error } = await supabase
        .from('business_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting business plan:', error);
      throw new Error('Failed to delete business plan');
    }
  }

  /**
   * Get favorite business plans
   */
  async getFavoriteBusinessPlans(): Promise<BusinessPlanRecord[]> {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching favorite business plans:', error);
      throw new Error('Failed to fetch favorite business plans');
    }
  }
}

/**
 * Singleton Database Service Instance
 * 
 * Pre-configured DatabaseService instance ready for immediate use.
 * This singleton pattern ensures consistent database access across the app.
 */
export const databaseService = new DatabaseService();

/**
 * Type Exports for TypeScript Support
 */
export type { ChatHistoryRecord, CreateChatHistoryInput, BusinessPlanRecord, CreateBusinessPlanInput };