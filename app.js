/* ========= УТИЛИТЫ ========= */
function mulberry32(a){ return function(){ let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; } }
function hashStringToInt(str){ let h=2166136261>>>0; for(let i=0;i<str.length;i++){h^=str.charCodeAt(i); h=Math.imul(h,16777619)} return h>>>0 }
function choice(rand, arr){ return arr[Math.floor(rand()*arr.length)] }
function HSL(h,s,l){ return `hsl(${h} ${s}% ${l}%)` }

/* ========= ДАННЫЕ ========= */
const QUOTES = [
  ["Город — это машина желаний.","Рем Колхас"],
  ["Лучший код — тот, который не пришлось писать.","Джефф Этвуд"],
  ["Случайность — имя Бога, когда Он не подписывается.","Анатоль Франс"],
  ["Мы — то, что мы делаем регулярно.","Аристотель"],
  ["Простота — высшая степень изощрённости.","Леонардо да Винчи"],
  ["Будущее уже здесь — оно просто неравномерно распределено.","Уильям Гибсон"],
  ["Искусство — это не зеркало, а молоток.","Бертольт Брехт"],
  ["Нет ничего более постоянного, чем временное.","Клиентская мудрость"],
  ["Архитектура начинается там, где кончается инженерия.","Вальтер Гропиус"],
  ["Дом должен быть центром мира для человека.","Фрэнк Ллойд Райт"],
  ["Форма следует за функцией.","Луис Салливан"],
  ["Город — это не проблема, а решение.","Джан Гелл"],
  ["Искусство смывает с души пыль повседневности.","Пабло Пикассо"],
  ["Наука — это организованное знание, мудрость — это организованная жизнь.","Иммануил Кант"],
  ["Мы не можем решать проблемы тем же способом мышления, которым создали их.","Альберт Эйнштейн"],
  ["Технология — это то, чего вы ещё не замечаете.","Кевин Келли"],
  ["Код — это поэзия.","Манифест WordPress"],
  ["Архитектура — это игра света и тени.","Ле Корбюзье"],
  ["Математика — царица наук.","Карл Гаусс"],
  ["Красота спасёт мир.","Фёдор Достоевский"],
  ["История учит нас, что история ничему не учит.","Гегель"],
  ["Хаос всегда побеждает порядок, потому что лучше организован.","Терри Пратчетт"],
  ["Сначала они тебя игнорируют, потом смеются над тобой, потом борются с тобой, а потом ты побеждаешь.","Махатма Ганди"],
  ["Если хочешь построить корабль, не зови людей собирать доски, а пробуди в них тоску по морю.","Антуан де Сент-Экзюпери"],
  ["Цель искусства — не воспроизводить видимое, а делать видимым.","Пауль Клее"],
  ["Музыка начинается там, где кончаются слова.","Генрих Гейне"],
  ["Тот, кто владеет информацией, владеет миром.","Уинстон Черчилль"],
  ["Архитектура — это застывшая музыка.","Иоганн Вольфганг Гёте"],
  ["Счастье — это когда то, что ты думаешь, говоришь и делаешь, находится в гармонии.","Махатма Ганди"],
  ["Свобода — осознанная необходимость.","Гегель"],
  ["Ни один план не переживает столкновения с реальностью.","Гельмут фон Мольтке"],
  ["Совершенство достигается не тогда, когда нечего добавить, а когда нечего убрать.","Антуан де Сент-Экзюпери"],
  ["Архитектура — это прежде всего искусство пространства.","Тадао Андо"],
  ["Цивилизация — это бесконечное движение к неизвестной цели.","Николай Бердяев"],
  ["Всё великое просто.","Лев Толстой"],
  ["Философия начинается с удивления.","Платон"]
];

/* ========= ПАЛИТРЫ ДЛЯ НЕБА ========= */
const SKY_PRESETS = {
  default(seedHue){
    // холодная ночь
    return {
      top:   HSL((seedHue+210)%360, 55, 10),
      mid:   HSL((seedHue+230)%360, 60, 16),
      bot:   HSL((seedHue+240)%360, 60, 12),
      starColor: 'rgba(255,255,255,',
      fogTop:  'rgba(140,180,240,0.25)'
    };
  },
  sunrise(seedHue){
    // неоновый рассвет
    return {
      top:   HSL((seedHue+320)%360, 65, 16),
      mid:   HSL((seedHue+10)%360, 75, 22),
      bot:   HSL((seedHue+45)%360, 75, 18),
      starColor: 'rgba(255,236,220,',
      fogTop:  'rgba(255,180,160,0.22)'
    };
  },
  mono(){
    return {
      top:   '#0a0a0a',
      mid:   '#111',
      bot:   '#0c0c0c',
      starColor: 'rgba(255,255,255,',
      fogTop:  'rgba(220,220,220,0.17)'
    };
  }
};

/* ========= ГЕНЕРАЦИЯ СЦЕНЫ ========= */
function generate(seedStr){
  const seed = hashStringToInt(seedStr);
  const rand = mulberry32(seed);
  const svg = document.getElementById('scene');
  svg.innerHTML = "";

  const appTheme = document.getElementById('app').getAttribute('data-theme');
  const hue = Math.floor(rand()*360);

  // ===== defs: небо, виньетка, glow
  const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");

  // палитра неба от темы
  const preset = (appTheme==='sunrise') ? SKY_PRESETS.sunrise(hue)
                 : (appTheme==='mono') ? SKY_PRESETS.mono(hue)
                 : SKY_PRESETS.default(hue);

  const grad = document.createElementNS("http://www.w3.org/2000/svg","linearGradient");
  grad.setAttribute("id","sky"); grad.setAttribute("x1","0"); grad.setAttribute("y1","0"); grad.setAttribute("x2","0"); grad.setAttribute("y2","1");
  const s1 = document.createElementNS("http://www.w3.org/2000/svg","stop"); s1.setAttribute("offset","0%");   s1.setAttribute("stop-color", preset.top);
  const s2 = document.createElementNS("http://www.w3.org/2000/svg","stop"); s2.setAttribute("offset","58%");  s2.setAttribute("stop-color", preset.mid);
  const s3 = document.createElementNS("http://www.w3.org/2000/svg","stop"); s3.setAttribute("offset","100%"); s3.setAttribute("stop-color", preset.bot);
  grad.appendChild(s1); grad.appendChild(s2); grad.appendChild(s3); defs.appendChild(grad);

  const filter = document.createElementNS("http://www.w3.org/2000/svg","filter");
  filter.setAttribute("id","glow");
  filter.innerHTML = `
    <feGaussianBlur stdDeviation="2" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  `;
  defs.appendChild(filter);
  svg.appendChild(defs);

  // ===== небо + лёгкая виньетка
  const sky = document.createElementNS("http://www.w3.org/2000/svg","rect");
  sky.setAttribute("width","1600"); sky.setAttribute("height","900"); sky.setAttribute("fill","url(#sky)");
  svg.appendChild(sky);

  const vignette = document.createElementNS("http://www.w3.org/2000/svg","rect");
  vignette.setAttribute("width","1600"); vignette.setAttribute("height","900");
  vignette.setAttribute("fill","url(#vignette)");
  // SVG-градиент для виньетки через mask
  const vignetteDefs = document.createElementNS("http://www.w3.org/2000/svg","radialGradient");
  vignetteDefs.setAttribute("id","vignette");
  vignetteDefs.setAttribute("cx","50%"); vignetteDefs.setAttribute("cy","35%"); vignetteDefs.setAttribute("r","70%");
  const vg1 = document.createElementNS("http://www.w3.org/2000/svg","stop"); vg1.setAttribute("offset","0%"); vg1.setAttribute("stop-color","rgba(0,0,0,0)");
  const vg2 = document.createElementNS("http://www.w3.org/2000/svg","stop"); vg2.setAttribute("offset","100%"); vg2.setAttribute("stop-color","rgba(0,0,0,0.25)");
  vignetteDefs.appendChild(vg1); vignetteDefs.appendChild(vg2); defs.appendChild(vignetteDefs);
  svg.appendChild(vignette);

  // ===== звёзды
  const stars = document.createElementNS("http://www.w3.org/2000/svg","g");
  const starCount = 220 + Math.floor(rand()*220);
  for(let i=0;i<starCount;i++){
    const cx = Math.floor(rand()*1600);
    const cy = Math.floor(rand()*560);
    const r  = rand()*1.2 + 0.2;
    const s  = document.createElementNS("http://www.w3.org/2000/svg","circle");
    s.setAttribute("cx",cx); s.setAttribute("cy",cy); s.setAttribute("r",r);
    s.setAttribute("fill", `${preset.starColor}${0.28 + rand()*0.6})`);
    stars.appendChild(s);
  }
  svg.appendChild(stars);

  // ===== вода/туман
  const water = document.createElementNS("http://www.w3.org/2000/svg","rect");
  water.setAttribute("x","0"); water.setAttribute("y","620"); water.setAttribute("width","1600"); water.setAttribute("height","280");
  water.setAttribute("fill", `rgba(10,20,40,0.6)`);
  svg.appendChild(water);

  // ===== мост (иногда)
  if(rand() > 0.45){
    const bridge = document.createElementNS("http://www.w3.org/2000/svg","g");
    const y = 558 + Math.floor(rand()*34);
    const bridgeLine = document.createElementNS("http://www.w3.org/2000/svg","rect");
    bridgeLine.setAttribute("x","-50"); bridgeLine.setAttribute("y",y); bridgeLine.setAttribute("width","1700"); bridgeLine.setAttribute("height","6");
    bridgeLine.setAttribute("fill","rgba(180,200,255,0.25)");
    bridge.appendChild(bridgeLine);
    const pillars = Math.floor(8 + rand()*6);
    for(let i=0;i<pillars;i++){
      const x = 60 + i*(150 + rand()*40);
      const p = document.createElementNS("http://www.w3.org/2000/svg","rect");
      p.setAttribute("x",x); p.setAttribute("y",y-80 - rand()*20); p.setAttribute("width","6"); p.setAttribute("height","80");
      p.setAttribute("fill","rgba(180,200,255,0.2)");
      bridge.appendChild(p);
    }
    svg.appendChild(bridge);
  }

  // ===== палитра неона от hue
  const neon = [
    HSL((hue+40)%360, 100, 70),
    HSL((hue+200)%360, 100, 70),
    HSL((hue+320)%360, 100, 75),
    HSL((hue+90)%360, 100, 68),
  ];

  // ===== дома
  const skyline = document.createElementNS("http://www.w3.org/2000/svg","g");
  const baseY = 660;
  const layers = 3;
  for(let L=0; L<layers; L++){
    const g = document.createElementNS("http://www.w3.org/2000/svg","g");
    const count = 16 + Math.floor(rand()*14);
    let x = -40 - L*30;
    for(let i=0;i<count;i++){
      const w = 40 + Math.floor(rand()* (120 - L*10));
      const hB = 80 + Math.floor(rand()* (220 + L*30));
      const y = baseY - hB - L*30;
      const building = document.createElementNS("http://www.w3.org/2000/svg","rect");
      building.setAttribute("x",x); building.setAttribute("y",y);
      building.setAttribute("width",w); building.setAttribute("height",hB);
      building.setAttribute("fill", `rgba(10,20,40,${0.45 + L*0.12})`);
      g.appendChild(building);

      // окна
      const wx = 4 + Math.floor(rand()*6);
      const wy = 4 + Math.floor(rand()*6);
      for(let yy=y+6; yy<y+hB-6; yy+=wy+3){
        for(let xx=x+5; xx<x+w-5; xx+=wx+3){
          if(rand() > 0.62){
            const light = document.createElementNS("http://www.w3.org/2000/svg","rect");
            light.setAttribute("x",xx); light.setAttribute("y",yy);
            light.setAttribute("width",wx); light.setAttribute("height",wy);
            const c = choice(rand, neon);
            light.setAttribute("fill", c);
            light.setAttribute("opacity", (0.35 + rand()*0.55).toFixed(2));
            g.appendChild(light);
          }
        }
      }

      // неоновая вывеска (иногда)
      if(rand() > 0.78){
        const bx = x + 6 + rand()*(w-20);
        const by = y + 10 + rand()*(hB-30);
        const sign = document.createElementNS("http://www.w3.org/2000/svg","rect");
        const sw = 14 + rand()*32, sh = 6 + rand()*12;
        sign.setAttribute("x",bx); sign.setAttribute("y",by);
        sign.setAttribute("width",sw); sign.setAttribute("height",sh);
        sign.setAttribute("fill", choice(rand, neon));
        sign.setAttribute("filter","url(#glow)");
        g.appendChild(sign);
      }

      x += w + (10 + Math.floor(rand()*20));
    }
    skyline.appendChild(g);
  }
  svg.appendChild(skyline);

  // ===== отражение в воде
  const reflection = skyline.cloneNode(true);
  reflection.setAttribute("transform","translate(0,1320) scale(1,-1)");
  [...reflection.querySelectorAll('rect')].forEach(r=>{
    const op = parseFloat(r.getAttribute('opacity')||'1');
    r.setAttribute('opacity', String(op*0.18));
    r.setAttribute('fill','rgba(100,140,200,0.25)');
  });
  svg.appendChild(reflection);

  // ===== туман у горизонта
  const fogGrad = document.createElementNS("http://www.w3.org/2000/svg","linearGradient");
  fogGrad.setAttribute("id","fog"); fogGrad.setAttribute("x1","0"); fogGrad.setAttribute("y1","0"); fogGrad.setAttribute("x2","0"); fogGrad.setAttribute("y2","1");
  const fs1 = document.createElementNS("http://www.w3.org/2000/svg","stop"); fs1.setAttribute("offset","0%"); fs1.setAttribute("stop-color", preset.fogTop);
  const fs2 = document.createElementNS("http://www.w3.org/2000/svg","stop"); fs2.setAttribute("offset","100%"); fs2.setAttribute("stop-color","rgba(0,0,0,0)");
  defs.appendChild(fogGrad); fogGrad.appendChild(fs1); fogGrad.appendChild(fs2);
  const fog = document.createElementNS("http://www.w3.org/2000/svg","rect");
  fog.setAttribute("x","0"); fog.setAttribute("y","610"); fog.setAttribute("width","1600"); fog.setAttribute("height","80");
  fog.setAttribute("fill","url(#fog)");
  svg.appendChild(fog);

  // ===== цитата + мета
  const [q,a] = choice(rand, QUOTES);
  document.getElementById('quote').textContent = `«${q}» — ${a}`;
  document.getElementById('meta').textContent = `seed: ${seedStr} · палитра h=${hue} · тема: ${appTheme}`;
  return { seedStr, paletteHue:hue };
}

/* ========= PNG ЭКСПОРТ ========= */
function svgToPng(svgEl, scale=4){
  return new Promise(resolve=>{
    const xml = new XMLSerializer().serializeToString(svgEl);
    const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgEl.viewBox.baseVal.width * scale;
      canvas.height = svgEl.viewBox.baseVal.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = getComputedStyle(document.body).backgroundColor || '#0b1220';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => resolve(URL.createObjectURL(b)), 'image/png');
    };
    img.src = svg64;
  });
}

/* ========= ТЕМЫ ========= */
function setTheme(name){
  document.getElementById('app').setAttribute('data-theme', name);
  localStorage.setItem('randomopolis_theme', name);
  // перерисуем сцену при смене темы с тем же seed
  generate(location.hash.replace(/^#/, '') || 'seed');
}

/* ========= ИНИТ ========= */
(function(){
  const radios = document.querySelectorAll('input[name="theme"]');
  const saved = localStorage.getItem('randomopolis_theme');
  if(saved){
    document.querySelector(`input[name="theme"][value="${saved}"]`)?.setAttribute('checked','checked');
    setTheme(saved);
  }
  radios.forEach(r => r.addEventListener('change', e => setTheme(e.target.value)));

  const seedFromHash = () => {
    const h = location.hash.replace(/^#/,'').trim();
    return h && h.length>0 ? h : Math.random().toString(36).slice(2,10);
    };

  let currentSeed = seedFromHash();
  location.hash = currentSeed;
  generate(currentSeed);

  // 🎲 Новый
  document.getElementById('btnNew').addEventListener('click', () => {
    currentSeed = Math.random().toString(36).slice(2,10);
    location.hash = currentSeed;
    generate(currentSeed);
  });

  // Ссылка на сцену
  document.getElementById('btnLink').addEventListener('click', async () => {
    const url = location.href;
    try{
      await navigator.clipboard.writeText(url);
      flash("Ссылка скопирована.");
    }catch{
      prompt("Скопируй ссылку вручную:", url);
    }
  });

  // 🖼️ PNG (совместимость с iOS/Firefox)
  document.getElementById('btnPng').addEventListener('click', async () => {
    const a = document.createElement('a');
    a.download = `randomopolis_${location.hash.replace('#','')}.png`;
    const blobUrl = await svgToPng(document.getElementById('scene'), 4);
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(()=> URL.revokeObjectURL(blobUrl), 5000);
  });

  // SVG экспорт
  document.getElementById('btnSvg').addEventListener('click', () => {
    const xml = new XMLSerializer().serializeToString(document.getElementById('scene'));
    const blob = new Blob([xml], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `randomopolis_${location.hash.replace('#','')}.svg`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(()=> URL.revokeObjectURL(url), 5000);
  });

  // О сцене
  document.getElementById('btnInfo').addEventListener('click', () => {
    const meta = document.getElementById('meta').textContent;
    alert("Randomopolis — процедурный SVG-город.\n" + meta + "\n— Темы, PNG и SVG экспорт.\n— Сидируемые ссылки.");
  });

  // hash -> regenerate
  window.addEventListener('hashchange', () => {
    const s = seedFromHash();
    currentSeed = s; generate(s);
  });

  // Netlify form UX
  const form = document.querySelector('form[name="quote"]');
  form?.addEventListener('submit', () => {
    setTimeout(()=>{ document.getElementById('thanks').style.display = 'block'; }, 300);
  });

  // мини-тост
  function flash(text){
    const div = document.createElement('div');
    div.textContent = text;
    div.style.position='fixed'; div.style.left='50%'; div.style.top='20px'; div.style.transform='translateX(-50%)';
    div.style.background='rgba(15,23,42,.9)'; div.style.border='1px solid rgba(255,255,255,.2)'; div.style.color='var(--text)';
    div.style.padding='10px 14px'; div.style.borderRadius='12px'; div.style.boxShadow='var(--shadow)'; div.style.zIndex='3000';
    document.body.appendChild(div);
    setTimeout(()=>{ div.style.transition='opacity .4s'; div.style.opacity='0'; setTimeout(()=>div.remove(), 400); }, 1200);
  }

  // Горячие клавиши (пропускаем ввод в полях)
document.addEventListener('keydown', (e) => {
  // игнорим ввод в полях и сочетания с модификаторами
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.isComposing)) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  switch (e.code) { // раскладка не влияет: KeyN, KeyP и т.д.
    case 'KeyN':
      e.preventDefault();
      document.getElementById('btnNew').click();
      break;
    case 'KeyP':
      e.preventDefault();
      document.getElementById('btnPng').click();
      break;
    case 'KeyS':
      e.preventDefault();
      document.getElementById('btnSvg').click();
      break;
    case 'KeyL':
      e.preventDefault();
      document.getElementById('btnLink').click();
      break;
    case 'KeyI':
      e.preventDefault();
      document.getElementById('btnInfo').click();
      break;
  }
});

})();
