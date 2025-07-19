import { logAnalyticsEvent } from '../firebase/config';

// Track errors
export const trackError = (errorCode, errorMessage, additionalInfo = {}) => {
  logAnalyticsEvent('app_error', {
    error_code: errorCode,
    error_message: errorMessage,
    ...additionalInfo
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName, additionalInfo = {}) => {
  logAnalyticsEvent('feature_use', {
    feature_name: featureName,
    ...additionalInfo
  });
};

// Track performance metrics
export const trackPerformance = (metricName, valueInMs) => {
  logAnalyticsEvent('performance_metric', {
    metric_name: metricName,
    value_ms: valueInMs
  });
};

// Track user properties (should be used sparingly)
export const setUserProperties = (analytics, properties) => {
  Object.entries(properties).forEach(([key, value]) => {
    analytics.setUserProperty(key, value);
  });
};