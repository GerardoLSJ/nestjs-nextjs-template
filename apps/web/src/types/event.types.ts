export interface Event {
  id: string;
  title: string;
  members: string;
  dateTime: string;
  createdAt: string;
}

export interface CreateEventInput {
  title: string;
  members: string;
  dateTime: string;
}
