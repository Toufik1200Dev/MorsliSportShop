import apiCall from './config.js';
import { setAuthToken } from './config.js';

// Admin login only (no registration)
export const login = async (email, password) => {
  const response = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // API returns { success: true, token, data: {...} }
  if (response.token) {
    setAuthToken(response.token);
  }
  
  // Return user data for context
  return response.data || response;
};

// Logout user
export const logout = async () => {
  try {
    await apiCall('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Continue even if API call fails
  } finally {
    setAuthToken(null);
  }
};

// Get current user
export const getMe = async () => {
  return await apiCall('/auth/me');
};

