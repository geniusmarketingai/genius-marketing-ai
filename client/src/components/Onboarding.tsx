import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from '@/lib/queryClient';
import { onboardingSchema } from '@shared/schema';
import { getBusinessTypeOptions, getChannelOptions, getPersonaSuggestions } from '@/lib/openai';

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const businessTypeOptions = getBusinessTypeOptions();
  const channelOptions = getChannelOptions();
  const personaSuggestions = getPersonaSuggestions();
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      userId: '',
      email: '',
      name: '',
      businessType: '',
      targetPersona: '',
      channels: [],
    },
  });
  
  useEffect(() => {
    if (user?.id && user?.email) {
      form.reset({
        ...form.getValues(), 
        userId: user.id,
        email: user.email,
        name: form.getValues().name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [user, form]);
  
  const loading = form.formState.isSubmitting;
  
  const goToNextStep = () => {
    if (step === 1 && !form.getValues().businessType) {
      form.setError('businessType', { message: 'Selecione um nicho de atuação' });
      return;
    }
    
    if (step === 2 && !form.getValues().targetPersona) {
      form.setError('targetPersona', { message: 'Descreva sua persona alvo' });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      await apiRequest('POST', '/api/profile', data);
      
      toast({
        title: "Perfil salvo com sucesso!",
        description: "Agora você pode começar a criar conteúdo.",
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving profile:", error);
      let errorMessage = "Tente novamente mais tarde.";
      if (error && typeof error === 'object' && 'response' in error && error.response && 
          typeof error.response === 'object' && 'data' in error.response && error.response.data &&
          typeof error.response.data === 'object' && 'message' in error.response.data) {
        errorMessage = String((error.response.data as any).message);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao salvar perfil",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  const selectPersonaSuggestion = (suggestion: string) => {
    form.setValue('targetPersona', suggestion);
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Início</span>
            <span className="text-xs font-medium text-muted-foreground">Concluído</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full progress-bar-animation" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs font-medium text-muted-foreground mt-1">Etapa {step} de 3</div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Business Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Qual é o seu nicho de atuação?</h2>
                  <p className="text-muted-foreground">Selecione o nicho que melhor descreve o seu negócio.</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="button" 
                  onClick={goToNextStep}
                  className="w-full mt-8"
                >
                  Próximo <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            )}
            
            {/* Step 2: Target Persona */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Quem é sua persona alvo?</h2>
                  <p className="text-muted-foreground">Descreva o cliente ideal para o seu negócio.</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="targetPersona"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Mulheres 30-45 anos interessadas em cuidados com a pele" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Sugestões:</p>
                  <div className="flex flex-wrap gap-2">
                    {personaSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                        onClick={() => selectPersonaSuggestion(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    className="w-1/2"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Voltar
                  </Button>
                  <Button 
                    type="button"
                    onClick={goToNextStep}
                    className="w-1/2"
                  >
                    Próximo <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Publication Channels */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Onde você publica conteúdo?</h2>
                  <p className="text-muted-foreground">Selecione os canais que você utiliza para seu marketing.</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="channels"
                  render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {channelOptions.map((channel) => (
                          <FormField
                            key={channel.value}
                            control={form.control}
                            name="channels"
                            render={({ field }) => {
                              return (
                                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(channel.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, channel.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== channel.value
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <span>
                                    <i className={`fab fa-${channel.icon} text-xl text-${channel.color}-500`}></i>
                                  </span>
                                  <FormLabel className="font-medium cursor-pointer">
                                    {channel.label}
                                  </FormLabel>
                                </div>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-4 mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    className="w-1/2"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Voltar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-1/2"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Salvando...
                      </>
                    ) : (
                      "Concluir"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
