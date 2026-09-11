export interface IChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export interface IChatRequest {
  messages: IChatMessage[];
}
