export interface Filter {
  id: string;
  name: {
    en: string;
    ka: string;
  };
  type: 'category' | 'price' | 'availability' | 'featured';
  options: FilterOption[];
}

export interface FilterOption {
  id: string;
  label: {
    en: string;
    ka: string;
  };
  value: string;
  count?: number;
}
