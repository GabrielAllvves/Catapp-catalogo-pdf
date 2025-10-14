import * as SQLite from 'expo-sqlite';
import { Catalog, CatalogProduct, CatalogColorPalette } from '@types/catalog';

const DATABASE_NAME = 'catapp.db';

let database: SQLite.SQLiteDatabase | undefined;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!database) {
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await database.execAsync('PRAGMA foreign_keys = ON;');
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS catalogs (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        logoUri TEXT,
        colors TEXT NOT NULL,
        products TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
  }
  return database;
};

export const loadCatalogsFromDb = async (): Promise<Catalog[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<{
    id: string;
    name: string;
    logoUri: string | null;
    colors: string;
    products: string;
    createdAt: string;
    updatedAt: string;
  }>('SELECT * FROM catalogs ORDER BY datetime(updatedAt) DESC');

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    logoUri: row.logoUri ?? undefined,
    colors: JSON.parse(row.colors) as CatalogColorPalette,
    products: JSON.parse(row.products) as CatalogProduct[],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }));
};

export const persistCatalog = async (catalog: Catalog): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `REPLACE INTO catalogs (id, name, logoUri, colors, products, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    catalog.id,
    catalog.name,
    catalog.logoUri ?? null,
    JSON.stringify(catalog.colors),
    JSON.stringify(catalog.products),
    catalog.createdAt,
    catalog.updatedAt
  );
};

export const removeCatalog = async (catalogId: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM catalogs WHERE id = ?;', catalogId);
};
