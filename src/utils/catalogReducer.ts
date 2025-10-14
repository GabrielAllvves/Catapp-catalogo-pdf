import { CatalogAction, CatalogState } from '@types/catalog';

export const initialCatalogState: CatalogState = {
  catalogs: [],
  isLoaded: false
};

export const catalogReducer = (state: CatalogState, action: CatalogAction): CatalogState => {
  switch (action.type) {
    case 'SET_CATALOGS':
      return {
        ...state,
        catalogs: action.payload,
        isLoaded: true
      };
    case 'ADD_CATALOG':
      return {
        ...state,
        catalogs: [action.payload, ...state.catalogs]
      };
    case 'UPDATE_CATALOG':
      return {
        ...state,
        catalogs: state.catalogs.map((catalog) =>
          catalog.id === action.payload.id ? action.payload : catalog
        )
      };
    case 'DELETE_CATALOG':
      return {
        ...state,
        catalogs: state.catalogs.filter((catalog) => catalog.id !== action.payload.id)
      };
    default:
      return state;
  }
};
