// ==========================================================================
// SCROLL SENSITIVE HEADER
// ==========================================================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ==========================================================================
// MOBILE MENU NAVIGATION
// ==========================================================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMobileMenu() {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMobileMenu);

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Remove active class from all links and add to clicked
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Close mobile menu if active
    if (navMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('active') && 
      !navMenu.contains(e.target) && 
      !menuToggle.contains(e.target)) {
    toggleMobileMenu();
  }
});


// ==========================================================================
// SCROLL REVEAL (INTERSECTION OBSERVER)
// ==========================================================================
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Reveal once
    }
  });
};

const revealObserver = new IntersectionObserver(revealCallback, {
  root: null,
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
  revealObserver.observe(element);
});

// Trigger scroll check on load
window.addEventListener('load', () => {
  revealElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      element.classList.add('active');
    }
  });
});

// ==========================================================================
// SHIPMENT TRACKER SYSTEM
// ==========================================================================
const trackingDatabase = {
  'CDPS-77492-GH': {
    status: 'In Transit',
    origin: 'Port of Shanghai, CN',
    destination: 'Port of Tema, GH',
    milestones: [
      { title: 'Cargo Received & Manifested', time: 'June 08, 2026 - 09:30 AM', location: 'Shanghai Logistics Hub, CN', state: 'completed' },
      { title: 'Customs Cleared & Loaded', time: 'June 10, 2026 - 04:15 PM', location: 'Port of Shanghai Terminal 3', state: 'completed' },
      { title: 'In Transit (Atlantic East Route)', time: 'June 15, 2026 - 11:00 AM', location: 'Vessel: MV Tema Pioneer', state: 'active' },
      { title: 'Arrival & Customs Clearance', time: 'Expected: June 25, 2026', location: 'Port of Tema, Ghana', state: 'pending' }
    ]
  },
  'CDPS-10825-US': {
    status: 'Delivered',
    origin: 'Port of Houston, US',
    destination: 'Kumasi Depot, GH',
    milestones: [
      { title: 'Cargo Received & Manifested', time: 'May 28, 2026 - 10:00 AM', location: 'Houston Hub, US', state: 'completed' },
      { title: 'Loaded on Vessel', time: 'May 30, 2026 - 02:40 PM', location: 'Houston Terminal 1', state: 'completed' },
      { title: 'Arrived at Tema Port', time: 'June 12, 2026 - 07:15 AM', location: 'Port of Tema, GH', state: 'completed' },
      { title: 'Inland Haulage & Delivered', time: 'June 14, 2026 - 03:20 PM', location: 'Kumasi Depot, GH', state: 'completed' }
    ]
  },
  'CDPS-44391-EU': {
    status: 'Port Processing',
    origin: 'Port of Hamburg, DE',
    destination: 'Port of Tema, GH',
    milestones: [
      { title: 'Cargo Received & Manifested', time: 'June 11, 2026 - 08:00 AM', location: 'Hamburg Depot, DE', state: 'completed' },
      { title: 'Loaded on Vessel', time: 'June 13, 2026 - 11:20 AM', location: 'Hamburg Terminal 4', state: 'completed' },
      { title: 'Vessel Arrived & Unloading', time: 'June 16, 2026 - 10:45 AM', location: 'Port of Tema, GH', state: 'active' },
      { title: 'Customs Clearance & Release', time: 'Expected: June 18, 2026', location: 'Port of Tema, GH', state: 'pending' }
    ]
  }
};

const mainTrackInput = document.getElementById('mainTrackInput');
const trackBtn = document.getElementById('trackBtn');
const heroTrackForm = document.getElementById('heroTrackForm');
const heroTrackInput = document.getElementById('heroTrackInput');
const trackingResults = document.getElementById('trackingResults');
const summaryRef = document.getElementById('summaryRef');
const summaryStatus = document.getElementById('summaryStatus');
const summaryOrigin = document.getElementById('summaryOrigin');
const summaryDest = document.getElementById('summaryDest');
const timeline = document.getElementById('timeline');
const demoRefBtns = document.querySelectorAll('.demo-ref-btn');

// Trigger tracking updates
function updateTrackerUI(referenceCode) {
  const ref = referenceCode.trim().toUpperCase();
  let data = trackingDatabase[ref];
  
  // Dynamic fallback for any other input code
  if (!data) {
    data = {
      status: 'Manifest Created',
      origin: 'Sender Facility',
      destination: 'Port of Tema, GH',
      milestones: [
        { title: 'Shipping Label Created', time: 'June 16, 2026 - 02:30 PM', location: 'Digital Office Gateway', state: 'active' },
        { title: 'Cargo Arrival at Origin Terminal', time: 'Pending confirmation', location: 'Local Carrier Depot', state: 'pending' },
        { title: 'Export Customs Process', time: 'Awaiting container loading', location: 'Origin Departure Port', state: 'pending' }
      ]
    };
  }

  // Populate UI
  summaryRef.textContent = ref;
  summaryStatus.textContent = data.status;
  summaryOrigin.textContent = data.origin;
  summaryDest.textContent = data.destination;
  
  // Set status badge style
  summaryStatus.className = 'badge';
  if (data.status.toLowerCase().includes('transit')) {
    summaryStatus.classList.add('badge-success');
  } else if (data.status.toLowerCase().includes('delivered')) {
    summaryStatus.classList.add('badge-success');
  } else {
    summaryStatus.style.backgroundColor = 'rgba(245, 166, 35, 0.15)';
    summaryStatus.style.color = 'var(--color-accent-gold)';
    summaryStatus.style.border = '1px solid rgba(245, 166, 35, 0.3)';
  }

  // Draw Timeline
  timeline.innerHTML = '';
  data.milestones.forEach(m => {
    const item = document.createElement('div');
    item.className = `timeline-item ${m.state}`;
    
    let dotHtml = `<span class="marker-dot"></span>`;
    if (m.state === 'active') {
      dotHtml = `<span class="marker-dot animate-pulse"></span>`;
    }
    
    item.innerHTML = `
      <div class="timeline-marker">
        ${dotHtml}
      </div>
      <div class="timeline-content">
        <h4>${m.title}</h4>
        <p class="time">${m.time}</p>
        <p class="location">${m.location}</p>
      </div>
    `;
    timeline.appendChild(item);
  });
  
  trackingResults.classList.add('active');
}

// Track button click
trackBtn.addEventListener('click', () => {
  if (mainTrackInput.value) {
    updateTrackerUI(mainTrackInput.value);
  }
});

mainTrackInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    updateTrackerUI(mainTrackInput.value);
  }
});

// Demo references shortcut buttons
demoRefBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    mainTrackInput.value = btn.textContent;
    updateTrackerUI(btn.textContent);
  });
});

// Hero header quick tracker form
if (heroTrackForm) {
  heroTrackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = heroTrackInput.value;
    if (query) {
      mainTrackInput.value = query;
      updateTrackerUI(query);
      
      // Scroll to tracking section
      const targetSec = document.getElementById('tracking');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}


// ==========================================================================
// FREIGHT COST ESTIMATOR LOGIC
// ==========================================================================
const calcService = document.getElementById('calcService');
const calcRoute = document.getElementById('calcRoute');
const calcWeight = document.getElementById('calcWeight');
const calcVolume = document.getElementById('calcVolume');
const calcContainer = document.getElementById('calcContainer');
const btnCalculate = document.getElementById('btnCalculate');

const priceValue = document.getElementById('priceValue');
const resMode = document.getElementById('resMode');
const resRoute = document.getElementById('resRoute');
const resTime = document.getElementById('resTime');

function calculateEstimate() {
  const service = calcService.value;
  const route = calcRoute.value;
  const weight = parseFloat(calcWeight.value) || 0;
  const volume = parseFloat(calcVolume.value) || 0;
  const container = calcContainer.value;

  let basePrice = 0;
  let weightMultiplier = 0;
  let volumeMultiplier = 0;
  let transitTimeText = '15 - 20 Days';
  let modeName = 'Sea Freight';

  // Service configuration
  if (service === 'sea') {
    basePrice = 450;
    weightMultiplier = 0.12; // $0.12 per kg
    volumeMultiplier = 60;   // $60 per m3
    modeName = 'Sea Freight';
    transitTimeText = '22 - 30 Days';
  } else if (service === 'air') {
    basePrice = 250;
    weightMultiplier = 4.2;  // $4.2 per kg
    volumeMultiplier = 25;   // $25 per m3
    modeName = 'Air Freight';
    transitTimeText = '4 - 7 Days';
  } else if (service === 'haulage') {
    basePrice = 300;
    weightMultiplier = 0.25; // $0.25 per kg
    volumeMultiplier = 40;   // $40 per m3
    modeName = 'Heavy Haulage';
    transitTimeText = '2 - 5 Days';
  }

  // Route configurations
  let routePrice = 0;
  let routeName = 'Asia to Tema Port';
  if (route === 'asia-tema') {
    routePrice = 700;
    routeName = 'Asia to Tema Port';
    if (service === 'sea') transitTimeText = '25 - 35 Days';
  } else if (route === 'eu-tema') {
    routePrice = 450;
    routeName = 'Europe to Tema Port';
    if (service === 'sea') transitTimeText = '18 - 25 Days';
  } else if (route === 'tema-transit') {
    routePrice = 950;
    routeName = 'Tema Port to Transit Country';
    if (service === 'sea') {
      // Transit from Port inland is road haulage
      transitTimeText = '10 - 15 Days';
    } else if (service === 'haulage') {
      transitTimeText = '5 - 9 Days';
    }
  } else if (route === 'tema-local') {
    routePrice = 180;
    routeName = 'Tema to Local Destination';
    transitTimeText = '1 - 2 Days';
  }

  // Cargo sizing calculations
  let sizeCost = (weight * weightMultiplier) + (volume * volumeMultiplier);

  // Container configuration (Applies to Sea & Haulage only)
  if (service !== 'air') {
    if (container === '20ft') {
      sizeCost = 900; // Flat container pricing overrides package pricing
    } else if (container === '40ft') {
      sizeCost = 1650;
    }
  }

  // Update UI text (no numerical price calculation)
  priceValue.style.opacity = 0;
  setTimeout(() => {
    priceValue.textContent = "Quote Prepared";
    priceValue.style.opacity = 1;
  }, 200);

  resMode.textContent = modeName;
  resRoute.textContent = routeName;
  resTime.textContent = transitTimeText;
}

// Calculate on load and on click
if (btnCalculate) {
  btnCalculate.addEventListener('click', calculateEstimate);
}

// Email parameters button listener
const btnRequestQuoteMail = document.getElementById('btnRequestQuoteMail');
if (btnRequestQuoteMail) {
  btnRequestQuoteMail.addEventListener('click', (e) => {
    e.preventDefault();
    const serviceVal = calcService.value;
    const routeVal = calcRoute.value;
    const weightVal = calcWeight.value;
    const volumeVal = calcVolume.value;
    
    const modeName = calcService.options[calcService.selectedIndex].text;
    const routeName = calcRoute.options[calcRoute.selectedIndex].text;
    const containerName = calcContainer.options[calcContainer.selectedIndex].text;

    const subject = encodeURIComponent("Freight Quote Request - Cadaps Logistics");
    const body = encodeURIComponent(
      `Hello Cadaps Logistics,\n\n` +
      `I would like to request a formal quote based on the parameters I configured in the website estimator:\n\n` +
      `- Service Type: ${modeName}\n` +
      `- Transit Route: ${routeName}\n` +
      `- Cargo Weight: ${weightVal} kg\n` +
      `- Cargo Volume: ${volumeVal} m³\n` +
      `- Container Option: ${containerName}\n\n` +
      `Please contact me with the official rates and clearing timeline.\n\n` +
      `Best regards,`
    );
    
    window.location.href = `mailto:cadman@cadapslogistics.com?subject=${subject}&body=${body}`;
  });
}

// Enable inputs container toggle base on selected service
if (calcService) {
  calcService.addEventListener('change', () => {
    const service = calcService.value;
    if (service === 'air') {
      calcContainer.disabled = true;
      calcContainer.value = 'none';
    } else {
      calcContainer.disabled = false;
    }
  });
}

// ==========================================================================
// FORMS SUBMISSION MAILTO ROUTING
// ==========================================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    
    const subject = encodeURIComponent(`Cargo Clearing & Logistics Inquiry - ${name}`);
    const body = encodeURIComponent(
      `Hello Cadaps Logistics,\n\n` +
      `I have submitted an inquiry through the website contact form:\n\n` +
      `- Name/Company: ${name}\n` +
      `- Email Address: ${email}\n` +
      `- Phone Number: ${phone}\n\n` +
      `Message/Shipment Details:\n` +
      `${message}\n\n` +
      `Best regards,`
    );
    
    window.location.href = `mailto:cadman@cadapslogistics.com?subject=${subject}&body=${body}`;
    
    alert(`Thank you, ${name}! Your default email client will now open to send this inquiry directly to cadman@cadapslogistics.com.`);
    contactForm.reset();
  });
}
