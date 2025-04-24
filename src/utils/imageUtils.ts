
export const createFaviconFromLogo = (logoUrl: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject("Não foi possível obter o contexto 2D do canvas");
      return;
    }
    
    canvas.width = 48;
    canvas.height = 48;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 48, 48);
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      reject("Erro ao carregar a imagem do logo");
    };
    
    img.src = logoUrl;
  });
};
