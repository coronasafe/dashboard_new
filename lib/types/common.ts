export interface District {
  id: number;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

export type ExportData = {
  data: any[];
  filename: string;
};
