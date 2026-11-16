# Entrelinha — Sprints 1 a 3

Projeto de Ana Luiza e Gabrielle Kyoko.

**Site publicado:** [Acessar o Entrelinha](https://entrelinhas-at3-zmth.onrender.com/)

O uso obrigatório do RCO e de materiais padronizados pode deixar pouco espaço para adequar aulas às necessidades de cada turma. O Entrelinha oferece a docentes da educação básica um espaço para registrar perfis de turmas e adaptar o conteúdo-base ao contexto de seus estudantes. O fluxo de criação tem três passos curtos e termina em um editor no qual a decisão permanece com o professor. Na Sprint 2, a IA propõe abertura, desenvolvimento e fechamento a partir do conteúdo, do objetivo e do perfil da turma, sempre sujeitos à revisão docente.

## Executar

Requisitos: Node.js 20.9 ou superior e npm. O aplicativo Next.js fica em `frontend/`.

```bash
cd frontend
npm ci
npm run dev
```

Abra http://localhost:3000. Para gerar a versão estática, use `npm run build` dentro de `frontend/`; os arquivos ficam em `frontend/out/`. Os comandos da raiz mantêm compatibilidade com os serviços Render já configurados e copiam a saída para `out/`.

Copie `frontend/.env.example` para `frontend/.env.local` e configure `NEXT_PUBLIC_API_URL` com a URL pública da API (ou `http://localhost:8000` durante o desenvolvimento local). No Render, essa variável deve estar configurada no serviço do frontend **antes do build**. A chave `GEMINI_API_KEY` permanece somente no serviço do backend.

Para executar a API localmente, em outro terminal:

```bash
cd backend
python -m venv .venv
# ative o ambiente virtual conforme seu sistema
pip install -r requirements.txt
# configure GEMINI_API_KEY e JWT_SECRET (mínimo de 32 caracteres) no ambiente
# configure CORS_ORIGINS com a origem do frontend publicado
# configure DATABASE_URL com PostgreSQL em produção
uvicorn app.main:app --reload
```

O banco local usa SQLite (`backend/entrelinha.db`). Em produção, configure `DATABASE_URL` para um PostgreSQL persistente. Consulte `backend/README.md` para endpoints e variáveis. O Render Free Postgres criado para a demonstração expira em 16/12/2026; exporte ou migre os dados antes dessa data.

## Estrutura

- `frontend/src/app`: página, layout e estilos.
- `frontend/src/components/ui`: botão, campo e cartão reutilizáveis.
- `frontend/src/components/workspace`: dashboard, turmas, fluxo guiado, editor e histórico.
- `frontend/src/types/workspace.ts`: formatos compartilhados pela interface.
- `backend/`: API FastAPI e integração Gemini.

## Sprint 3

O frontend usa cadastro e login, envia JWT às rotas protegidas e carrega turmas e planos da API. Não há dados mockados na interface publicada. A sugestão com IA retorna abertura, desenvolvimento e fechamento para revisão docente. Na revisão do plano, a opção **Gerar material de apoio** cria uma folha de atividades e perguntas em `.docx` editável para a turma.

Publicação: [frontend](https://entrelinhas-at3-zmth.onrender.com) e [API](https://entrelinhas-api-sic8.onrender.com/health). No Render, configure `NEXT_PUBLIC_API_URL` no frontend e `CORS_ORIGINS`, `JWT_SECRET`, `DATABASE_URL` e `GEMINI_API_KEY` na API. `CORS_ORIGINS` recebe as origens completas, separadas por vírgula. `DATABASE_URL` deve apontar para PostgreSQL; o SQLite local não preserva dados após reinícios do serviço gratuito. O login e a geração por IA precisam das duas aplicações publicadas.

Para a review, crie uma conta, cadastre uma turma, gere um plano com IA, revise e salve. Saia e entre novamente para conferir a leitura dos dados persistidos. Os comandos de teste são `python -m pytest` em `backend/` e `npm run build` em `frontend/`.
