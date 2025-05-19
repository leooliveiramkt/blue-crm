
import React from 'react';
import TopAffiliatesCard from './TopAffiliatesCard';
import FeaturedCampaignsCard from './FeaturedCampaignsCard';
import ActiveIntegrationsCard from './ActiveIntegrationsCard';

const CardsSection = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <TopAffiliatesCard />
      <FeaturedCampaignsCard />
      <ActiveIntegrationsCard />
    </div>
  );
};

export default CardsSection;
