import { useRef, useState, useEffect } from 'react';

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
    { id:'m9',  name:'Min-jun L.',  country:'Korea',       flag:'🇰🇷', favorite_song:'New Genesis', text:'Ado의 목소리는 정말 특별합니다. 당신의 음악 덕분에 매일이 조금 더 밝아집니다.' },
  ];
}

function Card({ msg }: {
  msg: Message;
}) {
  return (
    <div className="mc-card">
      {/* Comilla decorativa grande en teal */}
      <div className="mc-quote">"</div>
      <p className="mc-text">{msg.text}</p>
      <div className="mc-footer">
        <div className="mc-author">
          <span className="mc-name">{msg.name}</span>
          <span className="mc-country">{msg.flag} {msg.country}</span>
        </div>
        {msg.favorite_song && (
          <span className="mc-song">{msg.favorite_song}</span>
        )}
      </div>
    </div>
  );
}

export default function MessagesCarousel() {
  const trackRef  = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // TODO — Supabase:
  // const [messages, setMessages] = useState<Message[]>([]);
  // useEffect(() => {
  //   supabase.from('messages')
  //     .select('id,name,country,flag,text,favorite_song')
  //     .order('created_at', { ascending: false })
  //     .limit(20)
  //     .then(({ data }) => setMessages(data ?? []));
  // }, []);
  const messages = sampleMessages();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.animationPlayState = paused ? 'paused' : 'running';
  }, [paused]);

  // Duplicar para loop infinito
  const doubled = [...messages, ...messages];

  return (
    <div
      className="mc-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mc-track" ref={trackRef}>
        {doubled.map((msg, i) => (
          <Card
            key={`${msg.id}-${i}`}
            msg={msg}
          />
        ))}
      </div>
    </div>
  );
}
