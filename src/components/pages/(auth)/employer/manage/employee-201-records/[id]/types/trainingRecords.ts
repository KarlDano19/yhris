export type TrainingRecord = {
  id: number;
  employee: number;
  employee_id?: string;
  training_title: string;
  date_completed: string | null;
  training_provider?: string | null;
  proof_of_completion?: string | null; // URL
};

export type TrainingListMeta = {
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  starting: number;
  ending: number;
  records: TrainingRecord[];
};

export type ListOptions = {
  start?: string;
  end?: string;
  provider?: string;
  current_page?: number;
  page_size?: number;
};

export type CreateTrainingInput = {
  training_title: string;
  date_completed?: string | null;
  training_provider?: string | null;
  proof_of_completion?: File | null;
};

export type UpdateTrainingInput = {
  training_title?: string;
  date_completed?: string | null;
  training_provider?: string | null;
  proof_of_completion?: File | null;
  clear_file?: boolean; // if true, appends clear_file=1 to query
};
