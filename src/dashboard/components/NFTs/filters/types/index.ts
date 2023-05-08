export interface IDropdownOption {
  label: string;
  value: any;
}

export type IOptionValues = IDropdownOption[] | string[];

export interface IFilterOptions {
  trait: string;
  type?: string;
  values: IOptionValues;
}

export type IFilters = Set<any>;
export type ISelected = Map<string, IFilters>;
