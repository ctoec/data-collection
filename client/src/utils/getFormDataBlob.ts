export const BOUNDARY = '------bbbbbbbbb';

export const getFormDataBlob = (file: File) => {
  const blobParts = [];
  blobParts.push(
    `--${BOUNDARY}\r\n`,
    `Content-Disposition: form-data; name="file"; filename="${file.name}"\r\n` +
      `Content-Type: ${file.type}\r\n\r\n`,
    file,
    '\r\n',
    `--${BOUNDARY}--`
  );

  return new Blob(blobParts, {
    type: `multipart/form-data; boundary=${BOUNDARY}`,
  });
};
