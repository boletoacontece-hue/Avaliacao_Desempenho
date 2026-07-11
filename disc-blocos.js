/* ============================================================================
   DISC — Instrumento de autoavaliação (Acontece)
   Metodologia: escolha forçada MAIS/MENOS, 24 blocos de 4 frases (um fator por
   frase), rotação posicional balanceada (cada fator 6x em cada posição),
   escala de intensidade 0–100 com linha média em 50.
   Frases neutras (contexto do negócio, sem referência a nenhuma função).
   ==========================================================================*/

const DISC_FRASES = {
  D: [ // Dominância — resultado, decisão, controle, desafio, franqueza
    "Assumo a frente quando ninguém decide.",
    "Vou direto ao ponto, mesmo em assuntos difíceis.",
    "Gosto de bater metas ambiciosas.",
    "Prefiro decidir rápido a esperar consenso.",
    "Encaro os problemas de frente, sem rodeios.",
    "Busco assumir o controle das situações.",
    "Não tenho receio de confrontar quando é preciso.",
    "Foco no resultado acima de tudo.",
    "Gosto de desafios que testam meus limites.",
    "Costumo pressionar para as coisas andarem.",
    "Tomo a iniciativa sem esperar ser chamado.",
    "Sou competitivo por natureza.",
    "Prefiro liderar a seguir.",
    "Insisto até conseguir o que quero.",
    "Falo o que penso, custe o que custar.",
    "Gosto de ambientes de ritmo acelerado.",
    "Assumo riscos para chegar mais longe.",
    "Cobro resultados de quem está comigo.",
    "Não me acomodo com o 'está bom assim'.",
    "Gosto de ter autonomia para decidir.",
    "Mantenho o foco mesmo sob forte pressão.",
    "Prefiro agir a ficar analisando demais.",
    "Defendo minha posição com firmeza.",
    "Puxo a responsabilidade para mim."
  ],
  I: [ // Influência — comunicação, entusiasmo, persuasão, relacionamento
    "Faço amizade com facilidade.",
    "Gosto de animar o ambiente de trabalho.",
    "Convenço as pessoas com facilidade.",
    "Sou otimista mesmo diante de problemas.",
    "Gosto de estar cercado de gente.",
    "Expresso minhas ideias com entusiasmo.",
    "Puxo conversa com quem acabei de conhecer.",
    "Contagio a equipe com minha energia.",
    "Gosto de ser reconhecido pelo que faço.",
    "Uso o bom humor para aliviar tensões.",
    "Prefiro trabalhar em grupo a sozinho.",
    "Participo bastante das reuniões.",
    "Inspiro as pessoas a comprarem uma ideia.",
    "Sou espontâneo ao me comunicar.",
    "Crio conexão rápida com clientes.",
    "Gosto de novidades e variedade.",
    "Levo entusiasmo para os projetos.",
    "Me adapto fácil a pessoas diferentes.",
    "Prefiro apresentar a documentar.",
    "Costumo elogiar e reconhecer os colegas.",
    "Fico à vontade sendo o centro das atenções.",
    "Transmito confiança quando falo.",
    "Gosto de celebrar as conquistas do time.",
    "Sou movido por relacionamento."
  ],
  S: [ // Estabilidade — paciência, constância, cooperação, apoio
    "Mantenho a calma mesmo em situações tensas.",
    "Prefiro rotinas previsíveis.",
    "Ajudo os colegas sem esperar nada em troca.",
    "Sou paciente com quem está aprendendo.",
    "Evito mudanças bruscas.",
    "Trabalho bem em ritmo constante.",
    "Escuto mais do que falo.",
    "Sou leal a quem trabalha comigo.",
    "Cumpro o que combino, sem falhar.",
    "Prefiro cooperar a competir.",
    "Gosto de ambientes harmoniosos.",
    "Ofereço apoio quando alguém precisa.",
    "Levo os compromissos com constância.",
    "Penso bem antes de mudar de opinião.",
    "Prefiro estabilidade a surpresas.",
    "Sou tranquilo para lidar com conflitos.",
    "Termino o que começo, sem pressa exagerada.",
    "Coloco o bem do grupo à frente do meu.",
    "Sou confiável no dia a dia.",
    "Prefiro ouvir todos antes de decidir.",
    "Mantenho a serenidade sob cobrança.",
    "Gosto de saber o que esperar do meu dia.",
    "Costumo ser o ponto de equilíbrio do time.",
    "Dou continuidade às coisas com disciplina."
  ],
  C: [ // Conformidade — precisão, regras, análise, qualidade, cautela
    "Sigo os procedimentos à risca.",
    "Confiro os detalhes antes de entregar.",
    "Baseio minhas decisões em dados.",
    "Prezo pela qualidade acima da rapidez.",
    "Organizo tudo antes de começar.",
    "Sou cauteloso ao assumir riscos.",
    "Gosto de regras claras.",
    "Reviso meu trabalho mais de uma vez.",
    "Analiso bem antes de opinar.",
    "Documento o que faço com cuidado.",
    "Fico incomodado com erros pequenos.",
    "Prefiro precisão a improviso.",
    "Sigo padrões e normas técnicas.",
    "Planejo cada etapa com antecedência.",
    "Questiono quando algo não faz sentido.",
    "Sou detalhista nos relatórios.",
    "Prefiro ter certeza a arriscar.",
    "Estudo o assunto antes de agir.",
    "Mantenho tudo em ordem e registrado.",
    "Cumpro prazos com rigor.",
    "Evito decisões por impulso.",
    "Busco a resposta mais exata possível.",
    "Sou crítico com a qualidade do que sai.",
    "Trabalho melhor com processos definidos."
  ]
};

// Rotação posicional balanceada: 4 permutações cíclicas repetidas 6x = 24 blocos.
// Cada fator aparece exatamente 6x em cada uma das 4 posições.
const DISC_ROTACAO = [
  ["D","I","S","C"],
  ["I","S","C","D"],
  ["S","C","D","I"],
  ["C","D","I","S"]
];

// Monta os 24 blocos. A frase de índice i de cada fator entra no bloco i.
function montarBlocosDISC() {
  const blocos = [];
  for (let i = 0; i < 24; i++) {
    const ordem = DISC_ROTACAO[i % 4];
    const opcoes = ordem.map(fator => ({ fator, texto: DISC_FRASES[fator][i] }));
    blocos.push({ n: i + 1, opcoes });
  }
  return blocos;
}

// Apuração: MAIS +1 / MENOS −1 por fator; net ∈ [−24,24] → intensidade 0–100.
function apurarDISC(respostas) {
  const cont = { D:0, I:0, S:0, C:0 };
  Object.values(respostas).forEach(r => {
    if (r.mais)  cont[r.mais]  += 1;
    if (r.menos) cont[r.menos] -= 1;
  });
  const perfil = {};
  ["D","I","S","C"].forEach(f => {
    perfil[f] = Math.round(((cont[f] + 24) / 48) * 100); // linha média em 50
  });
  return perfil;
}
