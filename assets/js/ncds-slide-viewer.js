(function () {
  'use strict';
  const viewer = document.querySelector('[data-slide-pdf]');
  if (!viewer) return;
  const canvas = viewer.querySelector('canvas');
  const status = viewer.querySelector('.ncds-viewer-status');
  const previous = viewer.querySelector('[data-prev]');
  const next = viewer.querySelector('[data-next]');
  const count = viewer.querySelector('.ncds-page-count');
  const pdfjs = window.pdfjsLib;
  if (!pdfjs) {
    status.textContent = 'Preview unavailable in this browser. Please use the PDF download link below.';
    return;
  }
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  let documentPdf;
  let pageNumber = 1;
  let rendering = false;
  let queuedPage = null;
  let sizeTimer;

  function updateControls() {
    previous.disabled = !documentPdf || pageNumber <= 1;
    next.disabled = !documentPdf || pageNumber >= documentPdf.numPages;
    count.textContent = documentPdf ? `Slide ${pageNumber} of ${documentPdf.numPages}` : 'Loading slides';
  }

  async function render(number) {
    if (!documentPdf) return;
    if (rendering) { queuedPage = number; return; }
    rendering = true;
    try {
      const page = await documentPdf.getPage(number);
      const nativeViewport = page.getViewport({ scale: 1 });
      const parentWidth = viewer.querySelector('.ncds-viewer-screen').clientWidth;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const cssScale = parentWidth / nativeViewport.width;
      const viewport = page.getViewport({ scale: cssScale * pixelRatio });
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      canvas.style.width = `${Math.round(viewport.width / pixelRatio)}px`;
      canvas.style.height = `${Math.round(viewport.height / pixelRatio)}px`;
      const context = canvas.getContext('2d', { alpha: false });
      await page.render({canvasContext: context, viewport}).promise;
      pageNumber = number;
      canvas.style.display = 'block';
      canvas.setAttribute('aria-label', `Presentation slide ${number} of ${documentPdf.numPages}`);
      status.hidden = true;
      updateControls();
    } catch (error) {
      status.hidden = false;
      status.textContent = 'Unable to display this slide. Open the presentation PDF from the downloads below.';
    } finally {
      rendering = false;
      if (queuedPage != null) {
        const requested = queuedPage;
        queuedPage = null;
        if (requested !== pageNumber) render(requested);
      }
    }
  }

  function go(delta) {
    if (!documentPdf) return;
    const target = Math.max(1, Math.min(documentPdf.numPages, (queuedPage ?? pageNumber) + delta));
    if (target !== pageNumber) render(target);
  }

  previous.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
  });
  window.addEventListener('resize', () => {
    clearTimeout(sizeTimer);
    sizeTimer = setTimeout(() => { if (documentPdf) render(pageNumber); }, 160);
  });

  pdfjs.getDocument({ url: viewer.dataset.slidePdf }).promise.then((pdf) => {
    documentPdf = pdf;
    updateControls();
    render(1);
  }).catch(() => {
    status.textContent = 'The presentation preview could not be loaded. Use the PDF download link below.';
  });
})();
