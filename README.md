# Entrelinha — Sprints 1 a 3

Projeto de Ana Luiza e Gabrielle Kyoko.

O uso obrigatório do RCO e de materiais padronizados pode deixar pouco espaço para adequar aulas às necessidades de cada turma. O Entrelinha oferece a docentes da educação básica um espaço para registrar perfis de turmas e adaptar o conteúdo-base ao contexto de seus estudantes. O fluxo de criação tem três passos curtos e termina em um editor no qual a decisão permanece com o professor. Na Sprint 2, a IA propõe abertura, desenvolvimento e fechamento a partir do conteúdo, do objetivo e do perfil da turma, sempre sujeitos à revisão docente.

## Executar

Requisitos: Node.js 20.9 ou superior e npm. O aplicativo Next.js fica em `frontend/`.

```bash
cd frontend
npm ci
npm run dev
```

Abra http://localhost:3000. Para gerar a versão estática, use `npm run build` dentro de `frontend/`; os arquivos ficam em `frontend/out/`. Os comandos da raiz mantêm compatibilidade com os serviços Render já configurados e copiam a saída para `out/`.

Para a sugestão por IA, copie `frontend/.env.example` para `frontend/.env.local` e configure `NEXT_PUBLIC_API_URL` com a URL pública da API (ou `http://localhost:8000` durante o desenvolvimento local). No Render, a variável já está configurada nos frontends existentes. A chave `GEMINI_API_KEY` permanece somente no backend/Render.

Para executar a API localmente, em outro terminal:

```bash
cd backend
python -m venv .venv
# ative o ambiente virtual conforme seu sistema
pip install -r requirements.txt
# configure GEMINI_API_KEY e JWT_SECRET (mínimo de 32 caracteres) no ambiente
uvicorn app.main:app --reload
```

O banco local usa SQLite (`backend/entrelinha.db`). Em produção, configure `DATABASE_URL` para um PostgreSQL persistente. Consulte `backend/README.md` para endpoints e variáveis. O Render Free Postgres criado para a demonstração expira em 16/12/2026; exporte ou migre os dados antes dessa data.

## Estrutura

- `frontend/src/app`: página, layout e estilos.
- `frontend/src/components/ui`: botão, campo e cartão reutilizáveis.
- `frontend/src/components/workspace`: dashboard, turmas, fluxo guiado, editor e histórico.
- `frontend/src/data/workspaceMock.ts`: turmas e planos demonstrativos.
- `frontend/src/types/workspace.ts`: formatos compartilhados pela interface.
- `backend/`: API FastAPI e integração Gemini.

## Sprint 3

O frontend usa cadastro e login, envia JWT à API e salva turmas e planos no banco por usuário. A sugestão com IA retorna abertura, desenvolvimento e fechamento para revisão docente. Na revisão do plano, a opção **Gerar material de apoio** cria uma folha de atividades e perguntas em `.docx` editável para a turma. Os dados mockados da Sprint 1 permanecem no código como referência, mas a área autenticada consulta os dados persistidos.
