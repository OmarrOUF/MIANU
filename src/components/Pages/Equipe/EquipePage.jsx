import React from 'react';
import { useTranslation } from 'react-i18next';
import EquipeSection from './EquipeSection';
import SEO from '../../SEO/SEO';

const EquipePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={t('equipe.pageTitle')}
        description={t('equipe.subtitle')}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MIANU-SM III Team",
          "url": "https://mianu-sm.com/equipe",
          "logo": "https://mianu-sm.com/MIANULOGO.png",
          "description": t('equipe.subtitle'),
          "member": [
            {
              "@type": "Person",
              "name": "MIANU-SM Team Members"
            }
          ],
          "sameAs": ["https://instagram.com/sm.mianu"]
        }}
      />
      
      <main className="pt-16 pb-12">
        <EquipeSection />
      </main>
    </>
  );
};

export default EquipePage;