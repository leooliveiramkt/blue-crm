
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchTab from './SearchTab';
import EditTab from './EditTab';
import { useWbuyAffiliation } from './useWbuyAffiliation';

const WbuyAffiliation = () => {
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    searching,
    affiliates,
    selectedAffiliate,
    editingAttribute,
    newAttributeValue,
    setNewAttributeValue,
    searchAffiliates,
    selectAffiliateForEdit,
    startEditAttribute,
    saveAttributeChange,
    cancelEdit,
    goBackToSearch
  } = useWbuyAffiliation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Afiliação Wbuy</h2>
        <p className="text-muted-foreground">Consulte e modifique atributos de afiliação na Wbuy.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">Buscar Afiliados</TabsTrigger>
          <TabsTrigger value="edit" disabled={!selectedAffiliate}>Editar Atributos</TabsTrigger>
        </TabsList>

        {/* Tab de Busca */}
        <TabsContent value="search" className="space-y-4">
          <SearchTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchAffiliates={searchAffiliates}
            searching={searching}
            affiliates={affiliates}
            onEdit={selectAffiliateForEdit}
          />
        </TabsContent>

        {/* Tab de Edição */}
        <TabsContent value="edit" className="space-y-4">
          {selectedAffiliate && (
            <EditTab
              affiliate={selectedAffiliate}
              editingAttribute={editingAttribute}
              newAttributeValue={newAttributeValue}
              onEditAttribute={startEditAttribute}
              onCancelEdit={cancelEdit}
              onSaveAttribute={saveAttributeChange}
              onNewAttributeValueChange={setNewAttributeValue}
              onBack={goBackToSearch}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WbuyAffiliation;
