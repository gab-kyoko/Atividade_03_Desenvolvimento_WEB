# Adapta — Sprint 1

Projeto de Ana Luiza e Gabrielle Kyoko.

O uso obrigatório do RCO e de materiais padronizados pode deixar pouco espaço para adequar aulas às necessidades de cada turma. O Adapta oferece a docentes da educação básica um espaço para registrar perfis de turmas e adaptar o conteúdo-base ao contexto de seus estudantes. O fluxo de criação tem três passos curtos e termina em um editor no qual a decisão permanece com o professor. Nesta Sprint 1, o frontend em Next.js usa dados demonstrativos e mantém alterações apenas durante a sessão. A geração e a regeneração de seções são simulações claramente identificadas. Na Sprint 2, a IA deverá propor caminhos a partir do conteúdo, do objetivo e do perfil da turma, sujeitos à revisão docente.

## Executar

Requisitos: Node.js 20.9 ou superior e npm.

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Para gerar a versão estática, use `npm run build`; os arquivos ficam em `out/`. Publique essa pasta em uma hospedagem de arquivos estáticos para apresentar a URL na review.

## Estrutura

- `src/app`: página, layout e estilos.
- `src/components/ui`: botão, campo e cartão reutilizáveis.
- `src/components/workspace`: dashboard, turmas, fluxo guiado, editor e histórico.
- `src/data/workspaceMock.ts`: turmas e planos demonstrativos.
- `src/types/workspace.ts`: formatos compartilhados pela interface.

## Limites desta sprint

O protótipo não usa API, autenticação ou banco de dados. Recarregar a página restaura os dados demonstrativos. A sugestão é montada localmente a partir de um modelo e não consulta IA real. O editor usa campos de texto simples nesta etapa; um editor rico pode ser incorporado depois que o fluxo principal estiver validado. Essas integrações pertencem às próximas sprints.
