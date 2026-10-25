/**
 * 3D Career Journey Scroll-World Controller
 * Controls camera depth, cross-fades 3D scenes, and activates story milestones.
 */
(() => {
  const container = document.getElementById('journey-world');
  if (!container) return;

  const scenes = Array.from(document.querySelectorAll('.journey-world__scene'));
  const cards = Array.from(document.querySelectorAll('.journey-world__card'));
  const steps = Array.from(document.querySelectorAll('.journey-world__step'));

  let activeIndex = -1;

  function update() {
    const rect = container.getBoundingClientRect();
    const totalDist = container.offsetHeight - window.innerHeight;
    if (totalDist <= 0) return;

    // Progress 0.0 -> 1.0
    const progress = Math.max(0, Math.min(0.999, -rect.top / totalDist));
    
    // 4 stages: 0, 1, 2, 3
    const index = Math.floor(progress * scenes.length);

    if (index !== activeIndex) {
      activeIndex = index;

      scenes.forEach((s, i) => {
        if (i === activeIndex) {
          s.classList.add('is-active');
        } else {
          s.classList.remove('is-active');
        }
      });

      cards.forEach((c, i) => {
        if (i === activeIndex) {
          c.classList.add('is-active');
        } else {
          c.classList.remove('is-active');
        }
      });

      steps.forEach((st, i) => {
        if (i === activeIndex) {
          st.classList.add('is-active');
        } else {
          st.classList.remove('is-active');
        }
      });
    }

    // Micro-parallax on active scene
    const stageProgress = (progress * scenes.length) % 1;
    const activeScene = scenes[activeIndex];
    if (activeScene) {
      const zoom = 1 + stageProgress * 0.06;
      activeScene.style.transform = `scale(${zoom}) translateZ(${stageProgress * 20}px)`;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();
