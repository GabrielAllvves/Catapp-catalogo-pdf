import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { Catalog, CatalogAction, CatalogState } from '@types/catalog';
import { catalogReducer, initialCatalogState } from '@utils/catalogReducer';
import { generateCatalogId } from '@utils/ids';
import { loadCatalogsFromDb, persistCatalog, removeCatalog } from '@utils/database';

interface CatalogContextValue extends CatalogState {
  addCatalog: (catalog: Omit<Catalog, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCatalog: (catalog: Catalog) => void;
  deleteCatalog: (id: string) => void;
  refreshCatalogs: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export const CatalogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<CatalogState, CatalogAction>>(catalogReducer, initialCatalogState);

  const refreshCatalogs = useCallback(async () => {
    try {
      const catalogsFromDb = await loadCatalogsFromDb();
      dispatch({ type: 'SET_CATALOGS', payload: catalogsFromDb });
    } catch (error) {
      console.error('Erro ao carregar catálogos do banco local', error);
    }
  }, []);

  useEffect(() => {
    void refreshCatalogs();
  }, [refreshCatalogs]);

  const value = useMemo<CatalogContextValue>(() => ({
    catalogs: state.catalogs,
    isLoaded: state.isLoaded,
    refreshCatalogs,
    addCatalog: (catalogInput) => {
      const timestamp = new Date().toISOString();
      const catalog: Catalog = {
        ...catalogInput,
        id: generateCatalogId(),
        createdAt: timestamp,
        updatedAt: timestamp
      };
      dispatch({ type: 'ADD_CATALOG', payload: catalog });
      void persistCatalog(catalog).catch((error) => console.error('Erro ao salvar catálogo', error));
      return catalog.id;
    },
    updateCatalog: (catalog) => {
      const updatedCatalog: Catalog = {
        ...catalog,
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'UPDATE_CATALOG', payload: updatedCatalog });
      void persistCatalog(updatedCatalog).catch((error) => console.error('Erro ao atualizar catálogo', error));
    },
    deleteCatalog: (id) => {
      dispatch({ type: 'DELETE_CATALOG', payload: { id } });
      void removeCatalog(id).catch((error) => console.error('Erro ao excluir catálogo', error));
    }
  }), [state.catalogs, state.isLoaded, refreshCatalogs]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalogs = (): CatalogContextValue => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalogs must be used within a CatalogProvider');
  }

  return context;
};
