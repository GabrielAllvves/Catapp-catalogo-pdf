export const uint8ArrayToBase64 = (buffer: Uint8Array): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  const btoaFn = typeof globalThis.btoa === 'function' ? globalThis.btoa : undefined;

  if (btoaFn) {
    return btoaFn(binary);
  }

  const bufferConstructor = typeof globalThis !== 'undefined' ? (globalThis as any).Buffer : undefined;

  if (bufferConstructor) {
    return bufferConstructor.from(binary, 'binary').toString('base64');
  }

  throw new Error('Não foi possível converter o arquivo para base64.');
};
