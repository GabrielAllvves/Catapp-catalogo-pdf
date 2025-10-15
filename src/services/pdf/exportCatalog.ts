import { Catalog } from '@types/catalog';
import {
  PDFDocument,
  rgb,
  StandardFonts,
  PDFPage,
  PDFFont,
  PDFImage
} from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { uint8ArrayToBase64 } from '@utils/base64';
import Jimp from 'jimp-compact';
import { processImage } from '@utils/processImage';

export interface ExportOptions {
  share?: boolean;
}

interface EmbeddedProductImage {
  image: PDFImage;
  width: number;
  height: number;
}

const drawHeader = (page: PDFPage, catalog: Catalog, font: PDFFont, logo?: PDFImage | null) => {
  const { height } = page.getSize();
  const marginLeft = 40;
  const defaultTop = height - 140;
  let contentStartY = defaultTop;
  let textX = marginLeft;

  if (logo) {
    const logoDimensions = logo.scaleToFit(80, 80);
    const logoY = height - 40 - logoDimensions.height;
    page.drawImage(logo, {
      x: marginLeft,
      y: logoY,
      width: logoDimensions.width,
      height: logoDimensions.height
    });

    textX = marginLeft + logoDimensions.width + 24;
    contentStartY = Math.min(contentStartY, logoY - 20);
  }

  page.drawText(catalog.name, {
    x: textX,
    y: height - 60,
    size: 28,
    font,
    color: rgb(0.063, 0.537, 0.929)
  });

  page.drawText(`Total de produtos: ${catalog.products.length}`, {
    x: textX,
    y: height - 100,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2)
  });

  return contentStartY;
};

const embedImage = async (
  pdfDoc: PDFDocument,
  uri?: string
): Promise<{ image: PDFImage; width: number; height: number } | null> => {
  if (!uri) {
    return null;
  }

  const processed = await processImage(uri);

  if (!processed) {
    return null;
  }

  try {
    const pngBuffer = await processed.getBufferAsync(Jimp.MIME_PNG);
    const pngBytes = pngBuffer instanceof Uint8Array ? pngBuffer : Uint8Array.from(pngBuffer);
    const embedded = await pdfDoc.embedPng(pngBytes);
    const dimensions = embedded.scaleToFit(80, 80);

    return {
      image: embedded,
      width: dimensions.width,
      height: dimensions.height
    };
  } catch (error) {
    console.error('❌ Não foi possível incorporar a imagem no PDF:', error);
    return null;
  }
};

export const exportCatalogToPdf = async (catalog: Catalog, options: ExportOptions = {}): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const logoImage = await embedImage(pdfDoc, catalog.logoUri);
  const productImages = await Promise.all(
    catalog.products.map(async (product) => {
      const embedded = await embedImage(pdfDoc, product.imageUri);
      return [product.id, embedded] as const;
    })
  );
  const productImageMap = new Map<string, EmbeddedProductImage | null>(productImages);

  let page = pdfDoc.addPage();
  let cursorY = drawHeader(page, catalog, font, logoImage?.image ?? null);

  catalog.products.forEach((product, index) => {
    const embeddedImage = productImageMap.get(product.id) ?? null;
    const blockHeight = embeddedImage ? Math.max(embeddedImage.height + 40, 90) : 70;

    if (cursorY - blockHeight < 80) {
      page = pdfDoc.addPage();
      cursorY = drawHeader(page, catalog, font, logoImage?.image ?? null);
    }

    let textX = 40;

    if (embeddedImage) {
      const imageY = cursorY - embeddedImage.height + 18;
      page.drawImage(embeddedImage.image, {
        x: 40,
        y: imageY,
        width: embeddedImage.width,
        height: embeddedImage.height
      });
      textX += embeddedImage.width + 24;
    }

    page.drawText(`${index + 1}. ${product.name}`, {
      x: textX,
      y: cursorY,
      size: 16,
      font,
      color: rgb(0.063, 0.537, 0.929)
    });

    page.drawText(`Preço: R$ ${product.promotionalPrice ?? product.price}`, {
      x: textX,
      y: cursorY - 18,
      size: 12,
      font,
      color: rgb(0.2, 0.2, 0.2)
    });

    if (product.description) {
      page.drawText(product.description, {
        x: textX,
        y: cursorY - 36,
        size: 10,
        font,
        color: rgb(0.35, 0.35, 0.35)
      });
    }

    cursorY -= blockHeight;
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
