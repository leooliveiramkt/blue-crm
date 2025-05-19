
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Filter,
  ArrowUp,
  Users,
  Edit,
  Plus,
  Minus
} from "lucide-react";
import AffiliateCommissionTable from "./AffiliateCommissionTable";
import CommissionSearchForm from './CommissionSearchForm';

interface Affiliate {
  id: string;
  full_name: string;
  email: string;
  commission?: string;
  affiliate_code?: string;
}

const BulkCommissionTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("name");
  const [currentCommission, setCurrentCommission] = useState("");
  const [newCommission, setNewCommission] = useState("");
  const [searchResults, setSearchResults] = useState<Affiliate[]>([]);
  const [selectedAffiliates, setSelectedAffiliates] = useState<Affiliate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Função simulada para buscar afiliados
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, informe um termo para busca.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      const mockResults = [
        { id: "1", full_name: "Ana Silva", email: "ana.silva@email.com", commission: "10%", affiliate_code: "ANA123" },
        { id: "2", full_name: "João Oliveira", email: "joao.oliveira@email.com", commission: "15%", affiliate_code: "JOA456" },
        { id: "3", full_name: "Maria Santos", email: "maria.santos@email.com", commission: "20%", affiliate_code: "MAR789" },
        { id: "4", full_name: "Pedro Costa", email: "pedro.costa@email.com", commission: "10%", affiliate_code: "PED012" },
        { id: "5", full_name: "Carla Souza", email: "carla.souza@email.com", commission: "15%", affiliate_code: "CAR345" }
      ];
      
      // Filtrar com base no termo de busca e filtro selecionado
      let filteredResults;
      if (selectedFilter === "commission") {
        filteredResults = mockResults.filter(a => a.commission === searchTerm);
      } else if (selectedFilter === "code") {
        filteredResults = mockResults.filter(a => 
          a.affiliate_code?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        filteredResults = mockResults.filter(a => 
          a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setSearchResults(filteredResults);
      setIsSearching(false);
      
      if (filteredResults.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: "Nenhum afiliado encontrado com os critérios informados."
        });
      } else if (selectedFilter === "commission" && filteredResults.length > 0) {
        setCurrentCommission(searchTerm);
      }
    }, 800);
  };

  // Selecionar todos os afiliados dos resultados
  const selectAllAffiliates = () => {
    setSelectedAffiliates(searchResults);
    toast({
      title: "Afiliados selecionados",
      description: `${searchResults.length} afiliados foram selecionados.`
    });
  };

  // Limpar seleção
  const clearSelection = () => {
    setSelectedAffiliates([]);
    toast({
      description: "Seleção de afiliados foi limpa."
    });
  };

  // Selecionar um afiliado individual
  const toggleAffiliateSelection = (affiliate: Affiliate) => {
    if (selectedAffiliates.some(a => a.id === affiliate.id)) {
      setSelectedAffiliates(selectedAffiliates.filter(a => a.id !== affiliate.id));
    } else {
      setSelectedAffiliates([...selectedAffiliates, affiliate]);
    }
  };

  // Atualizar comissão
  const updateCommission = () => {
    if (!newCommission) {
      toast({
        title: "Campo vazio",
        description: "Por favor, informe o novo percentual de comissão.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedAffiliates.length === 0) {
      toast({
        title: "Sem seleção",
        description: "Selecione pelo menos um afiliado para atualizar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      // Atualiza localmente para demonstração
      const updatedResults = searchResults.map(affiliate => {
        if (selectedAffiliates.some(selected => selected.id === affiliate.id)) {
          return { ...affiliate, commission: newCommission };
        }
        return affiliate;
      });
      
      setSearchResults(updatedResults);
      setSelectedAffiliates([]);
      setIsUpdating(false);
      
      toast({
        title: "Comissões atualizadas",
        description: `${selectedAffiliates.length} afiliados tiveram suas comissões atualizadas para ${newCommission}.`,
        variant: "default"
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulário de busca */}
        <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="bg-gradient-to-r from-background to-background/80 pb-6 border-b">
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-primary" />
              Buscar Afiliados
            </CardTitle>
            <CardDescription>
              Busque afiliados pelo nome, código ou comissão atual
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <CommissionSearchForm
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              handleSearch={handleSearch}
              isSearching={isSearching}
            />
          </CardContent>
        </Card>
        
        {/* Formulário de atualização */}
        <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-background to-blue-500/5">
          <CardHeader className="bg-gradient-to-r from-background to-background/80 pb-6 border-b">
            <CardTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5 text-blue-500" />
              Atualizar Comissão
            </CardTitle>
            <CardDescription>
              Selecione afiliados e atualize o percentual de comissão
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {currentCommission && selectedFilter === "commission" && (
                <div className="p-3 rounded-md bg-muted/30 border border-muted">
                  <p className="text-sm text-muted-foreground">Comissão atual</p>
                  <p className="font-medium text-lg">{currentCommission}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nova comissão (%)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 20%"
                    value={newCommission}
                    onChange={e => setNewCommission(e.target.value)}
                  />
                  <Button variant="outline" size="icon" onClick={() => setNewCommission(`${parseInt(newCommission || "0") + 5}%`)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setNewCommission(`${parseInt(newCommission || "0") - 5}%`)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <p className="text-sm">{selectedAffiliates.length} afiliados selecionados</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={clearSelection} disabled={selectedAffiliates.length === 0}>
                    Limpar
                  </Button>
                  <Button size="sm" variant="outline" onClick={selectAllAffiliates} disabled={searchResults.length === 0}>
                    Selecionar todos
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={updateCommission}
                disabled={isUpdating || selectedAffiliates.length === 0 || !newCommission}
              >
                {isUpdating ? "Atualizando..." : "Atualizar Comissões"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabela de resultados */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-background to-background/80 pb-6 border-b">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Resultados da Busca
          </CardTitle>
          <CardDescription>
            {searchResults.length} afiliados encontrados
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 bg-gradient-to-br from-background to-primary/5">
          <AffiliateCommissionTable 
            affiliates={searchResults} 
            selectedAffiliates={selectedAffiliates}
            onToggleSelect={toggleAffiliateSelection}
            isLoading={isSearching}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkCommissionTab;
