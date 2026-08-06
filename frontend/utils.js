// Make sure the TBF and Utils objects exist
window.TBF = window.TBF || {};
window.TBF.Utils = window.TBF.Utils || {};

// 👇 Attach the compressor directly to TBF.Utils
window.TBF.Utils.compressImage = async function(file, maxWidth = 1200, quality = 0.7) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas compression failed'));
                        return;
                    }
                    let newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg"; 
                    const compressedFile = new File([blob], newFileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
            img.onerror = () => reject('Image load failed');
        };
        reader.onerror = (error) => reject(error);
    });
};

// 👇 Saves a bookmark to the browser's memory
window.TBF.Utils.saveState = function(memoryKey, value) {
    localStorage.setItem(memoryKey, value);
};

// 👇 Reads a bookmark from the browser's memory
window.TBF.Utils.getState = function(memoryKey) {
    return localStorage.getItem(memoryKey);
};