/**
 * NETFLIX - NOSSA HISTÓRIA DE AMOR
 * Lógica Completa de Navegação, Áudio, Animações e Slideshow
 */

// ==========================================================
// 1. DADOS DOS CAPÍTULOS / SLIDES
// ==========================================================
const STORY_SLIDES = [
  {
    badge: "13/03/2021 • O Despertar",
    title: "13 de Março de 2021: O dia em que minha vida mudou",
    text: "No dia 13/03/2021, quando ficamos pela primeira vez, algo inexplicável se abriu dentro do meu peito. Eu nunca tinha sentido nada parecido em toda a minha existência: foi uma onda imediata de alívio, uma sensação de paz absoluta e, ao mesmo tempo, uma força e um poder inexplicáveis que tomaram conta de mim. Foi o momento exato em que a minha alma reconheceu a sua e percebeu que nunca mais estaria sozinha.",
    image: "assets/images/foto-perfil.jpg"
  },
  {
    badge: "Munsungrando & Munsungranda",
    title: "O Nosso Mundinho e Cumplicidade Única",
    text: "Tudo entre a gente simplesmente bateu desde o início. As nossas piadas que ninguém mais no mundo entende, as nossas brincadeiras doidinhas e manias que são só nossas. Criamos um refúgio seguro onde posso ser 100% eu mesmo ao seu lado. Você é a minha Munsungranda, a dona das minhas risadas mais sinceras e o motivo de eu sorrir à toa só de lembrar do seu jeito.",
    image: "assets/images/foto-brincadeiras.jpg"
  },
  {
    badge: "Primeiro Amor • 5 Anos",
    title: "Meu primeiro amor, meu maior aprendizado",
    text: "Você é a minha primeira namorada, o meu primeiro e único grande amor. Sei que não sou perfeito e que muitas vezes deixei a desejar em atitudes, palavras ou momentos... Por ser tudo tão novo pra mim, te peço que continue tendo paciência comigo. A verdade mais pura é que estou aprendendo todos os dias com você o que significa amar de verdade. Você me transforma e me inspira a ser um homem melhor a cada amanhecer.",
    image: "assets/images/foto-amor.jpg"
  },
  {
    badge: "Inquebráveis • Juntando Caquinhos",
    title: "Recolhendo os caquinhos para sermos mais fortes",
    text: "Ao longo desses 5 anos, nós também tivemos dias difíceis. Nós já discutimos, brigamos e enfrentamos dias cinzentos. Mas o amor que sinto por você me ensinou a maior das lições: não importa o tamanho da tempestade, ao final do dia nós sempre sentamos juntos, recolhemos cada caquinho que se partiu e nos reconstruímos ainda mais fortes e inabaláveis. O nosso amor tem raiz funda, não se abala com qualquer vento.",
    image: "assets/images/foto-capa.jpg"
  },
  {
    badge: "★ Nosso Lar • Meu Anjo",
    title: "A nossa casa: O início do resto das nossas vidas",
    text: "A nossa casa. A nossa primeira noite nela, o colchão no chão e uma pizza dividida com os olhos brilhando e o coração explodindo de orgulho. Essa foto guarda o início de tudo o que sonhamos e estamos construindo tijolo por tijolo. Naquele momento, tive a certeza mais linda do mundo: casa nunca foram quatro paredes de tijolo... a minha casa sempre foi o seu abraço. Você é o meu anjo, minha paz, meu refúgio e o amor da minha vida. Eu te amo pra sempre.",
    image: "assets/images/meuanjo.jpeg"
  }
];

// ==========================================================
// 2. ESTADO DA APLICAÇÃO
// ==========================================================
let currentSlideIndex = 0;
let isPlaying = true;
let slideTimer = null;
let audioContext = null;
const SLIDE_DURATION_MS = 11000; // 11 segundos por foto para leitura confortável

// Elementos do DOM
const screenProfile = document.getElementById('screen-profile');
const screenIntro = document.getElementById('screen-intro');
const screenHome = document.getElementById('screen-home');
const screenPlayer = document.getElementById('screen-player');

const btnProfileAmor = document.getElementById('btn-profile-amor');
const btnPlayHero = document.getElementById('btn-play-hero');
const btnInfoHero = document.getElementById('btn-info-hero');
const btnMusicToggle = document.getElementById('btn-music-toggle');
const btnFooterHeart = document.getElementById('btn-footer-heart');

const btnPlayerBack = document.getElementById('btn-player-back');
const btnSlidePrev = document.getElementById('btn-slide-prev');
const btnSlideNext = document.getElementById('btn-slide-next');
const btnSlidePlayPause = document.getElementById('btn-slide-playpause');
const btnSendHeart = document.getElementById('btn-send-heart');
const btnPlayerSound = document.getElementById('btn-player-sound');

const playerCurrentImg = document.getElementById('player-current-img');
const slideBadge = document.getElementById('slide-badge');
const slideTitle = document.getElementById('slide-title');
const slideText = document.getElementById('slide-text');
const playerIndicator = document.getElementById('player-indicator');
const timelineProgress = document.getElementById('timeline-progress');
const playerTimer = document.getElementById('player-timer');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');

const modalInfo = document.getElementById('modal-info');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnModalWatch = document.getElementById('btn-modal-watch');
const navOpenModal = document.getElementById('nav-open-modal');
const navBtnHistoria = document.getElementById('nav-btn-historia');
const navBtnMomentos = document.getElementById('nav-btn-momentos');

const bgMusic = document.getElementById('bg-music');
const heartsContainer = document.getElementById('hearts-container');

const slideFinaleActions = document.getElementById('slide-finale-actions');
const btnFinaleLetter = document.getElementById('btn-finale-letter');
const btnFinaleRestart = document.getElementById('btn-finale-restart');

const slideBottomSheet = document.getElementById('slide-bottom-sheet');
const sheetDragHandle = document.getElementById('sheet-drag-handle');
const sheetCloseBtn = document.getElementById('sheet-close-btn');

function expandSheet() {
  if (!slideBottomSheet) return;
  slideBottomSheet.classList.remove('collapsed');
  slideBottomSheet.classList.add('expanded');
}

function collapseSheet() {
  if (!slideBottomSheet) return;
  slideBottomSheet.classList.add('collapsed');
  slideBottomSheet.classList.remove('expanded');
}

function toggleSheet() {
  if (!slideBottomSheet) return;
  if (slideBottomSheet.classList.contains('expanded')) {
    collapseSheet();
  } else {
    expandSheet();
  }
}

// ==========================================================
// 3. SINTETIZADOR DO SOM "TUDUM" (WEB AUDIO API)
// 100% confiável, funciona offline e em qualquer celular
// ==========================================================
function playNetflixTudum() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;

    // Batida 1: Graves profundos cinematográficos (o impacto "TU")
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.6);

    gain1.gain.setValueAtTime(0.8, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.start(now);
    osc1.stop(now + 1.3);

    // Batida 2: O resplendor sonoro (o "DUM" expansivo)
    setTimeout(() => {
      if (!audioContext) return;
      const t = audioContext.currentTime;

      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(98, t);
      osc2.frequency.exponentialRampToValueAtTime(45, t + 1.6);

      // Filtro passa-baixo para calor analógico
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, t);
      filter.frequency.exponentialRampToValueAtTime(120, t + 1.5);

      gain2.gain.setValueAtTime(0.65, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(audioContext.destination);

      osc2.start(t);
      osc2.stop(t + 1.9);
    }, 180);

  } catch (err) {
    console.log("Audio synthesis error:", err);
  }
}

// ==========================================================
// 4. GERENCIAMENTO DE MÚSICA DE FUNDO (ONLY YOU)
// ==========================================================
function startBackgroundMusic() {
  if (bgMusic) {
    bgMusic.volume = 0.55;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay aguardando interação:", error);
      });
    }
  }
}

function pauseBackgroundMusic() {
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
  }
}

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play();
    spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 6);
  } else {
    bgMusic.pause();
  }
}

// ==========================================================
// 5. NAVEGAÇÃO ENTRE TELAS
// ==========================================================
function switchScreen(targetScreen) {
  [screenProfile, screenIntro, screenHome, screenPlayer].forEach(screen => {
    screen.classList.remove('active');
  });
  targetScreen.classList.add('active');
  window.scrollTo(0, 0);
}

// Ação 1: Clicar no Perfil ("Quem está assistindo?")
btnProfileAmor.addEventListener('click', () => {
  // Dispara TUDUM e desbloqueia o áudio mobile
  playNetflixTudum();
  
  // Mostra a tela da vinheta com o "N" animado
  switchScreen(screenIntro);

  // Após 2.7 segundos, vai para a Home da Netflix
  setTimeout(() => {
    switchScreen(screenHome);
    // Chuva suave de corações de boas-vindas
    spawnHeartBurst(window.innerWidth / 2, 180, 12);
  }, 2700);
});

// Ação 2: Clicar em "Assistir" no Banner Hero
btnPlayHero.addEventListener('click', () => {
  openPlayerAtSlide(0);
});

// Ação 3: Clicar em um dos cards de episódio
document.querySelectorAll('.episode-card').forEach(card => {
  card.addEventListener('click', () => {
    const slideIdx = parseInt(card.getAttribute('data-slide'), 10) || 0;
    openPlayerAtSlide(slideIdx);
  });
});

// Ação 4: Voltar do Player para o Catálogo
btnPlayerBack.addEventListener('click', () => {
  stopAutoSlide();
  switchScreen(screenHome);
});

// ==========================================================
// 6. PLAYER DE VÍDEO / SLIDESHOW
// ==========================================================
function openPlayerAtSlide(index) {
  currentSlideIndex = index;
  switchScreen(screenPlayer);
  startBackgroundMusic();
  renderSlide(currentSlideIndex);
  startAutoSlide();
}

function renderSlide(index) {
  if (index < 0 || index >= STORY_SLIDES.length) return;
  const slide = STORY_SLIDES[index];

  // Atualiza texto e imagem
  playerCurrentImg.classList.remove('active');
  
  setTimeout(() => {
    playerCurrentImg.src = slide.image;
    playerCurrentImg.alt = slide.title;
    playerCurrentImg.classList.add('active');
  }, 50);

  slideBadge.textContent = slide.badge;
  slideTitle.textContent = slide.title;
  slideText.textContent = slide.text;

  // Atualiza indicadores
  playerIndicator.textContent = `Episódio ${index + 1} de ${STORY_SLIDES.length}`;
  playerTimer.textContent = `0${index + 1}:00 / ∞ Para Sempre`;

  // Barra de progresso
  const percent = ((index + 1) / STORY_SLIDES.length) * 100;
  timelineProgress.style.width = `${percent}%`;

  // Sempre recolhe a gaveta no início do slide para a foto aparecer 100% limpa!
  collapseSheet();

  // Se for o último slide (o da casinha / meuanjo), exibe botões finais, abre a gaveta após 1.5s e celebra!
  if (index === STORY_SLIDES.length - 1) {
    if (slideFinaleActions) slideFinaleActions.style.display = 'flex';
    stopAutoSlide();
    setTimeout(() => {
      expandSheet();
      spawnHeartBurst(window.innerWidth / 2, window.innerHeight * 0.35, 30);
    }, 1200);
  } else {
    if (slideFinaleActions) slideFinaleActions.style.display = 'none';
  }
}

function nextSlide() {
  if (currentSlideIndex < STORY_SLIDES.length - 1) {
    currentSlideIndex++;
    renderSlide(currentSlideIndex);
  } else {
    // No último slide, permanece nele e exibe os botões de ação
    renderSlide(currentSlideIndex);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSlide(currentSlideIndex);
  }
}

function startAutoSlide() {
  stopAutoSlide();
  isPlaying = true;
  iconPlay.style.display = 'none';
  iconPause.style.display = 'block';

  slideTimer = setInterval(() => {
    nextSlide();
  }, SLIDE_DURATION_MS);
}

function stopAutoSlide() {
  if (slideTimer) {
    clearInterval(slideTimer);
    slideTimer = null;
  }
  isPlaying = false;
  iconPlay.style.display = 'block';
  iconPause.style.display = 'none';
}

function togglePlayPause() {
  if (isPlaying) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
}

// Controles do Player
btnSlideNext.addEventListener('click', () => {
  nextSlide();
  if (isPlaying) startAutoSlide(); // reinicia timer
});

btnSlidePrev.addEventListener('click', () => {
  prevSlide();
  if (isPlaying) startAutoSlide();
});

btnSlidePlayPause.addEventListener('click', togglePlayPause);
btnPlayerSound.addEventListener('click', toggleMusic);
btnMusicToggle.addEventListener('click', toggleMusic);

// Barra de progresso clicável
document.getElementById('player-timeline').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const newIndex = Math.floor(ratio * STORY_SLIDES.length);
  currentSlideIndex = Math.min(newIndex, STORY_SLIDES.length - 1);
  renderSlide(currentSlideIndex);
  if (isPlaying) startAutoSlide();
});

// Suporte a gestos Touch (Swipe esquerda/direita no celular)
let touchStartX = 0;
let touchEndX = 0;

screenPlayer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

screenPlayer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchStartX - touchEndX > swipeThreshold) {
    // Deslizar para a esquerda -> Próximo
    nextSlide();
    if (isPlaying) startAutoSlide();
  } else if (touchEndX - touchStartX > swipeThreshold) {
    // Deslizar para a direita -> Anterior
    prevSlide();
    if (isPlaying) startAutoSlide();
  }
}

// ==========================================================
// 7. MODAL DE INFORMAÇÕES (CARTA DE AMOR & SINOPSE)
// ==========================================================
function openModal() {
  modalInfo.classList.add('active');
}

function closeModal() {
  modalInfo.classList.remove('active');
}

btnInfoHero.addEventListener('click', openModal);
navOpenModal.addEventListener('click', openModal);
navBtnHistoria.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);

modalInfo.addEventListener('click', (e) => {
  if (e.target === modalInfo) closeModal();
});

btnModalWatch.addEventListener('click', () => {
  closeModal();
  openPlayerAtSlide(0);
});

navBtnMomentos.addEventListener('click', () => {
  const capitulosSection = document.getElementById('section-capitulos');
  if (capitulosSection) {
    capitulosSection.scrollIntoView({ behavior: 'smooth' });
  }
});

if (btnFinaleLetter) {
  btnFinaleLetter.addEventListener('click', openModal);
}
if (btnFinaleRestart) {
  btnFinaleRestart.addEventListener('click', () => {
    openPlayerAtSlide(0);
  });
}

// Interações da Gaveta Retrátil de Texto
if (sheetDragHandle) {
  sheetDragHandle.addEventListener('click', toggleSheet);
}

if (sheetCloseBtn) {
  sheetCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    collapseSheet();
  });
}

// Toque na foto alterna/recolhe a gaveta
if (playerCurrentImg) {
  playerCurrentImg.addEventListener('click', () => {
    if (slideBottomSheet && slideBottomSheet.classList.contains('expanded')) {
      collapseSheet();
    } else {
      toggleSheet();
    }
  });
}

// Gestos verticais na gaveta (arrastar para cima abre, para baixo fecha)
let sheetTouchStartY = 0;
let sheetTouchEndY = 0;

if (slideBottomSheet) {
  slideBottomSheet.addEventListener('touchstart', (e) => {
    sheetTouchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  slideBottomSheet.addEventListener('touchend', (e) => {
    sheetTouchEndY = e.changedTouches[0].screenY;
    const diffY = sheetTouchStartY - sheetTouchEndY;
    if (diffY > 35) {
      // Arrastou para cima -> expande
      expandSheet();
    } else if (diffY < -35) {
      // Arrastou para baixo -> recolhe
      collapseSheet();
    }
  }, { passive: true });
}

// ==========================================================
// 8. EFEITOS DE CORAÇÕES FLUTUANTES (INTERATIVIDADE)
// ==========================================================
function spawnHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = ['❤️', '💖', '💘', '✨', '🌹'][Math.floor(Math.random() * 5)];
  
  const offsetX = (Math.random() - 0.5) * 80;
  heart.style.left = `${Math.max(10, Math.min(window.innerWidth - 30, x + offsetX))}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${Math.floor(Math.random() * 16) + 20}px`;

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 3000);
}

function spawnHeartBurst(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      spawnHeart(x, y);
    }, i * 60);
  }
}

btnSendHeart.addEventListener('click', (e) => {
  const rect = btnSendHeart.getBoundingClientRect();
  spawnHeartBurst(rect.left + rect.width / 2, rect.top, 14);
});

btnFooterHeart.addEventListener('click', (e) => {
  const rect = btnFooterHeart.getBoundingClientRect();
  spawnHeartBurst(rect.left + rect.width / 2, rect.top, 18);
});

// Navbar background ao rolar a página
screenHome.addEventListener('scroll', () => {
  const navbar = document.querySelector('.netflix-navbar');
  if (screenHome.scrollTop > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
