/**
 * Application Configuration
 * 
 * This file contains configuration settings for the VBAcoustic application.
 * Modify these settings to customize the application behavior.
 */

// Authentication Configuration
export const AUTH_CONFIG = {
  // Set to false to completely disable the login screen
  enabled: true,
  
  // Test credentials for development
  credentials: {
    username: 'testuser',
    password: 'testpassword'
  },
  
  // Session persistence
  persistSession: true
};

// Application Configuration
export const APP_CONFIG = {
  // Application name
  name: 'VBAcoustic',
  
  // Version
  version: '1.0.0'
};

/**
 * Quick Disable Instructions:
 * 
 * To disable the login screen entirely:
 * 1. Change AUTH_CONFIG.enabled to false
 * 2. Save this file
 * 3. The application will automatically bypass authentication
 * 
 * To change credentials:
 * 1. Modify AUTH_CONFIG.credentials.username and password
 * 2. Save this file
 */
