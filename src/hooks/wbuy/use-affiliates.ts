
import { useAffiliateSearch } from './affiliates/use-affiliate-search';
import { useAffiliateMutations } from './affiliates/use-affiliate-mutations';
import { useAffiliateCommissions } from './affiliates/use-affiliate-commissions';

/**
 * Hook para gerenciar afiliados da Wbuy
 */
export const useWbuyAffiliates = () => {
  const { isLoading: isSearchLoading, getAffiliates, getAffiliateDetails } = useAffiliateSearch();
  const { isLoading: isMutationsLoading, createAffiliate, updateAffiliate, updateAffiliateAttribute } = useAffiliateMutations();
  const { isLoading: isCommissionsLoading, getAffiliateCommissions } = useAffiliateCommissions();

  const isLoading = isSearchLoading || isMutationsLoading || isCommissionsLoading;

  return {
    isLoading,
    getAffiliates,
    getAffiliateDetails,
    createAffiliate,
    updateAffiliate,
    updateAffiliateAttribute,
    getAffiliateCommissions
  };
};
