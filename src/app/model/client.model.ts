export interface Transaction {
  _id?: string;
  date: string; 
  amount: number;
  note?: string;
}

export interface Client {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  status?: 'Active' | 'Inactive';
  transactions?: Transaction[];
  createdAt?: string;
  updatedAt?: string;
}
