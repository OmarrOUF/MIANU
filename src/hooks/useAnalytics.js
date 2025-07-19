import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logAnalyticsEvent } from '../firebase/config';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    logAnalyticsEvent('page_view', {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [location]);

  // Custom event logging functions
  const logButtonClick = (buttonName, additionalParams = {}) => {
    logAnalyticsEvent('button_click', {
      button_name: buttonName,
      ...additionalParams
    });
  };

  const logLogin = (method = 'email') => {
    logAnalyticsEvent('login', { method });
  };

  const logSignUp = (method = 'email') => {
    logAnalyticsEvent('sign_up', { method });
  };

  const logFormSubmit = (formName, success = true) => {
    logAnalyticsEvent('form_submit', {
      form_name: formName,
      success
    });
  };

  const logSearch = (searchTerm) => {
    logAnalyticsEvent('search', { search_term: searchTerm });
  };

  const logUserEngagement = (contentType, contentId, engagementType) => {
    logAnalyticsEvent('user_engagement', {
      content_type: contentType,
      content_id: contentId,
      engagement_type: engagementType
    });
  };

  return {
    logButtonClick,
    logLogin,
    logSignUp,
    logFormSubmit,
    logSearch,
    logUserEngagement,
    logCustomEvent: logAnalyticsEvent
  };
};