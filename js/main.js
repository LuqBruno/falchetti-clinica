(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // revelação por seção
  const rv = [...document.querySelectorAll('.rv')];
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(e => e.classList.add('in'));
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(e => io.observe(e));
  }

  // linha do vale: uma parada aberta por vez
  const stops = [...document.querySelectorAll('.stop')];
  stops.forEach(s => {
    const btn = s.querySelector('.stop__btn');
    btn.addEventListener('click', () => {
      stops.forEach(o => {
        const on = o === s;
        o.classList.toggle('is-open', on);
        o.querySelector('.stop__btn').setAttribute('aria-expanded', String(on));
      });
    });
  });

  // quadro de necessidades: abas com setas do teclado
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.panel')];
  const select = i => {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, k) => {
      const on = k === i;
      p.hidden = !on;
      p.classList.toggle('is-on', on);
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      let j = -1;
      if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      else {
        const n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        j = (i + n + tabs.length) % tabs.length;
      }
      e.preventDefault();
      select(j); tabs[j].focus();
    });
  });

  // relevo: as serras sobem devagar com a rolagem (só sem movimento reduzido)
  const r3 = document.querySelector('.r3'), r2 = document.querySelector('.r2');
  if (!reduce && r3) {
    let raf = 0;
    addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(scrollY, 700);
        r3.style.transform = `translateY(${(y * 0.08).toFixed(1)}px)`;
        r2.style.transform = `translateY(${(y * 0.04).toFixed(1)}px)`;
      });
    }, { passive: true });
  }

  // CTA fixo no celular depois da primeira dobra
  const float = document.querySelector('[data-float]');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('#contato');
  const unidades = document.querySelector('#unidades');
  if (float && 'IntersectionObserver' in window) {
    let past = false, atC = false, atU = false;
    const upd = () => float.classList.toggle('show', past && !atC && !atU);
    new IntersectionObserver(([e]) => { past = !e.isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(([e]) => { atC = e.isIntersecting; upd(); }, { threshold: .2 }).observe(contact);
    new IntersectionObserver(([e]) => { atU = e.isIntersecting; upd(); }, { threshold: .4 }).observe(unidades);
  }
})();
