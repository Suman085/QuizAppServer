export interface IQuestion {
  id: string;
  label: string;
  answerId: string;
  options: IOption[];
}

export interface IOption {
  label: string;
  id: string;
}
