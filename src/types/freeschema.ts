export interface FilterSearch {
  type: string;
  search: string;
  logicoperator: string;
  name: string;
  operateon: string;
  composition: boolean;
}

export interface FreeschemaQuery {
  type?: string;
  typeConnection?: string;
  name: string;
  freeschemaQueries?: FreeschemaQuery[];
  selectors?: string[];
  outputFormat?: string;
  inpage?: number;
  filterLogic?: string;
  filters?: FilterSearch[];
}

export const NORMAL = 'NORMAL';