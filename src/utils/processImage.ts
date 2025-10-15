import Jimp from 'jimp-compact';
import { Buffer } from 'buffer';

const EXTENSION_MIME_MAP: Record<string, string> = {
  png: Jimp.MIME_PNG,
  jpg: Jimp.MIME_JPEG,
  jpeg: Jimp.MIME_JPEG,
  bmp: Jimp.MIME_BMP,
  tif: Jimp.MIME_TIFF,
  tiff: Jimp.MIME_TIFF,
  gif: Jimp.MIME_GIF
};

const normalizeMime = (uri: string, headerMime: string | null): string => {
  if (headerMime) {
    if (headerMime.includes('png')) {
      return Jimp.MIME_PNG;
    }
    if (headerMime.includes('jpeg') || headerMime.includes('jpg')) {
      return Jimp.MIME_JPEG;
    }
    if (headerMime.includes('bmp')) {
      return Jimp.MIME_BMP;
    }
    if (headerMime.includes('gif')) {
      return Jimp.MIME_GIF;
    }
    if (headerMime.includes('tiff')) {
      return Jimp.MIME_TIFF;
    }
  }

  const cleanedUri = uri.split('?')[0] ?? '';
  const extension = cleanedUri.split('.').pop()?.toLowerCase();

  if (extension && EXTENSION_MIME_MAP[extension]) {
    return EXTENSION_MIME_MAP[extension];
  }

  return Jimp.MIME_PNG;
};

/**
 * Lê e processa uma imagem remota utilizando o Jimp em um ambiente compatível com Expo Web.
 * A função garante validações de URI, MIME e buffer, evitando erros "Buffer <null>".
 */
export async function processImage(uri: string): Promise<Jimp | null> {
  try {
    if (!uri) {
      console.error('❌ Nenhum URI fornecido para a imagem');
      return null;
    }

    const response = await fetch(uri);

    if (!response.ok) {
      console.error(`❌ Não foi possível buscar a imagem: ${response.status} ${response.statusText}`);
      return null;
    }

    let arrayBuffer: ArrayBuffer;
    if (typeof response.arrayBuffer === 'function') {
      arrayBuffer = await response.arrayBuffer();
    } else {
      const blob = await response.blob();
      arrayBuffer = await blob.arrayBuffer();
    }

    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length === 0) {
      console.error('❌ Buffer de imagem vazio!');
      return null;
    }

    const mime = normalizeMime(uri, response.headers.get('content-type'));
    const image = await Jimp.read({ data: buffer, mime });

    return image;
  } catch (error) {
    console.error('❌ Erro ao processar imagem:', error);
    return null;
  }
}
