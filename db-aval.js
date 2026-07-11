/* ============================================================================
   Camada de acesso — só conversa com o Supabase pelas funções (RPC).
   As credenciais do avaliador ficam apenas na sessionStorage (limpas ao sair)
   e são reenviadas na hora de gravar, para o servidor revalidar. Elas NUNCA
   são gravadas junto das avaliações.
   ==========================================================================*/
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ERROS = {
  CREDENCIAIS_INVALIDAS: "Login ou senha incorretos.",
  JA_CONCLUIDO:          "Você já concluiu esta rodada. Cada pessoa avalia uma única vez.",
  RODADA_FECHADA:        "A rodada de avaliação está fechada no momento.",
  PESSOA_INATIVA:        "Seu acesso não está habilitado para esta rodada.",
  ACESSO_NEGADO:         "Este recurso é restrito ao administrador.",
  LOGIN_EM_USO:          "Este login já está em uso.",
  LOGIN_NAO_ENCONTRADO:  "Login não encontrado.",
  AVALIADO_INVALIDO:     "Um dos colegas selecionados não é válido.",
  AUTOAVALIACAO_NAO_PERMITIDA: "Não é possível avaliar a si mesmo no 360.",
};
function traduzErro(e) {
  const msg = (e && e.message) ? e.message : String(e);
  for (const k in ERROS) if (msg.includes(k)) return ERROS[k];
  return "Ocorreu um erro. Tente novamente. (" + msg + ")";
}

const Sessao = {
  salvar(login, senha, dados) {
    sessionStorage.setItem("aval_login", login);
    sessionStorage.setItem("aval_senha", senha);
    sessionStorage.setItem("aval_dados", JSON.stringify(dados));
  },
  login()  { return sessionStorage.getItem("aval_login"); },
  senha()  { return sessionStorage.getItem("aval_senha"); },
  dados()  { const d = sessionStorage.getItem("aval_dados"); return d ? JSON.parse(d) : null; },
  logado() { return !!this.login() && !!this.dados(); },
  sair()   { sessionStorage.clear(); }
};

const API = {
  async login(login, senha) {
    const { data, error } = await _sb.rpc("aval_login", { p_login: login, p_senha: senha });
    if (error) throw error;
    Sessao.salvar(login, senha, data);
    return data;
  },

  async enviar360(avaliacoes) {
    const { data, error } = await _sb.rpc("aval_enviar_360", {
      p_login: Sessao.login(), p_senha: Sessao.senha(), p_avaliacoes: avaliacoes
    });
    if (error) throw error;
    return data;
  },

  async enviarDISC(respostas, perfil) {
    const { data, error } = await _sb.rpc("aval_enviar_disc", {
      p_login: Sessao.login(), p_senha: Sessao.senha(),
      p_respostas: respostas, p_perfil: perfil
    });
    if (error) throw error;
    return data;
  },

  async resultados() {
    const { data, error } = await _sb.rpc("aval_resultados", {
      p_login: Sessao.login(), p_senha: Sessao.senha()
    });
    if (error) throw error;
    return data;
  },

  async addPessoa(nome, novoLogin, novaSenha, ehAdmin) {
    const { data, error } = await _sb.rpc("aval_admin_add_pessoa", {
      p_login: Sessao.login(), p_senha: Sessao.senha(),
      p_nome: nome, p_novo_login: novoLogin, p_nova_senha: novaSenha, p_eh_admin: !!ehAdmin
    });
    if (error) throw error;
    return data;
  },

  async resetSenha(loginAlvo, novaSenha) {
    const { data, error } = await _sb.rpc("aval_admin_reset_senha", {
      p_login: Sessao.login(), p_senha: Sessao.senha(),
      p_login_alvo: loginAlvo, p_nova_senha: novaSenha
    });
    if (error) throw error;
    return data;
  },

  async setRodada(rodada, aberta) {
    const { data, error } = await _sb.rpc("aval_admin_set_rodada", {
      p_login: Sessao.login(), p_senha: Sessao.senha(),
      p_rodada: rodada, p_aberta: !!aberta
    });
    if (error) throw error;
    return data;
  },

  async setAtivo(loginAlvo, ativo) {
    const { data, error } = await _sb.rpc("aval_admin_set_ativo", {
      p_login: Sessao.login(), p_senha: Sessao.senha(),
      p_login_alvo: loginAlvo, p_ativo: !!ativo
    });
    if (error) throw error;
    return data;
  }
};
