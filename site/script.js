document.addEventListener('DOMContentLoaded', function(){
  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if(yearSpan){
    yearSpan.textContent = new Date().getFullYear();
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.length>1 && document.querySelector(href)){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth'});
        const nav = document.querySelector('.topnav');
        const toggle = document.querySelector('.nav-toggle');
        if(nav && toggle && nav.classList.contains('topnav--open')){
          nav.classList.remove('topnav--open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  const navToggle = document.querySelector('.nav-toggle');
  const topnav = document.querySelector('.topnav');
  if(navToggle && topnav){
    navToggle.addEventListener('click', () => {
      const isOpen = topnav.classList.toggle('topnav--open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Lineup cards clickable
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', function(e){
      // allow clicks on internal links to work normally
      if(e.target.closest('a')) return;
      const href = this.dataset.href;
      if(href) window.location.href = href;
    });
  });

  // Reviews carousel (simple scroll by card width)
  const track = document.querySelector('.reviews-track');
  const prev = document.querySelector('.rev-prev');
  const next = document.querySelector('.rev-next');
  
  if(track && prev && next){
    const cardWidth = 340 + 16; // card width + gap
    
    prev.addEventListener('click', ()=>{
      track.scrollBy({left: -cardWidth, behavior: 'smooth'});
    });
    
    next.addEventListener('click', ()=>{
      track.scrollBy({left: cardWidth, behavior: 'smooth'});
    });
    
    // Keyboard navigation for carousel
    track.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){
        track.scrollBy({left: -cardWidth, behavior: 'smooth'});
      } else if(e.key === 'ArrowRight'){
        track.scrollBy({left: cardWidth, behavior: 'smooth'});
      }
    });
  }

  // Booking form
  const form = document.getElementById('booking-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name')?.trim();
      const phone = data.get('phone')?.trim();
      
      if(!name || !phone){
        alert('Пожалуйста, заполните имя и телефон.');
        return;
      }
      
      // TODO: replace with real submit (AJAX) or backend integration
      alert('Спасибо, ' + name + '! Мы свяжемся с вами по номеру ' + phone + ' в ближайшее время.');
      form.reset();
    });
  }

  // Gallery lightbox
  const galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
  
  if(galleryImages.length > 0) {
    let currentImageIndex = 0;
    
    // Create lightbox elements once
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    // Basic styles are inline for simplicity, but better in CSS
    lightbox.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:2000; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease;';
    
    const imgElement = document.createElement('img');
    imgElement.style.cssText = 'max-width:90%; max-height:85vh; border-radius:4px; box-shadow:0 0 20px rgba(0,0,0,0.5); object-fit:contain;';
    
    // Buttons
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&#10094;'; // Left arrow
    prevBtn.className = 'lightbox-btn lightbox-prev';
    prevBtn.ariaLabel = "Предыдущее фото";
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&#10095;'; // Right arrow
    nextBtn.className = 'lightbox-btn lightbox-next';
    nextBtn.ariaLabel = "Следующее фото";

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'lightbox-btn lightbox-close';
    closeBtn.ariaLabel = "Закрыть";

    // Style the buttons
    const btnStyle = 'position:absolute; background:transparent; border:none; color:white; font-size:3rem; cursor:pointer; padding:0 20px; transition:color 0.2s; user-select:none; z-index:2001;';
    prevBtn.style.cssText = btnStyle + 'left:10px; top:50%; transform:translateY(-50%);';
    nextBtn.style.cssText = btnStyle + 'right:10px; top:50%; transform:translateY(-50%);';
    closeBtn.style.cssText = btnStyle + 'top:20px; right:20px; font-size:4rem; line-height:0.5;';
    
    // Hover effects via JS since inline styles are tricky for pseudo-classes
    [prevBtn, nextBtn, closeBtn].forEach(btn => {
      btn.addEventListener('mouseenter', () => btn.style.color = 'var(--accent, #c49a6c)');
      btn.addEventListener('mouseleave', () => btn.style.color = 'white');
    });

    lightbox.appendChild(imgElement);
    lightbox.appendChild(prevBtn);
    lightbox.appendChild(nextBtn);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    const showImage = (index) => {
      currentImageIndex = index;
      imgElement.src = galleryImages[currentImageIndex].src;
    };
    
    const openLightbox = (index) => {
      showImage(index);
      lightbox.style.display = 'flex';
      // simple fade in
      requestAnimationFrame(() => lightbox.style.opacity = '1');
      document.body.style.overflow = 'hidden'; // prevent scrolling background
    };
    
    const closeLightbox = () => {
      lightbox.style.opacity = '0';
      setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    };
    
    const nextImage = (e) => {
      if(e) e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      showImage(currentImageIndex);
    };
    
    const prevImage = (e) => {
      if(e) e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      showImage(currentImageIndex);
    };
    
    // Event Listeners
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
      img.style.cursor = 'pointer';
    });
    
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
    
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if(e.target === lightbox || e.target === imgElement) {
        closeLightbox();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    });
  }

  // Navbar scroll effect
  const nav = document.querySelector('.topnav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if(currentScroll > 100){
      nav.style.background = 'rgba(7,7,8,0.95)';
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      nav.style.background = 'rgba(7,7,8,0.85)';
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
});

