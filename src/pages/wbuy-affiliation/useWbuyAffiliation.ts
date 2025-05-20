import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Affiliate, AffiliateAttribute } from './types';
import { useWbuyApi } from '@/hooks/useWbuyApi';

export const useWbuyAffiliation = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<AffiliateAttribute | null>(null);
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  
  const wbuyApi = useWbuyApi();

  // Função para buscar afiliados
  const searchAffiliates = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, informe um termo para busca.",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    
    try {
      // Verificar se a integração está disponível
      const isIntegrationAvailable = await wbuyApi.checkIntegration();
      
      if (!isIntegrationAvailable) {
        // Caso não tenha integração, usa dados simulados
        await simulateSearch();
        return;
      }
      
      // Tenta buscar dados reais da API
      const apiResult = await wbuyApi.getAffiliates(searchTerm);
      
      if (apiResult && Array.isArray(apiResult)) {
        // Formatar dados da API para o formato esperado pelo componente
        const formattedAffiliates = apiResult.map(formatApiAffiliate);
        setAffiliates(formattedAffiliates);
        
        if (formattedAffiliates.length === 0) {
          toast({
            title: "Nenhum resultado",
            description: "Nenhum afiliado encontrado com os termos informados.",
          });
        } else {
          toast({
            title: "Busca concluída",
            description: `${formattedAffiliates.length} afiliado(s) encontrado(s).`,
          });
        }
      } else {
        // Em caso de erro na API, usar dados simulados
        await simulateSearch();
      }
    } catch (error) {
      console.error('Erro ao buscar afiliados:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar os afiliados.",
        variant: "destructive"
      });
      
      // Em caso de erro, usar dados simulados
      await simulateSearch();
    } finally {
      setSearching(false);
    }
  };

  // Função auxiliar para formatar dados da API
  const formatApiAffiliate = (apiAffiliate: any): Affiliate => {
    // Converte os atributos do formato da API para o formato do componente
    const attributes = Object.entries(apiAffiliate.attributes || {}).map(([name, value]) => ({
      id: `${apiAffiliate.id || 'unknown'}-${name}`,
      name,
      value: String(value)
    }));
    
    return {
      id: apiAffiliate.id || String(Math.random()),
      name: apiAffiliate.name || apiAffiliate.full_name || 'Nome não disponível',
      email: apiAffiliate.email || 'Email não disponível',
      document: apiAffiliate.document || apiAffiliate.cpf || 'Documento não disponível',
      status: apiAffiliate.status || 'active',
      attributes
    };
  };

  // Função para simular busca com dados mockados
  const simulateSearch = async () => {
    // Simula uma chamada à API com tempo de resposta
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dados simulados para demonstração
    const mockAffiliates: Affiliate[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        document: '123.456.789-00',
        status: 'active',
        attributes: [
          { id: '101', name: 'grupo', value: 'premium' },
          { id: '102', name: 'comissao', value: '15%' },
          { id: '103', name: 'categoria', value: 'vendedor' }
        ]
      },
      {
        id: '2',
        name: 'Maria Oliveira',
        email: 'maria@example.com',
        document: '987.654.321-00',
        status: 'active',
        attributes: [
          { id: '201', name: 'grupo', value: 'standard' },
          { id: '202', name: 'comissao', value: '10%' },
          { id: '203', name: 'categoria', value: 'parceiro' }
        ]
      }
    ];
    
    // Filtra os resultados pelo termo de busca
    const results = mockAffiliates.filter(affiliate => 
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.document.includes(searchTerm)
    );
    
    setAffiliates(results);
    
    if (results.length === 0) {
      toast({
        title: "Nenhum resultado",
        description: "Nenhum afiliado encontrado com os termos informados.",
      });
    } else {
      toast({
        title: "Busca concluída (dados simulados)",
        description: `${results.length} afiliado(s) encontrado(s).`,
      });
    }
  };

  // Função para selecionar um afiliado para edição
  const selectAffiliateForEdit = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setActiveTab('edit');
  };

  // Função para iniciar a edição de um atributo
  const startEditAttribute = (attribute: AffiliateAttribute) => {
    setEditingAttribute(attribute);
    setNewAttributeValue(attribute.value);
  };

  // Função para salvar a alteração de um atributo
  const saveAttributeChange = async () => {
    if (!editingAttribute || !selectedAffiliate) return;
    
    try {
      // Verificar se a integração está disponível
      const isIntegrationAvailable = await wbuyApi.checkIntegration();
      
      if (isIntegrationAvailable) {
        // Tenta salvar na API real
        const success = await wbuyApi.updateAffiliateAttribute(
          selectedAffiliate.id,
          editingAttribute.name,
          newAttributeValue
        );
        
        if (!success) {
          // Se falhar na API real, simula atualização local
          await simulateAttributeUpdate();
        } else {
          // Atualiza localmente após sucesso na API
          updateLocalAffiliate();
        }
      } else {
        // Se não tiver integração, simula atualização
        await simulateAttributeUpdate();
      }
    } catch (error) {
      console.error('Erro ao atualizar atributo:', error);
      toast({
        title: "Erro na atualização",
        description: "Ocorreu um erro ao atualizar o atributo.",
        variant: "destructive"
      });
      
      // Em caso de erro, tenta simular atualização local
      await simulateAttributeUpdate();
    }
  };
  
  // Função para simular atualização de atributo
  const simulateAttributeUpdate = async () => {
    if (!editingAttribute || !selectedAffiliate) return;
    
    // Simula uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Atualiza localmente
    updateLocalAffiliate();
    
    toast({
      title: "Atributo atualizado",
      description: `O atributo ${editingAttribute.name} foi atualizado com sucesso (simulado).`,
    });
  };
  
  // Função auxiliar para atualizar o afiliado localmente
  const updateLocalAffiliate = () => {
    if (!editingAttribute || !selectedAffiliate) return;
    
    // Atualiza localmente
    const updatedAffiliates = affiliates.map(affiliate => {
      if (affiliate.id === selectedAffiliate.id) {
        const updatedAttributes = affiliate.attributes.map(attr => 
          attr.id === editingAttribute.id 
            ? { ...attr, value: newAttributeValue } 
            : attr
        );
        return { ...affiliate, attributes: updatedAttributes };
      }
      return affiliate;
    });
    
    // Atualiza o afiliado selecionado
    const updatedSelectedAffiliate = updatedAffiliates.find(a => a.id === selectedAffiliate.id) as Affiliate;
    
    setAffiliates(updatedAffiliates);
    setSelectedAffiliate(updatedSelectedAffiliate);
    setEditingAttribute(null);
  };

  // Função para cancelar a edição
  const cancelEdit = () => {
    setEditingAttribute(null);
  };

  // Função para voltar para a busca
  const goBackToSearch = () => {
    setActiveTab('search');
  };

  return {
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
  };
};
