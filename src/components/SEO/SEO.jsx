import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  title = '', 
  description = '', 
  image = '/MIANULOGO.png',
  type = 'website',
  structuredData = null
}) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Default values based on current language
  const defaultTitle = currentLanguage === 'fr' 
    ? 'MIANU-SM III | Conférence MUN' 
    : 'MIANU-SM III | MUN Conference';
  const defaultDescription = currentLanguage === 'fr'
    ? 'Rejoignez MIANU-SM III, la conférence Modèle des Nations Unies au Collège Saint-Marc, Alexandrie en octobre 2025.'
    : 'Join MIANU-SM III, the premier Model United Nations conference at College Saint-Marc, Alexandria in October 2025.';

  // Use provided values or defaults
  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;

  // Base URL and canonical/image URLs
  const baseUrl = 'https://mianu-sm.com';
  const canonicalUrl = `${baseUrl}${location.pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const ogLocale = currentLanguage === 'fr' ? 'fr_FR' : 'en_US';

  useEffect(() => {
    document.title = pageTitle;

    // Meta helpers
    const updateMetaName = (name, content) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    };
    const updateMetaProperty = (property, content) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    };
    const updateLinkTag = (rel, hreflang, href) => {
      let linkTag = document.querySelector(`link[rel="${rel}"][hreflang="${hreflang}"]`);
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.setAttribute('rel', rel);
        linkTag.setAttribute('hreflang', hreflang);
        document.head.appendChild(linkTag);
      }
      linkTag.href = href;
    };

    // Meta tags
    updateMetaName('description', pageDescription);
    updateMetaName('image', imageUrl);
    updateMetaName('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaName('sitemap', `${baseUrl}/sitemap.xml`);
    updateMetaName('instagram:site', '@sm.mianu');

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Alternate languages
    updateLinkTag('alternate', 'en', `${baseUrl}/`);
    updateLinkTag('alternate', 'fr', `${baseUrl}/`);
    updateLinkTag('alternate', 'x-default', `${baseUrl}/`);

    // Social profile (Instagram)
    let relMe = document.querySelector('link[rel="me"]');
    if (!relMe) {
      relMe = document.createElement('link');
      relMe.setAttribute('rel', 'me');
      relMe.setAttribute('type', 'text/html');
      document.head.appendChild(relMe);
    }
    relMe.href = 'https://instagram.com/sm.mianu';

    // Open Graph
    updateMetaProperty('og:title', pageTitle);
    updateMetaProperty('og:description', pageDescription);
    updateMetaProperty('og:url', canonicalUrl);
    updateMetaProperty('og:image', imageUrl);
    updateMetaProperty('og:image:alt', 'MIANU-SM III Logo');
    updateMetaProperty('og:image:width', '512');
    updateMetaProperty('og:image:height', '512');
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:site_name', 'MIANU-SM III');
    updateMetaProperty('og:locale', ogLocale);
    updateMetaProperty('og:locale:alternate', ogLocale === 'en_US' ? 'fr_FR' : 'en_US');
    updateMetaProperty('og:see_also', 'https://instagram.com/sm.mianu');
    updateMetaProperty('og:see_also', `${baseUrl}/inscription`);
    updateMetaProperty('og:see_also', `${baseUrl}/committees`);
    updateMetaProperty('og:determiner', 'the');
    updateMetaProperty('og:updated_time', '2024-06-01T00:00:00+00:00');
    updateMetaProperty('og:profile', 'https://instagram.com/sm.mianu');

    // Publisher for Instagram only
    updateMetaProperty('article:publisher', 'https://instagram.com/sm.mianu');
    // Removed LinkedIn and Twitter meta tags

    // Structured Data
    if (structuredData) {
      let scriptTag = document.querySelector('#structured-data');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else {
      const existingScript = document.querySelector('#structured-data');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    }

    // Cleanup (optional)
    return () => {};
  }, [pageTitle, pageDescription, canonicalUrl, imageUrl, type, structuredData, currentLanguage]);

  return null;
};

export default SEO;