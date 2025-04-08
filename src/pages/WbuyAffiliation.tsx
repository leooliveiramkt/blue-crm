
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Edit, Search, Users, Save, RefreshCw } from 'lucide-react';
import { supabaseClient, isSupabaseConfigured } from '@/lib/supabase';

// Tipos para as afiliações
interface Affiliate {
  id: string;
  name: string;
  email: string;
  document: string;
  status: string;
  attributes: AffiliateAttribute[];
}

interface AffiliateAttribute {
  id: string;
  name: string;
  value: string;
}

const WbuyAffiliation = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<AffiliateAttribute | null>(null);
  const [newAttributeValue, setNewAttributeValue] = useState('');

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
          <Card>
            <CardHeader>
              <CardTitle>Buscar Afiliados</CardTitle>
              <CardDescription>
                Busque afiliados por nome, email ou documento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder="Digite nome, email ou documento"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchAffiliates()}
                  />
                </div>
                <Button onClick={searchAffiliates} disabled={searching}>
                  {searching ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  {searching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>

              {affiliates.length > 0 && (
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-medium">Resultados da Busca</h3>
                  {affiliates.map((affiliate) => (
                    <Card key={affiliate.id} className="overflow-hidden">
                      <div className="flex">
                        <div className="flex-1 p-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-md font-medium">{affiliate.name}</h4>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p>Email: {affiliate.email}</p>
                            <p>Documento: {affiliate.document}</p>
                            <p>Status: {affiliate.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                          </div>
                        </div>
                        <div className="flex items-center pr-4">
                          <Button variant="outline" size="sm" onClick={() => selectAffiliateForEdit(affiliate)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Edição */}
        <TabsContent value="edit" className="space-y-4">
          {selectedAffiliate && (
            <Card>
              <CardHeader>
                <CardTitle>Editar Atributos</CardTitle>
                <CardDescription>
                  Modifique os atributos do afiliado {selectedAffiliate.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 text-blue-700 rounded flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Importante</p>
                    <p className="text-sm">
                      As alterações nos atributos serão refletidas imediatamente nas operações da Wbuy.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 font-medium text-sm text-muted-foreground py-2 border-b">
                    <div>Nome do Atributo</div>
                    <div>Valor</div>
                    <div>Ações</div>
                  </div>

                  {selectedAffiliate.attributes.map((attribute) => (
                    <div key={attribute.id} className="grid grid-cols-3 items-center py-2 border-b">
                      <div className="font-medium">{attribute.name}</div>
                      
                      {editingAttribute && editingAttribute.id === attribute.id ? (
                        <div>
                          <Input 
                            value={newAttributeValue} 
                            onChange={(e) => setNewAttributeValue(e.target.value)}
                            className="max-w-[200px]"
                          />
                        </div>
                      ) : (
                        <div>{attribute.value}</div>
                      )}
                      
                      <div>
                        {editingAttribute && editingAttribute.id === attribute.id ? (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              Cancelar
                            </Button>
                            <Button size="sm" onClick={saveAttributeChange}>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEditAttribute(attribute)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('search')}>
                  Voltar para Busca
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WbuyAffiliation;
