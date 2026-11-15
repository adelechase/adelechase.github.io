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
    const transcript = viewer.querySelector('#ncds-slide-transcript-text');
    if (transcript) transcript.textContent = 'This browser cannot load the slide text. The accessible presentation download is available below.';
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

  // Descriptions of charts, diagrams, and other information supplied as images
  // in the original collaborative presentation. These supplement PDF text extraction.
  const imageDescriptions = {
  "5": "Pictogram showing the participant distribution in health sciences and STEM: 22% faculty, 28% graduate students, and 50% staff.",
  "6": "University of Michigan Library logo appears beneath the project objective.",
  "11": "Grouped horizontal bar chart comparing racial and ethnic composition of the United States, the University of Michigan, and the surveyed health-sciences and STEM participants. The surveyed group has a relatively large Asian, Native Hawaiian, or Pacific Islander share and a relatively small Black and Hispanic share; white participants constitute a majority.",
  "14": "Bar chart of respondents who often or always felt a sense of belonging, organized by racial or ethnic group. The overall average is about 60%. The multiracial group is highest, at about 78%; the MENA group is lowest, at about 35%. Other groups cluster roughly between 55% and 68%.",
  "15": "Bar chart of respondents who felt very safe. The average is about 77%. All displayed groups have majorities reporting feeling very safe; the multiracial group is highest at around 91%, and the MENA group is lowest at around 70%.",
  "16": "Bar chart of respondents who found the library very welcoming. The overall average is about 55%. White respondents are near 51%, Black respondents near 63%, Latinx respondents near 71%, and Native American respondents notably lower at roughly 17%. Some groups have very small sample sizes.",
  "17": "Bar chart of respondents saying the library was very respectful of diversity. The overall average is about 77%. White and Asian respondents are near 76%–78%, while Black respondents are around 62%. MENA and Native American respondents are near 50%.",
  "21": "Horizontal bar chart showing the share in each racial group saying that library collections always or almost always meet their needs. The average is about 47%. Responses range from roughly 36% among multiracial respondents to about 65% among Latinx respondents, with white respondents near 47%.",
  "22": "Horizontal bar chart showing shares choosing 'I don’t have enough information to answer' about the library collecting diverse materials. About 60% overall selected this response. The multiracial group is highest, near 73%; the MENA group is lowest, near 47%.",
  "23": "Horizontal bar chart of respondents who found materials by a diverse array of authors and creators. Approximately one-third overall reported this. White and Black groups are near 29%–30%; Asian and Latinx groups near 40%; Native American respondents around 43%.",
  "24": "Three-bar chart of average highest satisfaction ratings for eight research support services, including consultations, digital scholarship, research guides, funding information, research impact, Deep Blue, publishing, and data visualization. White, Asian, and Black respondent groups each cluster in the low-to-mid 40% range. Small sample sizes limit interpretation.",
  "25": "Three-bar chart showing average highest satisfaction ratings for six instruction support services. The white group is roughly 70%, Asian respondents roughly 56%, and Black respondents 100%; very small response counts make these comparisons unreliable.",
  "31": "Flow diagram from the 'Inclusion for All' framework. Diversity policies and practices can affirm marginalized group members' goals and motivation, potentially improving fit and belonging, while simultaneously threatening dominant group members' goals, potentially producing backlash and reducing fit and belonging. The effects depend on who feels included.",
  "32": "The same Inclusion for All framework with two elements highlighted: the need to account for dominant group members' goals and the option to minimize or avoid backlash and its negative consequences.",
  "36": "Two circular percentage graphics. The larger reports that 91.2% of health-sciences and STEM researchers who used library resources for seeking funding had published their work; a second smaller graphic displays 82.5%, without an explanatory caption in the graphic itself.",
  "40": "Two-bar chart for 670 respondents asked about using library services to seek funding: 69.1% answered Yes and 30.9% No.",
  "41": "Horizontal bar chart for 201 respondents who did not use library services to seek funding. About 53.2% used none of the other listed research services. The most common individual services were expert consultations, about 28.4%; online research guides, about 22.9%; and digital scholarship services, about 21.2%.",
  "49": "Table of frequency of interdisciplinary research among 445 filtered respondents. Two disciplines: 335 people (75.3%); three: 91 (20.4%); four: 15 (3.4%); five: 3 (0.7%); six: 1 (0.2%). Frequency decreases as the number of disciplines increases.",
  "50": "Two stacked bar charts compare involvement in reviewing literature and self-rated adequacy of that activity for researchers involved in two, three, and four-to-six disciplines. Most respondents report reviewing literature, and over 75% rate their competence adequate or better.",
  "51": "Grouped bar chart of background-information sources used by interdisciplinary researchers, grouped by number of disciplines. Scholarly literature open-access search engines are among the most frequently used resources, alongside general search engines, the U-M Library catalog, and scholarly databases. Counts fall substantially in groups involving more disciplines, which also have fewer respondents.",
  "52": "Two stacked bar charts compare whether respondents manage sources and citations and how adequate they feel at that activity, grouped by two, three, or four-to-six research disciplines. Most report managing citations; more than 75% rate their competence adequate or better.",
  "53": "Two stacked bar charts compare seeking funding and perceived competence, by number of disciplines. The share seeking funding is substantial but smaller than for literature review or citation management. Between half and three-quarters rate funding-seeking competence adequate or better.",
  "54": "Two stacked bar charts compare data gathering and perceived competence, by number of disciplines. Most respondents report gathering data. More than three-quarters rate their competence adequate or better.",
  "55": "Grouped bar chart of library research services used by respondents working across two, three, or four-to-six disciplines. Categories include digital scholarship, research guides, funding information, Deep Blue, publishing, and no services. The 'None' category is large, particularly for two-discipline respondents.",
  "56": "Grouped bar chart of reasons for not using library research services, by number of research disciplines. Lack of awareness of services and not seeking library help for work are the most frequently recorded reasons, particularly among respondents working in two disciplines."
};
  const transcript = viewer.querySelector('#ncds-slide-transcript-text');
  async function updateTranscript(page, number) {
    if (!transcript) return;
    const heading = document.createElement('h3');
    heading.textContent = 'Slide ' + number + ' of ' + documentPdf.numPages;
    const textParagraph = document.createElement('p');
    textParagraph.className = 'ncds-slide-source';
    const text = await page.getTextContent();
    const sourceText = text.items
      .map(item => (item.str || '') + (item.hasEOL ? '\\n' : ' '))
      .join('').replace(/ +/g, ' ').trim();
    textParagraph.textContent = sourceText || 'This slide contains no extractable text; see the image description below.';
    const nodes = [heading, textParagraph];
    const description = imageDescriptions[number];
    if (description) {
      const descriptionHeading = document.createElement('h4');
      descriptionHeading.textContent = 'Chart or image description';
      const descriptionParagraph = document.createElement('p');
      descriptionParagraph.textContent = description;
      nodes.push(descriptionHeading, descriptionParagraph);
    }
    transcript.replaceChildren(...nodes);
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
      await updateTranscript(page, number);
    } catch (error) {
      status.hidden = false;
      status.textContent = 'Unable to display this slide. Open the presentation PDF from the downloads below.';
      if (transcript) transcript.textContent = 'The accessible slide text is temporarily unavailable. Use the presentation PDF in the downloads below.';
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
