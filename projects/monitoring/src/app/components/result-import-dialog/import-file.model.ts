export interface ImportFile {
  file: File;
  echType: EchType;
}

export enum EchType {
  Ech0222 = 'eCH-0222',
  Ech0110 = 'eCH-0110',
}
