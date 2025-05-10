import { apiRequest } from './queryClient';
import { ContentTypeEnum } from '@shared/schema';

type GenerateContentParams = {
  userId: string;
  type: string;
  objective: string;
  tone: string;
  theme: string;
};

export const generateContent = async (params: GenerateContentParams) => {
  return apiRequest('POST', '/api/generate', params);
};

// Function to map content type enum to display name in Portuguese
export const getContentTypeName = (type: string): string => {
  switch (type) {
    case 'INSTAGRAM_POST':
      return 'Post Instagram';
    case 'BLOG_ARTICLE':
      return 'Artigo de Blog';
    case 'FACEBOOK_AD':
      return 'Anúncio Facebook';
    default:
      return 'Conteúdo';
  }
};

// Function to get tone options
export const getToneOptions = () => [
  { value: 'casual', label: 'Descontraído' },
  { value: 'professional', label: 'Profissional' },
  { value: 'formal', label: 'Formal' },
  { value: 'technical', label: 'Técnico' },
];

// Function to get objective options
export const getObjectiveOptions = () => [
  { value: 'engagement', label: 'Engajamento', icon: 'comments', color: 'blue' },
  { value: 'traffic', label: 'Tráfego', icon: 'chart-line', color: 'green' },
  { value: 'sales', label: 'Vendas', icon: 'shopping-cart', color: 'red' },
];

// Function to get content type options
export const getContentTypeOptions = () => [
  { value: 'INSTAGRAM_POST', label: 'Post para Instagram' },
  { value: 'BLOG_ARTICLE', label: 'Artigo para Blog' },
  { value: 'FACEBOOK_AD', label: 'Anúncio para Facebook' },
];

// Function to get business type options
export const getBusinessTypeOptions = () => [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'infoprodutos', label: 'Infoprodutos' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'saude', label: 'Saúde e Bem-estar' },
  { value: 'educacao', label: 'Educação' },
  { value: 'financas', label: 'Finanças' },
  { value: 'imobiliaria', label: 'Imobiliária' },
  { value: 'outro', label: 'Outro' },
];

// Function to get channel options
export const getChannelOptions = () => [
  { value: 'instagram', label: 'Instagram', icon: 'instagram', color: 'pink' },
  { value: 'facebook', label: 'Facebook', icon: 'facebook', color: 'blue' },
  { value: 'blog', label: 'Blog / Website', icon: 'globe', color: 'green' },
  { value: 'email', label: 'E-mail Marketing', icon: 'envelope', color: 'yellow' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', color: 'green' },
];

// Function to get persona suggestions
export const getPersonaSuggestions = () => [
  'Empreendedores iniciantes',
  'Mães de primeira viagem',
  'Profissionais liberais',
  'Estudantes universitários',
  'Microempreendedores',
  'Entusiastas de tecnologia',
];
