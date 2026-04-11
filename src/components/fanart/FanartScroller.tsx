import { useEffect, useState } from 'react';

interface FanartCard {
  id: string;
  image_url?: string;
  // Pinterest style: cada imagen tiene su ratio natural
  // aspectRatio = width/height, ej: 0.75 = portrait 3:4
  aspectRatio: number;
  from: string;
  to: string;
  kanji: string;
  accent: string;
}

// Placeholders con ratios variados — simula imágenes reales de distintos tamaños
// Al conectar Supabase: fetch image dimensions y calcular aspectRatio real
function generatePlaceholders(): FanartCard[] {
  return [
    { id:'p0',  aspectRatio: 0.75,  from:'#0a1828', to:'#1e3a55', kanji:'愛', accent:'rgba(58,127,163,.22)'  },
    { id:'p1',  aspectRatio: 1.0,   from:'#0d1020', to:'#2a2a50', kanji:'声', accent:'rgba(90,60,120,.25)'  },
    { id:'p2',  aspectRatio: 0.6,   from:'#091520', to:'#1a3040', kanji:'夢', accent:'rgba(58,127,163,.2)'   },
    { id:'p3',  aspectRatio: 1.2,   from:'#100a1a', to:'#302040', kanji:'歌', accent:'rgba(120,60,100,.22)'  },
    { id:'p4',  aspectRatio: 0.8,   from:'#081420', to:'#1c3858', kanji:'花', accent:'rgba(58,127,163,.24)'  },
    { id:'p5',  aspectRatio: 0.65,  from:'#0a0e20', to:'#252855', kanji:'ア', accent:'rgba(80,60,140,.22)'  },
    { id:'p6',  aspectRatio: 1.1,   from:'#091828', to:'#204060', kanji:'星', accent:'rgba(58,127,163,.2)'   },
    { id:'p7',  aspectRatio: 0.7,   from:'#0c1020', to:'#28304a', kanji:'海', accent:'rgba(58,100,163,.24)'  },
    { id:'p8',  aspectRatio: 0.9,   from:'#080c18', to:'#1e2840', kanji:'空', accent:'rgba(58,127,163,.18)'  },
    { id:'p9',  aspectRatio: 0.75,  from:'#0a1220', to:'#203050', kanji:'風', accent:'rgba(58,127,163,.22)'  },
    { id:'p10', aspectRatio: 1.3,   from:'#0e0a20', to:'#2a2050', kanji:'月', accent:'rgba(100,60,140,.24)'  },
    { id:'p11', aspectRatio: 0.55,  from:'#091018', to:'#1a2840', kanji:'光', accent:'rgba(58,127,163,.2)'   },
  ];
}

// Card individual — Pinterest style: ancho fijo, alto proporcional al ratio
function Card({ card }: { card: FanartCard }) {
  // paddingBottom = (1/aspectRatio)*100% hace que el contenedor
  // tenga la altura proporcional al ancho (igual que Pinterest)
  const paddingBottom = `${(1 / card.aspectRatio) * 100}%`;

  if (card.image_url) {
    return (
      <div style={{ position: 'relative', width: '100%', paddingBottom, marginBottom: 10 }}>
        <img
          src={card.image_url}
          alt="Fan Art"
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            borderRadius: 6,
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom, marginBottom: 10 }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${card.from}, ${card.to})`,
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 40% 40%, ${card.accent}, transparent 70%)`,
        }} />
        {/* Kanji watermark */}
        <span style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: '3.5rem',
          color: 'rgba(167,216,240,.08)',
          userSelect: 'none',
          position: 'relative',
        }}>
          {card.kanji}
        </span>
      </div>
    </div>
  );
}

// Columna con scroll CSS infinito
// Técnica: array triplicado + @keyframes mueve -33.333% (un set completo)
function Column({
  cards,
  direction,
  duration,
}: {
  cards: FanartCard[];
  direction: 'up' | 'down';
  duration: number;
}) {
  const tripled = [...cards, ...cards, ...cards];
  const animName = direction === 'up' ? 'fs-scroll-up' : 'fs-scroll-down';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          animationName: animName,
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationFillMode: 'none',
          willChange: 'transform',
        }}
      >
        {tripled.map((card, i) => (
          <Card key={`${card.id}-${i}`} card={card} />
        ))}
      </div>
    </div>
  );
}

export default function FanartScroller() {
  const [cards, setCards] = useState<FanartCard[]>([]);

  useEffect(() => {
    // TODO — Supabase:
    // const { data } = await supabase
    //   .from('fanarts')
    //   .select('id, image_url, width, height')
    //   .eq('approved', true)
    //   .order('created_at', { ascending: false })
    //   .limit(12);
    // setCards(data?.map(f => ({ ...f, aspectRatio: f.width / f.height })) ?? []);
    setCards(generatePlaceholders());
  }, []);

  if (cards.length === 0) return null;

  const col0 = cards.filter((_, i) => i % 3 === 0);
  const col1 = cards.filter((_, i) => i % 3 === 1);
  const col2 = cards.filter((_, i) => i % 3 === 2);

  return (
    <div style={{ display: 'flex', gap: 10, width: '100%', height: '100%', alignItems: 'flex-start' }}>
      <Column cards={col0} direction="up"   duration={25} />
      <Column cards={col1} direction="down" duration={32} />
      <Column cards={col2} direction="up"   duration={28} />
    </div>
  );
}
