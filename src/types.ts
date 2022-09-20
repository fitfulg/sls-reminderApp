export type AGWInput = {
  statusCode?: number;
  data: {};
  headers?: {};
};

export type DBQuery = {
  tableName: string;
  index: string;

  pkValue: string;
  pkKey?: string;

  skValue?: string;
  skKey?: string;

  sortAscending?: boolean;
};

export type Inputs = {
  email: string;
  phoneNumber: string;
  reminder: string;
  reminderDate: string;
};
