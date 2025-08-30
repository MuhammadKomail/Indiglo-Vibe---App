export interface Message {
  id: string;
  roomId: string;
  text: string;
  time: string;
  user: {
    id: string;
    avatar?: string;
    name?: string;
  };
  status?: 'sending' | 'sent' | 'failed' | 'read';
}
