export interface Event {
  id: string;
  title: string;
  members: string;
  messages: string;
  datetime: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  members: string;
  messages: string;
  datetime: string;
}
