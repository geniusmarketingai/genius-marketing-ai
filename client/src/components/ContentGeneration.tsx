import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { contentGenerationSchema } from '@shared/schema';
import { generateContent, getContentTypeOptions, getObjectiveOptions, getToneOptions } from '@/lib/openai';

type ContentGenerationFormValues = z.infer<typeof contentGenerationSchema>;

type ContentGenerationProps = {
  setScreen: (screen: string) => void;
  onContentGenerated: (content: any) => void;
};

export default function ContentGeneration({ setScreen, onContentGenerated }: ContentGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const contentTypes = getContentTypeOptions();
  const objectives = getObjectiveOptions();
  const tones = getToneOptions();
  
  const form = useForm<ContentGenerationFormValues>({
    resolver: zodResolver(contentGenerationSchema),
    defaultValues: {
      type: 'INSTAGRAM_POST',
      objective: '',
      tone: 'casual',
      theme: '',
    },
  });

  const onSubmit = async (data: ContentGenerationFormValues) => {
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await generateContent({
        userId: user.id,
        ...data,
      });
      
      const contentData = await response.json();
      
      onContentGenerated(contentData);
      setScreen('preview');
    } catch (error) {
      console.error("Error generating content:", error);
      
      let errorMessage = "Tente novamente mais tarde";
      
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_) {}
      }
      
      toast({
        title: "Erro ao gerar conteúdo",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 pb-20 sm:pb-4">
      <div className="mb-6">
        <button 
          className="flex items-center text-muted-foreground mb-4"
          onClick={() => setScreen('dashboard')}
        >
          <i className="fas fa-arrow-left mr-2"></i> Voltar
        </button>
        <h2 className="text-xl font-bold">Criar novo conteúdo</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de conteúdo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de conteúdo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="objective"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Objetivo</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-2"
                  >
                    {objectives.map((objective) => (
                      <FormItem key={objective.value} className="flex flex-col items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value={objective.value}
                            id={objective.value}
                            className="sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={objective.value}
                          className="flex flex-col items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 w-full data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
                        >
                          <i className={`fas fa-${objective.icon} text-2xl mb-2 text-${objective.color}-500`}></i>
                          <span className="text-sm font-medium">{objective.label}</span>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tom de voz</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tom de voz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tema ou título</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Dicas para aumentar vendas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full py-6 bg-accent hover:bg-accent/90"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Gerando...
                </>
              ) : (
                <>
                  <i className="fas fa-bolt mr-2"></i>
                  Gerar com IA
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-3">
              Esta ação consumirá 1 crédito.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
