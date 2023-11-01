import React, { useEffect, useRef } from 'react';
import * as PDFJS from 'pdfjs-dist';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

const PDFViewer = ({ src }) => {
   const pdfContainer = useRef(null);

   useEffect(() => {
      const loadPdf = async () => {
         const pdfDoc = await PDFJS.getDocument(src).promise;
         const numPages = pdfDoc.numPages;

         for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const scale = 1.5; // You can adjust the scale as needed
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
               canvasContext: context,
               viewport: viewport,
            };

            const renderTask = page.render(renderContext);
            await renderTask.promise;

            // Append the canvas to the container
            pdfContainer.current.appendChild(canvas);
         }
      };

      loadPdf();
   }, [src]);

   return (
      <div
         ref={pdfContainer}
         style={{
            overflowY: 'auto', // Enable vertical scrolling
            height: '90vh', // Set the desired height
         }}
      />
   );
};

export default PDFViewer;
