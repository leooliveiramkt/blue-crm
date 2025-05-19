
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AffiliateFormProps {
  affiliateId?: string;
  onSave: () => void;
}

// Esquema de validação
const affiliateSchema = z.object({
  full_name: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  status: z.enum(["active", "inactive", "vip", "new", "potential"]),
  experience_level: z.enum(["iniciante", "intermediário", "avançado", "especialista"]),
  commission_rate: z.string(),
  region: z.string()
});

type AffiliateFormValues = z.infer<typeof affiliateSchema>;

// Dados mockados
const MOCK_AFFILIATES = [
  {
    id: '1',
    full_name: 'João Silva',
    email: 'joao.silva@example.com',
    status: 'active',
    experience_level: 'avançado',
    registration_date: '2024-01-15',
    commission_rate: '15%',
    region: 'Sudeste',
    target_reached: true
  },
  {
    id: '2',
    full_name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    status: 'vip',
    experience_level: 'especialista',
    registration_date: '2023-08-20',
    commission_rate: '18%',
    region: 'Sul',
    target_reached: true
  },
  {
    id: '3',
    full_name: 'Carlos Santos',
    email: 'carlos.santos@example.com',
    status: 'inactive',
    experience_level: 'intermediário',
    registration_date: '2023-11-05',
    commission_rate: '10%',
    region: 'Norte',
    target_reached: false
  },
  {
    id: '4',
    full_name: 'Ana Paula Ferreira',
    email: 'ana.ferreira@example.com',
    status: 'new',
    experience_level: 'iniciante',
    registration_date: '2024-04-01',
    commission_rate: '10%',
    region: 'Nordeste',
    target_reached: false
  },
  {
    id: '5',
    full_name: 'Marcos Pereira',
    email: 'marcos.pereira@example.com',
    status: 'active',
    experience_level: 'intermediário',
    registration_date: '2023-12-10',
    commission_rate: '12%',
    region: 'Centro-Oeste',
    target_reached: true
  }
];

const AffiliateForm: React.FC<AffiliateFormProps> = ({ affiliateId, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      full_name: "",
      email: "",
      status: "active",
      experience_level: "iniciante",
      commission_rate: "10%",
      region: "Sudeste"
    }
  });

  useEffect(() => {
    // Se temos um ID, buscamos o afiliado correspondente (simulado)
    if (affiliateId) {
      setIsLoading(true);
      
      // Simular atraso de rede
      setTimeout(() => {
        const affiliate = MOCK_AFFILIATES.find(a => a.id === affiliateId);
        
        if (affiliate) {
          form.reset({
            full_name: affiliate.full_name,
            email: affiliate.email,
            status: affiliate.status as any,
            experience_level: affiliate.experience_level as any,
            commission_rate: affiliate.commission_rate,
            region: affiliate.region
          });
        }
        
        setIsLoading(false);
      }, 500);
    }
  }, [affiliateId, form]);

  const onSubmit = async (data: AffiliateFormValues) => {
    setIsLoading(true);
    
    try {
      // Simulando um atraso de rede para a resposta
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Log dos dados apenas para debug
      console.log("Dados salvos:", data);
      
      toast({
        title: "Dados salvos",
        description: "Os dados do afiliado foram salvos com sucesso.",
      });
      
      // Resetar o formulário se estamos criando um novo afiliado
      if (!affiliateId) {
        form.reset();
      }
      
      // Callback para informar que salvamos com sucesso
      onSave();
    } catch (error) {
      console.error("Erro ao salvar afiliado:", error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar os dados do afiliado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome Completo */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do afiliado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email do afiliado" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="new">Novo</SelectItem>
                  <SelectItem value="potential">Potencial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Nível de Experiência */}
        <FormField
          control={form.control}
          name="experience_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Experiência</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediário">Intermediário</SelectItem>
                  <SelectItem value="avançado">Avançado</SelectItem>
                  <SelectItem value="especialista">Especialista</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Taxa de Comissão */}
        <FormField
          control={form.control}
          name="commission_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa de Comissão</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a taxa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="10%">10%</SelectItem>
                  <SelectItem value="12%">12%</SelectItem>
                  <SelectItem value="15%">15%</SelectItem>
                  <SelectItem value="18%">18%</SelectItem>
                  <SelectItem value="20%">20%</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Região */}
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Região</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Sudeste">Sudeste</SelectItem>
                  <SelectItem value="Sul">Sul</SelectItem>
                  <SelectItem value="Norte">Norte</SelectItem>
                  <SelectItem value="Nordeste">Nordeste</SelectItem>
                  <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Botão de submissão */}
        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AffiliateForm;
