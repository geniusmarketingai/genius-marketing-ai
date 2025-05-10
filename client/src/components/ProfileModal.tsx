import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from 'zod';
import { onboardingSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { getBusinessTypeOptions, getChannelOptions } from '@/lib/openai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const profileSchema = onboardingSchema.extend({
  name: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  
  const businessTypeOptions = getBusinessTypeOptions();
  const channelOptions = getChannelOptions();
  
  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/profile?userId=${user.id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id && isOpen,
  });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      businessType: '',
      targetPersona: '',
      channels: [],
    },
  });
  
  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        businessType: profile.businessType || '',
        targetPersona: profile.targetPersona || '',
        channels: profile.channels || [],
      });
    }
  }, [profile, form]);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (!user?.id) return null;
      return apiRequest('PUT', '/api/profile', {
        ...data,
        userId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile', user?.id] });
      toast({
        title: "Perfil atualizado",
        description: "Suas alterações foram salvas com sucesso",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar suas alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      await updateProfileMutation.mutateAsync(data);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Meu Perfil</DialogTitle>
          <DialogClose className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" />
        </DialogHeader>
        
        {isLoading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
            <p className="text-muted-foreground">Carregando perfil...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormLabel>E-mail</FormLabel>
                <p className="p-3 bg-gray-50 rounded-lg text-gray-700">
                  {user?.email}
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nicho de atuação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="targetPersona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persona alvo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="channels"
                render={() => (
                  <FormItem>
                    <FormLabel>Canais</FormLabel>
                    <div className="space-y-2">
                      {channelOptions.map((channel) => (
                        <FormField
                          key={channel.value}
                          control={form.control}
                          name="channels"
                          render={({ field }) => {
                            return (
                              <div className="flex items-center space-x-3">
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
                                <FormLabel className="cursor-pointer">{channel.label}</FormLabel>
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
              
              <div className="mt-8 space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sair
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
