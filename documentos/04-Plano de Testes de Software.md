# Planos de Testes de Software

Apresente os casos de testes utilizados na realização da verificação e validação da aplicação. Escolha cenários de testes que demonstrem os requisitos sendo satisfeitos bem como o tratamento de erros (robustez da aplicação).

### Tipo de Teste
- **Sucesso**: Tem o objetivo de verificar se as funcionalidades funcionam corretamente.
- **Insucesso**: Tem o objetivo de verificar se o sistema trata erros de maneira correta.

### ETAPA 2

####  Caso de Teste de Sucesso
#### CT-002-S — Visualização e Carregamento de Métricas na Dashboard

| Campo | Descrição |
|---|---|
| **Descrição** | Este caso de teste verifica se a página Dashboard carrega e exibe corretamente os indicadores gerais e os agendamentos ao aceder com um utilizador autenticado.|
| **Responsável Caso de Teste** | Nicolas Oliveira |
| **Tipo do Teste** | Sucesso |
| **Requisitos associados** | RF-002: O sistema deve exibir um painel com o resumo de indicadores (clientes, OS, agendamentos) e lista de serviços recentes. |
| **Passos** | 1. Fazer login no sistema com credenciais válidas.<br>2. Ser redirecionado ou navegar para a página principal (Dashboard /).<br>3. Aguardar o carregamento das requisições de API (/api/dashboard/stats).<br>4. Verificar a exibição dos cards informativos e da tabela de agendamentos.<br>|
| **Dados de teste** | - Token de Autenticação: Token JWT válido salvo no localStorage (@crm:token)<br>- Utilizador: admin@empresa.com<br>- Dados na Base de Dados: Múltiplas OS com status CONCLUIDO, EM_ANDAMENTO e clientes ativos.<br> |
| **Critérios de êxito** | O sistema deve responder com status 200 OK na API, remover os estados de carregamento (...) e exibir os contadores atualizados e a lista dos próximos serviços sem erros no consola.|

#### CT-005-S — Cadastro de novo agendamento

| Campo | Descrição |
|---|---|
| **Descrição** | Verificar se o sistema permite cadastrar um novo serviço para um cliente em uma data específica. |
| **Responsável Caso de Teste** | Maria Souza |
| **Tipo do Teste** | Sucesso |
| **Requisitos associados** | RF-008: O sistema deve permitir o agendamento de atendimentos para clientes. |
| **Passos** | 1. Acessar a Agenda.<br>2. Selecionar uma data.<br>3. Informar o cliente.<br>4. Informar o serviço a ser realizado.<br>5. Informar o horário.<br>6. Selecionar o técnico responsável.<br>7. Informar o endereço.<br>8. Adicionar observações, quando necessário.<br>9. Clicar em "Salvar agendamento". |
| **Dados de teste** | Cliente: Hospital Central.<br>Serviço: Troca do filtro do ar-condicionado.<br>Horário: 08:30.<br>Técnico: Carlos Silva.<br>Endereço: Av. Central, 250. |
| **Critérios de êxito** | O sistema deve salvar o agendamento e exibir o cliente e o serviço na data selecionada. |

####  Caso de Teste de Insucesso

#### CT-003-I — Acesso não autorizado à Dashboard sem Token JWT

| Campo | Descrição |
|---|---|
| **Descrição** | Este caso de teste verifica se o sistema bloqueia o carregamento dos dados da Dashboard quando o utilizador tenta aceder à página sem estar autenticado. |
| **Responsável Caso de Teste** | Nicolas Oliveira |
| **Tipo do Teste** | Insucesso |
| **Requisitos associados** | RF-001: O sistema deve proteger as rotas internas e exigir autenticação JWT válida. |
| **Passos** | 1. Abrir o navegador em modo anónimo (sem token no localStorage).<br>2. Aceder diretamente ao endereço da Dashboard (http://localhost:5173/).<br>3. Observar a resposta das requisições e a interface da página.<br> |
| **Dados de teste** | C- Token de Autenticação: Ausente / Indefinido (undefined). |
| **Critérios de êxito** |O servidor deve responder com o código 401 Unauthorized, os dados não devem ser exibidos e o utilizador deve ser redirecionado para a tela de Login. |

#### CT-007-I — Cadastro de agendamento sem preencher campos obrigatórios

| Campo | Descrição |
|---|---|
| **Descrição** | Verificar se o sistema impede o cadastro quando informações obrigatórias não são preenchidas. |
| **Responsável Caso de Teste** | Maria Souza |
| **Tipo do Teste** | Insucesso |
| **Requisitos associados** | RF-008: O sistema deve permitir o agendamento de atendimentos para clientes. |
| **Passos** | 1. Acessar a Agenda.<br>2. Selecionar uma data.<br>3. Não informar um ou mais campos obrigatórios.<br>4. Clicar em "Salvar agendamento". |
| **Dados de teste** | Cliente, serviço, horário ou técnico não informado. |
| **Critérios de êxito** | O sistema não deve salvar o agendamento e deve indicar que os campos obrigatórios precisam ser preenchidos. |

### ETAPA 3
Criar casos de teste da etapa 3

### ETAPA 4
Criar casos de teste da etapa 4
