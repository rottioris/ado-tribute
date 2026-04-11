import { useEffect, useState, useRef } from 'react';

interface Message {
  id: string;
  name: string;
  country: string;
  flag: string;
  text: string;
  favorite_song?: string;
}

function sampleMessages(): Message[] {
  return [
    { id:'m0',  name:'Camila F.',   country:'Argentina',   flag:'🇦🇷', favorite_song:'Kura Kura',  text:'Tu música llegó en un momento muy difícil de mi vida y me ayudó a encontrar fuerzas que no sabía que tenía.' },
    { id:'m1',  name:'Santiago B.', country:'México',      flag:'🇲🇽', favorite_song:'Vivarium',    text:'Te vi en el concierto en México y lloré de principio a fin. Tu voz comunica lo que ningún idioma puede.' },
    { id:'m2',  name:'Yuki T.',     country:'Japan',       flag:'🇯🇵', favorite_song:'Tot Musica',  text:'アドちゃん、あなたの声は本当に唯一無二。これからもずっと応援しています。' },
    { id:'m3',  name:'Daniela P.',  country:'Colombia',    flag:'🇨🇴', favorite_song:'Vivarium',    text:'Cuando vi el MV de Vivarium, entendí todo. Ese lugar pequeño donde todo empezó y ahora llena estadios.' },
    { id:'m4',  name:'Emma T.',     country:'USA',         flag:'🇺🇸', favorite_song:'Vivarium',    text:'Watching the Vivarium MV felt like witnessing history. We love you, Ado.' },
    { id:'m5',  name:'Lucas G.',    country:'Argentina',   flag:'🇦🇷', favorite_song:'Tot Musica',  text:'Tot Musica me rompió en mil pedazos. Ado tiene algo que muy pocos artistas tienen.' },
    { id:'m6',  name:'Sofía R.',    country:'Perú',        flag:'🇵🇪', favorite_song:'Gira Gira',   text:'Ado llegó a mi vida como una tormenta — de repente y sin pedir permiso. Perú te ama.' },
    { id:'m7',  name:'Tomoko H.',   country:'Japan',       flag:'🇯🇵', favorite_song:'Kura Kura',   text:'くらくらの歌詞が大好きです。アドさんの声は私の心の奥深くに届きます。' },
    { id:'m8',  name:'Fernanda L.', country:'Chile',       flag:'🇨🇱', favorite_song:'Gira Gira',   text:'Ado, tu música fue lo que me hizo interesarme en el japonés. Eres mi mayor motivación.' },
    { id:'m9',  name:'Min-jun L.',  country:'South Korea', flag:'🇰🇷', favorite_song:'New Genesis', text:'Ado의 목소리는 정말 특별합니다. 당신의 음악 덕분에 매일이 조금 더 밝아집니다.' },
  ];
}

export default function MessagesCarousel() {
  const [messages]        = useState<Message[]>(sampleMessages);
  const [active, setActive] = useState(0);
  const [prev,   setPrev]   = useState<number | null>(null);
  const [dir,    setDir]    = useState<'next' | 'prev'>('next');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = messages.length;

  function goTo(idx: number, direction: 'next' | 'prev') {
    setPrev(active);
    setDir(direction);
    setActive(idx);
  }

  function next() { goTo((active + 1) % total, 'next'); }
  function back() { goTo((active - 1 + total) % total, 'prev'); }

  // Auto-avance cada 5s
  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(a => {
        setPrev(a);
        setDir('next');
        return (a + 1) % total;
      });
    }, 5000);
  }

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total]);

  // Reiniciar timer al navegar manualmente
  function manualNext() { next(); startTimer(); }
  function manualBack() { back(); startTimer(); }

  const msg = messages[active];

  // Mostrar card activa + las 2 a cada lado (ghost cards)
  const visible = [-2, -1, 0, 1, 2].map(offset => {
    const idx = (active + offset + total) % total;
    return { idx, offset, msg: messages[idx] };
  });

  return (
    <div className="mc-root">
      {/* Cards */}
      <div className="mc-stage">
        {visible.map(({ idx, offset, msg: m }) => (
          <div
            key={idx}
            className={`mc-card mc-card--offset-${offset < 0 ? 'n' : 'p'}${Math.abs(offset)}`}
            data-offset={offset}
            onClick={() => {
              if (offset !== 0) {
                offset > 0 ? manualNext() : manualBack();
              }
            }}
          >
            <span className="mc-quote">"</span>
            <p className="mc-text">{m.text}</p>
            <div className="mc-footer">
              <div className="mc-author">
                <span className="mc-name">{m.name}</span>
                <span className="mc-country">{m.flag} {m.country}</span>
              </div>
              {m.favorite_song && (
                <span className="mc-song">{m.favorite_song}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navegación */}
      <div className="mc-nav">
        <button className="mc-btn" onClick={manualBack} aria-label="Anterior">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="mc-dots">
          {messages.map((_, i) => (
            <button
              key={i}
              className={`mc-dot${i === active ? ' mc-dot--active' : ''}`}
              onClick={() => { goTo(i, i > active ? 'next' : 'prev'); startTimer(); }}
              aria-label={`Mensaje ${i + 1}`}
            />
          ))}
        </div>

        <button className="mc-btn" onClick={manualNext} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
