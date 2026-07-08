// ----- script.js -----
(function() {
  // DOM elements
  const nameInput = document.getElementById('nameInput');
  const titleInput = document.getElementById('titleInput');
  const companyInput = document.getElementById('companyInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const locationInput = document.getElementById('locationInput');
  const bioInput = document.getElementById('bioInput');
  const imageUpload = document.getElementById('imageUpload');
  const githubInput = document.getElementById('githubInput');
  const linkedinInput = document.getElementById('linkedinInput');
  const twitterInput = document.getElementById('twitterInput');
  const websiteInput = document.getElementById('websiteInput');
  const instagramInput = document.getElementById('instagramInput');
  const youtubeInput = document.getElementById('youtubeInput');
  const templateBtns = document.querySelectorAll('.template-btn');
  const cardPreview = document.getElementById('cardPreview');
  const avatarPreview = document.getElementById('avatarPreview');
  const cardName = document.getElementById('cardName');
  const cardTitle = document.getElementById('cardTitle');
  const cardCompany = document.getElementById('cardCompany');
  const cardEmail = document.getElementById('cardEmail');
  const cardPhone = document.getElementById('cardPhone');
  const cardLocation = document.getElementById('cardLocation');
  const cardBio = document.getElementById('cardBio');
  const cardSocial = document.getElementById('cardSocial');
  const generateBtn = document.getElementById('generateBtn');
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');

  let currentTemplate = 'modern';
  let imageDataUrl = null;

  // ----- helper: render card -----
  function renderCard() {
    // name & title & company
    cardName.textContent = nameInput.value.trim() || 'Your name';
    cardTitle.textContent = titleInput.value.trim() || 'Your title';
    cardCompany.textContent = companyInput.value.trim() || '';

    // contact details
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const location = locationInput.value.trim();

    cardEmail.innerHTML = email ? `<i class="fas fa-envelope"></i> <span>${email}</span>` : '';
    cardPhone.innerHTML = phone ? `<i class="fas fa-phone"></i> <span>${phone}</span>` : '';
    cardLocation.innerHTML = location ? `<i class="fas fa-map-marker-alt"></i> <span>${location}</span>` : '';

    // bio
    cardBio.textContent = bioInput.value.trim() || '';

    // avatar
    if (imageDataUrl) {
      avatarPreview.style.backgroundImage = `url(${imageDataUrl})`;
      avatarPreview.style.backgroundSize = 'cover';
      avatarPreview.innerHTML = '';
      avatarPreview.classList.remove('card-avatar-placeholder');
    } else {
      avatarPreview.style.backgroundImage = 'none';
      avatarPreview.style.backgroundSize = 'auto';
      avatarPreview.innerHTML = '<i class="fas fa-user" style="font-size:2rem;"></i>';
      avatarPreview.classList.add('card-avatar-placeholder');
    }

    // social links
    const socials = [
      { icon: 'fab fa-github', url: githubInput.value.trim() },
      { icon: 'fab fa-linkedin', url: linkedinInput.value.trim() },
      { icon: 'fab fa-twitter', url: twitterInput.value.trim() },
      { icon: 'fas fa-globe', url: websiteInput.value.trim() },
      { icon: 'fab fa-instagram', url: instagramInput.value.trim() },
      { icon: 'fab fa-youtube', url: youtubeInput.value.trim() }
    ];
    cardSocial.innerHTML = '';
    let hasSocial = false;
    socials.forEach(s => {
      if (s.url) {
        hasSocial = true;
        const link = document.createElement('a');
        link.href = s.url.startsWith('http') ? s.url : 'https://' + s.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const icon = document.createElement('i');
        icon.className = s.icon;
        link.appendChild(icon);
        cardSocial.appendChild(link);
      }
    });
    if (!hasSocial) {
      cardSocial.innerHTML = '<span style="opacity:0.4; font-size:0.7rem;">no social links added</span>';
    }

    // template class
    cardPreview.className = '';
    cardPreview.classList.add('template-' + currentTemplate);
  }

  // ----- template switching -----
  templateBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      templateBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentTemplate = this.dataset.template;
      renderCard();
    });
  });

  // ----- image upload -----
  imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        imageDataUrl = ev.target.result;
        renderCard();
      };
      reader.readAsDataURL(file);
    } else {
      imageDataUrl = null;
      renderCard();
    }
  });

  // ----- live update on input change -----
  const allInputs = [
    nameInput, titleInput, companyInput, emailInput, phoneInput, 
    locationInput, bioInput, githubInput, linkedinInput, twitterInput,
    websiteInput, instagramInput, youtubeInput
  ];
  allInputs.forEach(input => {
    input.addEventListener('input', renderCard);
  });

  // ----- generate button (re-render) -----
  generateBtn.addEventListener('click', renderCard);

  // ----- download PNG (html2canvas) -----
  downloadPngBtn.addEventListener('click', function() {
    html2canvas(cardPreview, {
      scale: 1.8,
      backgroundColor: '#ffffff',
      allowTaint: false,
      useCORS: true
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'business-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => {
      alert('Error generating PNG: ' + err);
    });
  });

  // ----- download PDF (via canvas to PDF) -----
  downloadPdfBtn.addEventListener('click', function() {
    html2canvas(cardPreview, {
      scale: 2,
      backgroundColor: '#ffffff',
      allowTaint: false,
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        alert('jsPDF library not loaded. Please check internet connection.');
        return;
      }
      const pdf = new jsPDF('landscape', 'px', [canvas.width / 2, canvas.height / 2]);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('business-card.pdf');
    }).catch(err => {
      alert('Error generating PDF: ' + err);
    });
  });

  // ----- initial render -----
  renderCard();
})();