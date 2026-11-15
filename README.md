# Entrelinhas

Projeto de Ana Luiza e Gabrielle Kyoko para apoiar a autonomia docente ao adaptar materiais do RCO à realidade de cada turma.

Repositório público da equipe: https://github.com/gab-kyoko/Atividade_03_Desenvolvimento_WEB

## Estrutura

- `frontend/`: Next.js, interface com dados demonstrativos da Sprint 1. Leia `frontend/README.md` para instalar, executar e gerar o site estático.
- `backend/`: FastAPI e integração real com Gemini para a Sprint 2. Leia `backend/README.md` para executar, testar e usar o endpoint.
- `render.yaml`: configuração de publicação da API no Render.

## Estado das sprints

O backend da Sprint 2 oferece `POST /api/v1/planos/sugerir`, com schemas compatíveis com o perfil de turma do frontend. O frontend continua usando dados mockados nesta etapa; o consumo da API e o login pertencem à Sprint 3. A chave de IA deve ser configurada apenas no servidor como `GEMINI_API_KEY`. A Sprint 2 só estará pronta para a review quando a API estiver publicada e uma chamada real ao provedor retornar uma sugestão em sua URL pública.
