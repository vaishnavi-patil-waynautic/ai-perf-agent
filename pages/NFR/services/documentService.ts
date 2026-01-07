export const uploadDocuments = async (files: File[]): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mocking successful upload returning filenames
      resolve(files.map(f => f.name));
    }, 1000);
  });
};