export type CatalogColorPalette = [string, string?, string?];

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  promotionalPrice?: number;
  description?: string;
  imageUri?: string;
}

export interface Catalog {
  id: string;
  name: string;
  logoUri?: string;
  colors: CatalogColorPalette;
  products: CatalogProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogSummary extends Pick<Catalog, 'id' | 'name' | 'createdAt' | 'logoUri' | 'colors'> {
  productsCount: number;
}

export interface CatalogState {
  catalogs: Catalog[];
  isLoaded: boolean;
}

export type CatalogAction =
  | { type: 'SET_CATALOGS'; payload: Catalog[] }
  | { type: 'ADD_CATALOG'; payload: Catalog }
  | { type: 'UPDATE_CATALOG'; payload: Catalog }
  | { type: 'DELETE_CATALOG'; payload: { id: string } };
