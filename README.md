# Entrelinha — Sprint 1 e 2

Projeto de Ana Luiza e Gabrielle Kyoko.

O uso obrigatório do RCO e de materiais padronizados pode deixar pouco espaço para adequar aulas às necessidades de cada turma. O Entrelinha oferece a docentes da educação básica um espaço para registrar perfis de turmas e adaptar o conteúdo-base ao contexto de seus estudantes. O fluxo de criação tem três passos curtos e termina em um editor no qual a decisão permanece com o professor. Na Sprint 2, a IA propõe abertura, desenvolvimento e fechamento a partir do conteúdo, do objetivo e do perfil da turma, sempre sujeitos à revisão docente.

## Executar

Requisitos: Node.js 20.9 ou superior e npm.

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Para gerar a versão estática, use `npm run build`; os arquivos ficam em `out/`. Publique essa pasta em uma hospedagem de arquivos estáticos para apresentar a URL na review.

Para a sugestão por IA, copie `.env.example` para `.env.local` e configure `NEXT_PUBLIC_API_URL` com a URL pública da API (ou `http://localhost:8000` durante o desenvolvimento local). A chave `GEMINI_API_KEY` permanece somente no backend/Render.

## Estrutura

- `src/app`: página, layout e estilos.
- `src/components/ui`: botão, campo e cartão reutilizáveis.
- `src/components/workspace`: dashboard, turmas, fluxo guiado, editor e histórico.
- `src/data/workspaceMock.ts`: turmas e planos demonstrativos.
- `src/types/workspace.ts`: formatos compartilhados pela interface.

## Limites desta sprint

Os perfis de turma e os planos permanecem apenas nesta sessão; recarregar a página restaura os dados demonstrativos. A criação de planos consulta a API da Sprint 2, mas o editor usa campos de texto simples e a decisão final permanece com o docente. Não há autenticação nem banco de dados nesta etapa.
