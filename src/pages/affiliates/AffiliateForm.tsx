
import React, { useEffect, useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

// Schema de validação
const affiliateSchema = z.object({
  fullName: z.string().min(3, "O nome completo deve ter pelo menos 3 caracteres"),
  username: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email inválido"),
  location: z.string().optional(),
  socialMedia: z.string().optional(),
  affiliateCode: z.string().optional(),
  affiliateLink: z.string().optional(),
  status: z.enum(["new", "active", "inactive", "vip", "potential"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  contentType: z.string().optional(),
  inSupportGroups: z.boolean().default(false),
  attendsMentoring: z.boolean().default(false),
  receivedInitialTraining: z.boolean().default(false),
  promotedProducts: z.string().optional(),
  targetReached: z.boolean().default(false),
  internalRanking: z.string().optional(),
  reportedIssues: z.string().optional(),
  supportProvided: z.string().optional(),
  feedback: z.string().optional(),
  campaignParticipation: z.string().optional(),
  interestedInUpgrade: z.boolean().default(false),
});

type AffiliateFormValues = z.infer<typeof affiliateSchema>;

interface AffiliateFormProps {
  affiliateId?: string;
  onSave: () => void;
}

const AffiliateForm: React.FC<AffiliateFormProps> = ({ affiliateId, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAffiliate, setIsLoadingAffiliate] = useState(false);

  // Inicializar formulário
  const form = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      fullName: "",
      username: "",
      whatsapp: "",
      email: "",
      location: "",
      socialMedia: "",
      affiliateCode: "",
      affiliateLink: "",
      status: "new",
      experienceLevel: "beginner",
      contentType: "",
      inSupportGroups: false,
      attendsMentoring: false,
      receivedInitialTraining: false,
      promotedProducts: "",
      targetReached: false,
      internalRanking: "",
      reportedIssues: "",
      supportProvided: "",
      feedback: "",
      campaignParticipation: "",
      interestedInUpgrade: false,
    },
  });

  // Carregar dados do afiliado se for edição
  useEffect(() => {
    const loadAffiliate = async () => {
      if (!affiliateId) return;
      
      setIsLoadingAffiliate(true);
      try {
        const { data, error } = await supabase
          .from('affiliates')
          .select('*')
          .eq('id', affiliateId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          form.reset({
            fullName: data.full_name,
            username: data.username || "",
            whatsapp: data.whatsapp || "",
            email: data.email,
            location: data.location || "",
            socialMedia: data.social_media || "",
            affiliateCode: data.affiliate_code || "",
            affiliateLink: data.affiliate_link || "",
            status: data.status as any || "new",
            experienceLevel: data.experience_level as any || "beginner",
            contentType: data.content_type ? data.content_type.join(", ") : "",
            inSupportGroups: data.in_support_groups || false,
            attendsMentoring: data.attends_mentoring || false,
            receivedInitialTraining: data.received_initial_training || false,
            promotedProducts: data.promoted_products ? data.promoted_products.join(", ") : "",
            targetReached: data.target_reached || false,
            internalRanking: data.internal_ranking?.toString() || "",
            reportedIssues: data.reported_issues || "",
            supportProvided: data.support_provided || "",
            feedback: data.feedback || "",
            campaignParticipation: data.campaign_participation ? data.campaign_participation.join(", ") : "",
            interestedInUpgrade: data.interested_in_upgrade || false,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar afiliado:', error);
      } finally {
        setIsLoadingAffiliate(false);
      }
    };
    
    loadAffiliate();
  }, [affiliateId, form]);

  // Salvar afiliado
  const onSubmit = async (values: AffiliateFormValues) => {
    setIsLoading(true);
    try {
      // Converter alguns campos para o formato esperado pelo banco
      const contentTypeArray = values.contentType ? values.contentType.split(',').map(item => item.trim()) : [];
      const promotedProductsArray = values.promotedProducts ? values.promotedProducts.split(',').map(item => item.trim()) : [];
      const campaignParticipationArray = values.campaignParticipation ? values.campaignParticipation.split(',').map(item => item.trim()) : [];
      
      const affiliateData = {
        full_name: values.fullName,
        username: values.username || null,
        whatsapp: values.whatsapp || null,
        email: values.email,
        location: values.location || null,
        social_media: values.socialMedia || null,
        affiliate_code: values.affiliateCode || null,
        affiliate_link: values.affiliateLink || null,
        status: values.status,
        experience_level: values.experienceLevel,
        content_type: contentTypeArray,
        in_support_groups: values.inSupportGroups,
        attends_mentoring: values.attendsMentoring,
        received_initial_training: values.receivedInitialTraining,
        promoted_products: promotedProductsArray,
        target_reached: values.targetReached,
        internal_ranking: values.internalRanking ? parseInt(values.internalRanking) : null,
        reported_issues: values.reportedIssues || null,
        support_provided: values.supportProvided || null,
        feedback: values.feedback || null,
        campaign_participation: campaignParticipationArray,
        interested_in_upgrade: values.interestedInUpgrade,
      };
      
      if (affiliateId) {
        // Atualizar afiliado existente
        const { error } = await supabase
          .from('affiliates')
          .update(affiliateData)
          .eq('id', affiliateId);
          
        if (error) throw error;
      } else {
        // Criar novo afiliado
        const { error } = await supabase
          .from('affiliates')
          .insert([affiliateData]);
          
        if (error) throw error;
      }
      
      onSave();
    } catch (error) {
      console.error('Erro ao salvar afiliado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAffiliate) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dados pessoais */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Dados Pessoais</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do afiliado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário (plataforma)</FormLabel>
                      <FormControl>
                        <Input placeholder="Username na plataforma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email do afiliado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="Número com DDD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade/Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Localização" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socialMedia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram/Rede Social</FormLabel>
                      <FormControl>
                        <Input placeholder="@usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="affiliateCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de afiliado</FormLabel>
                      <FormControl>
                        <Input placeholder="Código de referência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="affiliateLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link de afiliado</FormLabel>
                      <FormControl>
                        <Input placeholder="Link de referência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Status e Engajamento */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Status e Engajamento</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">Novo</SelectItem>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                          <SelectItem value="potential">Potencial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de atuação</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Iniciante</SelectItem>
                          <SelectItem value="intermediate">Intermediário</SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de conteúdo</FormLabel>
                      <FormControl>
                        <Input placeholder="Reels, tráfego pago, blog, etc." {...field} />
                      </FormControl>
                      <FormDescription>Separe por vírgulas os diferentes tipos</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="inSupportGroups"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Está nos grupos de suporte</FormLabel>
                          <FormDescription>
                            WhatsApp, Discord ou outros grupos de comunicação
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="attendsMentoring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Participa das mentorias</FormLabel>
                          <FormDescription>
                            Comparece às aulas e sessões de mentoria
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="receivedInitialTraining"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Recebeu treinamento inicial</FormLabel>
                          <FormDescription>
                            Passou pelo onboarding/treinamento básico
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Desempenho */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Desempenho</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="promotedProducts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produtos que promove</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome dos produtos" {...field} />
                      </FormControl>
                      <FormDescription>Separe por vírgulas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetReached"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Meta batida</FormLabel>
                        <FormDescription>
                          O afiliado atingiu a meta estabelecida
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="internalRanking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ranking interno</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Posição no ranking" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Relacionamento e Suporte */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Relacionamento e Suporte</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="reportedIssues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dúvidas ou dificuldades relatadas</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Problemas reportados pelo afiliado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supportProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suporte recebido</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Suporte fornecido ao afiliado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedbacks dados</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Feedbacks enviados ao afiliado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="campaignParticipation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Participação em campanhas</FormLabel>
                      <FormControl>
                        <Input placeholder="Campanhas ou promoções" {...field} />
                      </FormControl>
                      <FormDescription>Separe por vírgulas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="interestedInUpgrade"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Interesse em subir de nível</FormLabel>
                        <FormDescription>
                          O afiliado demonstrou interesse em evoluir no plano de carreira
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {affiliateId ? "Atualizar Afiliado" : "Criar Afiliado"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AffiliateForm;
