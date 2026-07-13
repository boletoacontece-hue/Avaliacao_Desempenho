/* ============================================================================
   Catálogo do 360 — blocos e perguntas (Acontece)
   Para adicionar/editar perguntas no futuro, basta mexer aqui. O id de cada
   pergunta é o que fica gravado no banco (jsonb), então NÃO troque ids já
   usados numa rodada em andamento — só adicione novos.
   ==========================================================================*/
const ESCALA_MIN = 1, ESCALA_MAX = 10;
const ESCALA_LEGENDA = ["1 · muito abaixo", "10 · excelente"];

const BLOCOS_360 = [
  {
    id: "competencias",
    titulo: "Comportamento e competências",
    perguntas: [
      { id: "comportamento",  texto: "Comportamento no ambiente de trabalho", desc: "Postura, ética e profissionalismo no dia a dia." },
      { id: "tecnica",        texto: "Habilidade técnica",                    desc: "Domínio e qualidade do trabalho na função." },
      { id: "comunicacao",    texto: "Comunicação",                           desc: "Clareza ao se expressar, ouvir e alinhar." },
      { id: "relacionamento", texto: "Relacionamento com os colegas",         desc: "Cooperação, respeito e convivência." },
      { id: "proatividade",   texto: "Proatividade",                          desc: "Iniciativa e disposição para resolver." }
    ]
  },
  {
    id: "resolucao_problemas",
    titulo: "Resolução de problemas",
    perguntas: [
      { id: "rp_pressao",   texto: "Como lida com imprevistos e situações de alta pressão?" },
      { id: "rp_autonomia", texto: "O quanto demonstra autonomia para propor soluções práticas e inovações?" }
    ]
  },
  {
    id: "cultura_valores",
    titulo: "Alinhamento com a cultura e valores",
    perguntas: [
      { id: "cv_valores",   texto: "O quanto vivencia os valores da empresa no dia a dia?" },
      { id: "cv_objetivos", texto: "O quanto demonstra comprometimento com os objetivos estratégicos da organização?" }
    ]
  },
  {
    id: "gestao",
    titulo: "Gestão e liderança",
    nota: "Responda pensando no papel de liderança da pessoa. Se não se aplica, pode deixar em branco.",
    opcional: true,
    perguntas: [
      { id: "gl_crescimento", texto: "O quanto incentiva o crescimento profissional da equipe?" },
      { id: "gl_clareza",     texto: "O quanto é claro ao definir expectativas e tomar decisões importantes?" }
    ]
  },
  {
    id: "procedimentos_financeiro",
    titulo: "Procedimentos do setor financeiro",
    perguntas: [
      { id: "pf_processos",    texto: "O quanto segue os processos e rotinas do setor (conciliações, prazos, controles)?" },
      { id: "pf_precisao",     texto: "Precisão e cuidado na execução (lançamentos, boletos, pagamentos, conferências)?" },
      { id: "pf_conformidade", texto: "O quanto respeita normas, políticas e controles internos?" }
    ]
  }
];

// Lista achatada de todas as perguntas (útil para médias/laudo)
const TODAS_PERGUNTAS = BLOCOS_360.flatMap(b => b.perguntas.map(p => ({ ...p, bloco: b.id, blocoTitulo: b.titulo })));
const MAPA_PERGUNTA = Object.fromEntries(TODAS_PERGUNTAS.map(p => [p.id, p]));
const MAPA_BLOCO = Object.fromEntries(BLOCOS_360.map(b => [b.id, b]));
