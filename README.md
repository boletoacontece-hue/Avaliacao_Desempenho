# Avaliação de Desempenho 360° — Departamento Financeiro (Acontece)

Sistema estático (GitHub Pages) + banco no **mesmo Supabase** dos outros apps.
Cada colaborador entra com login e senha, avalia os colegas (360°) e faz a
autoavaliação DISC. A gestão vê **médias e observações — nunca quem escreveu**.

---

## Como o sigilo é garantido (e o limite honesto disso)

O sistema **separa identidade de conteúdo no próprio banco**:

- A tabela de respostas do 360 (`aval_respostas`) **não tem coluna nenhuma**
  apontando para quem avaliou. Só guarda quem foi **avaliado**, as notas e as
  observações. Não é que o vínculo fique escondido — ele **não é gravado**.
- Quem concluiu fica só numa tabela separada (`aval_conclusao`), como um
  "entregou: sim/não", sem qualquer ligação com as respostas.
- O front nunca escreve direto nas tabelas: tudo passa por **funções no banco**
  (`SECURITY DEFINER`). O **RLS** está ligado sem políticas para o público, então
  a chave `anon` **não lê nem escreve** nenhuma tabela diretamente.
- As respostas guardam só a **data** (sem hora) e usam **id aleatório (UUID)**,
  para não permitir cruzar horário/ordem de envio com uma avaliação.

**O limite honesto:** como você é o dono do projeto Supabase, você tem acesso de
administrador ao banco. A garantia aqui **não é criptográfica** ("nem com esforço
você consegue"); é **estrutural** — o sistema não guarda o vínculo, então não há
o que olhar, desde que o schema não seja alterado depois para começar a registrar
isso. E há um limite matemático que nenhum sistema resolve: com **poucos
avaliadores por pessoa**, dá para deduzir por eliminação. Por isso o painel marca
"n baixo" quando alguém recebeu menos de 3 avaliações. O ideal é **4–5 ou mais**
avaliadores por pessoa.

---

## Arquivos

| Arquivo | Função |
|---|---|
| `supabase_schema_avaliacao.sql` | Cria tabelas, RLS e funções. Rodar **uma vez** no Supabase. |
| `config.js` | URL e chave `anon` do seu Supabase (você preenche). |
| `db-aval.js` | Camada de acesso (só chama as funções). |
| `disc-blocos.js` | As 24 questões do DISC. |
| `estilo.css` | Estilo (identidade Acontece). |
| `index.html` | Login e menu. |
| `avaliar.html` | Avaliação 360 dos colegas. |
| `disc.html` | Autoavaliação DISC. |
| `resultados.html` | Painel do administrador. |

---

## Publicação (uma vez)

### 1. Banco (Supabase)
1. Abra o **mesmo projeto** Supabase dos outros apps → **SQL Editor**.
2. Cole todo o conteúdo de `supabase_schema_avaliacao.sql` e rode.
   Isso cria as tabelas com prefixo `aval_` (não mexe nas suas outras tabelas) e
   já cadastra o admin inicial: **login `alehandro` · senha `Trocar@2026`**.

### 2. Configuração
1. No Supabase: **Settings → API**. Copie **Project URL** e **anon public**.
2. Cole em `config.js` nos campos `SUPABASE_URL` e `SUPABASE_ANON_KEY`.

### 3. GitHub Pages
1. Suba os arquivos para um repositório (pode ser o mesmo padrão que você já usa).
   Como é HTML puro (sem build), **não precisa de Vite nem Vercel**.
2. **Settings → Pages → Branch: main / (root)** → Save.
3. Em ~1 min o link fica no ar, algo como
   `https://SEUUSUARIO.github.io/NOME-DO-REPO/`.
4. Entregue o link + o login/senha de cada pessoa.

> Observação: o `config.js` contém a chave `anon`, que **é pública por natureza** —
> quem protege os dados é o RLS + as funções, não o segredo da chave. Ainda assim,
> se preferir manter o repositório **privado**, o GitHub Pages continua funcionando.

---

## Uso pelo administrador (você)

Entre com `alehandro` e abra **Painel de resultados**. Lá você:

- **Cadastra colaboradores** (nome + login + senha inicial que você entrega).
- **Redefine senhas** de quem esqueceu.
- **Abre/fecha a rodada** — feche quando todos concluírem; ao iniciar a próxima,
  troque o nome (ex.: `2026-S2`) e deixe aberta. O histórico anterior é preservado.
- Vê **médias por competência**, **observações anônimas** e os **perfis DISC**.

**Troque sua senha** logo no início: painel → "Redefinir senha" (login `alehandro`).

Se você **não** quiser ser avaliado pelo time (o admin já vem como *inativo* no
360, só administrando), deixe como está. Para participar do 360 também, use
"cadastrar" um acesso próprio ativo, ou me peça para deixar o `alehandro` ativo.

---

## Competências avaliadas (1 a 10)

Comportamento no ambiente de trabalho · Habilidade técnica · Comunicação ·
Relacionamento com os colegas · Proatividade.

## DISC
Autoavaliação de escolha forçada (24 blocos, MAIS/MENOS), com rotação posicional
balanceada e escala de intensidade 0–100. Diferente do 360, **é ligada à pessoa**:
é o perfil individual dela, usado no acompanhamento e desenvolvimento.
