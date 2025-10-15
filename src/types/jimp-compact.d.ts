declare module 'jimp-compact' {
  export default class Jimp {
    static MIME_PNG: string;
    static MIME_JPEG: string;
    static MIME_JPG: string;
    static MIME_BMP: string;
    static MIME_TIFF: string;
    static MIME_GIF: string;
    static read(data: { data: Uint8Array | ArrayBufferLike; mime: string }): Promise<Jimp>;

    getBufferAsync(mime: string): Promise<Uint8Array>;
  }
}
