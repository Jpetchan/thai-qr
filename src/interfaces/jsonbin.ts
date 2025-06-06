export interface JsonBinResponse {
  record: {
    counter: number;
  };
  metadata: {
    id: string;
    private: boolean;
  };
}

export interface JsonBinData {
  counter: number;
}
