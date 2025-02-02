// PDF to Image Conversion
async function convertPdfToImage() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a PDF file');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const pdfData = new Uint8Array(e.target.result);
        
        try {
            const loadingTask = pdfjsLib.getDocument({data: pdfData});
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const scale = 1.5;
            const viewport = page.getViewport({scale});

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const image = canvas.toDataURL('image/png');
            const container = createPreviewContainer();
            fileInput.parentElement.appendChild(container);

            const previewImg = document.createElement('img');
            previewImg.src = image;
            previewImg.style.maxWidth = '100%';
            container.appendChild(previewImg);

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn btn-success mt-2';
            downloadBtn.innerHTML = 'Download Image';
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.download = 'converted-page.png';
                link.href = image;
                link.click();
            };
            container.appendChild(downloadBtn);

        } catch (error) {
            alert('Error converting PDF: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Image to PDF Conversion
function convertImageToPdf() {
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const container = createPreviewContainer();
                fileInput.parentElement.appendChild(container);

                const previewImg = document.createElement('img');
                previewImg.src = e.target.result;
                previewImg.style.maxWidth = '100%';
                container.appendChild(previewImg);

                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'btn btn-success mt-2';
                downloadBtn.innerHTML = 'Download PDF';
                downloadBtn.onclick = () => {
                    const pdf = new jspdf.jsPDF();
                    pdf.addImage(e.target.result, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                    pdf.save('converted-image.pdf');
                };
                container.appendChild(downloadBtn);

            } catch (error) {
                alert('Error converting image: ' + error.message);
            }
        };
    };
    reader.readAsDataURL(file);
}

// Image Compression
function compressImage() {
    const fileInput = document.getElementById('compressImage');
    const quality = document.getElementById('quality').value / 100;
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const compressedImage = canvas.toDataURL('image/jpeg', quality);
                const container = createPreviewContainer();
                fileInput.parentElement.appendChild(container);

                const previewImg = document.createElement('img');
                previewImg.src = compressedImage;
                previewImg.style.maxWidth = '100%';
                container.appendChild(previewImg);

                const sizeInfo = document.createElement('p');
                const originalSize = Math.round(file.size / 1024);
                const compressedSize = Math.round((compressedImage.length * 3/4) / 1024);
                sizeInfo.innerHTML = `Original size: ${originalSize}KB<br>Compressed size: ${compressedSize}KB<br>Compression ratio: ${Math.round((1 - compressedSize/originalSize) * 100)}%`;
                container.appendChild(sizeInfo);

                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'btn btn-success mt-2';
                downloadBtn.innerHTML = 'Download Compressed Image';
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = 'compressed-image.jpg';
                    link.href = compressedImage;
                    link.click();
                };
                container.appendChild(downloadBtn);

            } catch (error) {
                alert('Error compressing image: ' + error.message);
            }
        };
    };
    reader.readAsDataURL(file);
}

// Create preview container
function createPreviewContainer() {
    let container = document.getElementById('previewContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'previewContainer';
        container.className = 'mt-3';
        container.style.maxWidth = '100%';
        container.style.overflow = 'auto';
    } else {
        container.innerHTML = '';
    }
    return container;
}

// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function() {
    // Animate number counters
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the faster

    counters.forEach(counter => {
        const animate = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animate, 1);
            } else {
                counter.innerText = target;
            }
        };
        animate();
    });

    const navbar = document.querySelector('.modern-navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}); 