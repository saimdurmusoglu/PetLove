export interface Friend {
  _id: string;
  title: string;
  url?: string;
  addressUrl?: string;
  imageUrl?: string;
  address?: string;
  workDays?: WorkDay[];
  phone?: string;
  email?: string;
}

export interface WorkDay {
  isOpen: boolean;
  from?: string;
  to?: string;
}