
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Affiliate, AffiliateAttribute } from './types';

export const useWbuyAffiliation = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<AffiliateAttribute | null>(null);
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [activeTab, setActiveTab] = useState('search');

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
      // Em produção, isso seria substituído pela chamada à API Wbuy
      // Simula uma chamada à API usando o Supabase como intermediário
      if (isSupabaseConfigured) {
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
            title: "Busca concluída",
            description: `${results.length} afiliado(s) encontrado(s).`,
          });
        }
      } else {
        toast({
          title: "Supabase não configurado",
          description: "Configure o Supabase para utilizar esta funcionalidade.",
          variant: "destructive"
        });
        setAffiliates([]);
      }
    } catch (error) {
      console.error('Erro ao buscar afiliados:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar os afiliados.",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
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
      // Em produção, isso seria substituído pela chamada à API Wbuy
      // Simula uma chamada à API para atualizar o atributo
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      
      toast({
        title: "Atributo atualizado",
        description: `O atributo ${editingAttribute.name} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar atributo:', error);
      toast({
        title: "Erro na atualização",
        description: "Ocorreu um erro ao atualizar o atributo.",
        variant: "destructive"
      });
    }
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
