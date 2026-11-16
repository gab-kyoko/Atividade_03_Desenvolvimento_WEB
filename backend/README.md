# API Entrelinhas — Sprint 2

## Sprint 3

O backend agora inclui SQLModel (SQLite local ou PostgreSQL via `DATABASE_URL`), cadastro/login JWT e persistência de turmas e planos por usuário. Defina `JWT_SECRET` com pelo menos 32 caracteres aleatórios antes de iniciar a API. Para produção, configure `DATABASE_URL` com a URL interna do PostgreSQL na mesma região do serviço. A API cria as tabelas na inicialização.

Endpoints autenticados: `GET/POST/PUT /api/v1/turmas`, `GET/POST/PUT /api/v1/planos` e `POST /api/v1/planos/sugerir`. Cadastro e login: `POST /api/v1/auth/register` e `/login`, enviando JSON com `email` e `password`. Use o `access_token` retornado como `Authorization: Bearer <token>`.

FastAPI que recebe material do RCO, objetivo pedagógico e perfil da turma e solicita ao Gemini uma sugestão estruturada em abertura, desenvolvimento e fechamento. O docente revisa o texto antes de aplicar. Nenhum plano é persistido nesta sprint.

## Rodar localmente

Crie um ambiente virtual Python 3.11+ e instale `requirements.txt`. Defina `GEMINI_API_KEY` no ambiente do terminal, nunca no código ou no Git. `GEMINI_MODEL` é opcional e seu padrão é `gemini-3.5-flash-lite`. Depois execute:

```bash
uvicorn app.main:app --reload
```

Abra `http://localhost:8000/docs` e teste `POST /api/v1/planos/sugerir`. `GET /health` retorna o estado da API. Sem a chave, o endpoint de sugestão responde `503`, enquanto a documentação e a validação seguem acessíveis. Para testes automatizados: `pip install -r requirements-dev.txt` e `pytest`.

Exemplo de corpo JSON:

```json
{
  "turma": {
    "id": 1,
    "nome": "7º Ano B",
    "disciplina": "Matemática",
    "alunos": 29,
    "dominios": "Operações básicas e leitura de gráficos",
    "dificuldades": "Comparar frações equivalentes",
    "interesses": "Receitas da comunidade e jogos"
  },
  "material": "Frações equivalentes e representação de quantidades no RCO.",
  "objetivo": "Contextualizar"
}
```

A resposta contém `titulo`, `secoes.abertura`, `secoes.desenvolvimento`, `secoes.fechamento`, `modelo` e `aviso`.

## Render

O `render.yaml` na raiz configura um Web Service Python com diretório raiz `backend`, plano Free, comando de instalação, inicialização e health check.

1. Crie uma chave de API no Google AI Studio e guarde-a fora do repositório.
2. Publique esta pasta raiz em um repositório Git da dupla.
3. No Render, crie um Blueprint a partir do repositório. O arquivo `render.yaml` será lido automaticamente.
4. Informe `GEMINI_API_KEY` no campo secreto solicitado pelo Render. Não coloque a chave em `.env.example` nem em `NEXT_PUBLIC_*`.
5. Depois da publicação, abra a URL `/health` e a URL `/docs`. Em `/docs`, envie o exemplo acima para `POST /api/v1/planos/sugerir` e confirme uma resposta com as três seções.

Atualize `CORS_ORIGINS` com a URL pública do frontend antes da Sprint 3. Um serviço gratuito pode demorar para iniciar após um período ocioso.
