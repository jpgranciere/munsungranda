/**
 * CARTA EM PERGAMINHO
 * Controle sutil de áudio e interação
 */

const btnAudio = document.getElementById('btn-audio');
const bgMusic = document.getElementById('bg-music');
const iconMusicOff = document.querySelector('.icon-music-off');
const iconMusicOn = document.querySelector('.icon-music-on');

let isPlaying = false;

if (btnAudio && bgMusic) {
  bgMusic.volume = 0.4;

  btnAudio.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      iconMusicOff.style.display = 'block';
      iconMusicOn.style.display = 'none';
      btnAudio.title = "Tocar música";
    } else {
      bgMusic.play().then(() => {
        isPlaying = true;
        iconMusicOff.style.display = 'none';
        iconMusicOn.style.display = 'block';
        btnAudio.title = "Pausar música";
      }).catch(err => {
        console.log("Áudio bloqueado pelo navegador:", err);
      });
    }
  });

  // Tenta iniciar a música ao primeiro toque em qualquer lugar da tela
  document.body.addEventListener('click', function unlockAudioOnce() {
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        iconMusicOff.style.display = 'none';
        iconMusicOn.style.display = 'block';
        btnAudio.title = "Pausar música";
      }).catch(() => {});
    }
    document.body.removeEventListener('click', unlockAudioOnce);
  }, { once: true });
}
