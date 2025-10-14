import { Catalog } from '@types/catalog';
import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { uint8ArrayToBase64 } from '@utils/base64';

export interface ExportOptions {
  share?: boolean;
}

const drawHeader = (page: PDFPage, catalog: Catalog, font: PDFFont) => {
  const { height } = page.getSize();
  page.drawText(catalog.name, {
    x: 40,
    y: height - 60,
    size: 28,
    font,
    color: rgb(0.063, 0.537, 0.929)
  });

  page.drawText(`Total de produtos: ${catalog.products.length}`, {
    x: 40,
    y: height - 100,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2)
  });
};

export const exportCatalogToPdf = async (catalog: Catalog, options: ExportOptions = {}): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let page = pdfDoc.addPage();
  drawHeader(page, catalog, font);
  let { height } = page.getSize();
  let cursorY = height - 140;

  catalog.products.forEach((product, index) => {
    const spacing = 70;
    if (cursorY < 120) {
      page = pdfDoc.addPage();
      drawHeader(page, catalog, font);
      ({ height } = page.getSize());
      cursorY = height - 140;
    }

    page.drawText(`${index + 1}. ${product.name}`, {
      x: 40,
      y: cursorY,
      size: 16,
      font,
      color: rgb(0.063, 0.537, 0.929)
    });

    page.drawText(`Preço: R$ ${product.promotionalPrice ?? product.price}`, {
      x: 40,
      y: cursorY - 18,
      size: 12,
      font,
      color: rgb(0.2, 0.2, 0.2)
    });

    if (product.description) {
      page.drawText(product.description, {
        x: 40,
        y: cursorY - 36,
        size: 10,
        font,
        color: rgb(0.35, 0.35, 0.35)
      });
    }

    cursorY -= spacing;
  });

  const pdfBytes = await pdfDoc.save();
  const base64 = uint8ArrayToBase64(pdfBytes);
  const fileUri = `${FileSystem.cacheDirectory ?? ''}catapp-${catalog.id}.pdf`;
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64
  });

  if (options.share && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(fileUri, {
      dialogTitle: `Exportar catálogo ${catalog.name}`
    });
  }

  return fileUri;
};
