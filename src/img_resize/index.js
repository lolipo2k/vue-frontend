export function generateThumbnails(imageObject) {
    return new Promise((resolve, reject) => {
        let urls = {};
        let sizes = {
            'small': 100,
            'medium': 250,
            'large': 640,
        }
        let i = 0;
        var binaryData = [];
        binaryData.push(imageObject);
        const base64 = URL.createObjectURL(new Blob(binaryData, { type: "application/image" }));
        const canvas = document.createElement('canvas');
        const img = document.createElement('img');
        img.onload = () => {
            for (let size in sizes) {
                i++;
                let thumbnailMaxWidth = sizes[size];
                let thumbnailMaxHeight = sizes[size];
                let width = img.width;
                let height = img.height;
                if (width < sizes['small'] && height < sizes['small']) {
                    reject(new Error('The image is too small try selecting a image larger than 100x100 pixels'))
                }
                // Если менее среднего, большого, то обрезаем на максимально возможное значение, что бы не увеличивать лишний раз
                if (width < sizes['medium'] && height < sizes['medium'] && size !== 'small') {
                    thumbnailMaxWidth = width;
                    thumbnailMaxHeight = height;
                    if (size === 'large') {
                        urls['large'] = urls[size] = new File([imageObject], 'picture.jpeg');
                        if (i === 3) {
                            resolve(urls, 'image');
                        }
                        return;
                    }
                } else {
                    if (width < sizes['large'] && height < sizes['large'] && size === 'large') {
                        thumbnailMaxWidth = width;
                        thumbnailMaxHeight = height;
                    }
                }
                let ctx, thumbnailScale, thumbnailWidth, thumbnailHeight;
                //Calculate the size of the thumbnail, to best fit within max/width (cropspadding)
                thumbnailScale = (img.width / img.height) > (thumbnailMaxWidth / thumbnailMaxHeight) ?
                    thumbnailMaxWidth / img.width :
                    thumbnailMaxHeight / img.height;
                thumbnailWidth = img.width * thumbnailScale;
                thumbnailHeight = img.height * thumbnailScale;
                // Устанавливаем размер canvas
                canvas.width = thumbnailWidth;
                canvas.height = thumbnailHeight;
                ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight);
                urls[size] = new File([dataURItoBlob(canvas.toDataURL('image/jpeg', 0.8))], 'picture.jpeg');
                if (i === 3) {
                    resolve(urls, 'image');
                }
            }
        }
        img.src = base64;
    })
}

export function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    let ia = new Uint8Array(ab);
    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], { type: mimeString });
}