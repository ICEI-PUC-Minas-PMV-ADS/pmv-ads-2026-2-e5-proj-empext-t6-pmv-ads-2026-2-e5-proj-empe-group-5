# Planos de Testes de Software

Apresente os casos de testes utilizados na realização da verificação e validação da aplicação. Escolha cenários de testes que demonstrem os requisitos sendo satisfeitos bem como o tratamento de erros (robustez da aplicação).

### Tipo de Teste
- **Sucesso**: Tem o objetivo de verificar se as funcionalidades funcionam corretamente.
- **Insucesso**: Tem o objetivo de verificar se o sistema trata erros de maneira correta.

### ETAPA 1

####  Caso de Teste de Sucesso
#### CT-001-S — Cadastro e login do usuario 

| Campo | Descrição |
|---|---|
| **Descrição** | O objetivo deste plano de teste é verificar se a funcionalidade de login e cadastro está operando corretamente, garantindo que os usuários consigam acessar o sistema de maneira segura, eficiente e intuitiva.|
| **Responsável Caso de Teste** | Fernando Cardoso |
| **Tipo do Teste** | Sucesso |
| **Requisitos associados** | O plano de teste tem como finalidade assegurar a qualidade, a segurança e a confiabilidade da funcionalidade de login.. |
| **Passos** | 1. Abrir a página de login.<br> Informar um e-mail cadastrado.<br>Digitar a senha correta.<br>Clicar no botão "Entrar".<br>Verificar a página apresentada.<br>
| **Dados de teste** | - Token de Autenticação: Token JWT válido salvo no localStorage (@crm:token)<br>- Utilizador: admin@empresa.com<br>- Dados na Base de Dados: Múltiplas OS com status CONCLUIDO, EM_ANDAMENTO e clientes ativos.<br> |
| **Critérios de êxito** | O sistema deve autenticar o usuário e redirecioná-lo para a página correspondente ao seu perfil.|

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

####  Caso de Teste de Sucesso

#### CT-001-S — Visualização e Carregamento de Métricas na Dashboard

| Campo | Descrição |
|---|---|
| **Descrição** | Este caso de teste verifica se a página Dashboard carrega e exibe corretamente os indicadores gerais e a lista de serviços recentes ao aceder com um utilizador autenticado. |
| **Responsável Caso de Teste** | Nicolas Oliveira |
| **Tipo do Teste** | Sucesso |
| **Requisitos associados** | RF-002: Permitir o cadastro, edição e consulta de clientes. RF-006: Permitir a criação e consulta de ordens de serviço. RNF-003: As principais requisições deverão ser processadas em até 3 segundos. |
| **Passos** | 1. Fazer login no sistema com credenciais válidas. 2. Ser redirecionado ou navegar para a página principal . 3. Aguardar o carregamento das requisições de API .4. Verificar a exibição dos cards informativos e da tabela de agendamentos. |
| **Dados de teste** | - Token de Autenticação: Token JWT válido salvo no localStorage (@crm:token) - Utilizador: admin@empresa.com - Dados na Base de Dados: Múltiplas OS com status CONCLUIDO, EM_ANDAMENTO e clientes ativos. |
| **Critérios de êxito** | O sistema deve responder com status 200 OK na API, remover os estados de carregamento (...) e exibir os contadores atualizados e a lista dos próximos serviços sem erros na consola. |

#### CT-003-S — Visualização de Alertas e Manutenções Preventivas nas Notificações

| Campo | Descrição |
|---|---|
| **Descrição** | Este caso de teste verifica se a Central de Notificações lista corretamente as ordens de serviço pendentes/em andamento e gera os alertas de preventiva para clientes com mais de 6 meses sem revisão. |
| **Responsável Caso de Teste** | Nicolas Oliveira |
| **Tipo do Teste** | Sucesso |
| **Requisitos associados** | RF-005: Permitir o registro das manutenções realizadas nos equipamentos. RF-008: Permitir o agendamento de atendimentos para clientes. |
| **Passos** | 1. Fazer login no sistema com credenciais válidas. 2. Clicar no item "Notificações" no menu lateral. 3. Aguardar a resposta da requisição de API . 4. Verificar a exibição dos cards de serviços pendentes e da tabela de oportunidades de manutenção preventiva. |
| **Dados de teste** |- Token de Autenticação: Token JWT válido salvo no localStorage (@crm:token) - Cliente de Teste: Cliente com última revisão realizada há mais de 180 dias (>6 meses). - Ordens de Serviço: Registros gravados com status PENDENTE e EM_ANDAMENTO. |
| **Critérios de êxito** | O servidor deve responder com status 200 OK na API e a interface deve renderizar os cards das ordens ativas e destacar os clientes em atraso com a badge "Revisão Recomendada" e os dados de contacto. |

### Caso de Teste 1: Registo, Edição e Exclusão de Clientes 

| Campo | Descrição |
| --- | --- |
| **Descrição** | Este caso de teste verifica se o utilizador consegue registar um novo cliente, editar os seus dados existentes e eliminar o registo com sucesso na interface. |
| **Responsável Caso de Teste** | Júlia Gonçalves |
| **Tipo do Teste** | Sucesso |
| **Passos** | 1. Fazer login no sistema e aceder à página de Registo de Clientes.<br>2. Preencher o formulário com dados válidos (Nome, Email, Telefone, Endereço, CPF/CNPJ) e clicar em "Salvar".<br>3. Localizar o cliente na lista e clicar no botão de edição (✏️), alterar o telefone e guardar.<br>4. Clicar no botão de eliminação (🗑️) e confirmar a exclusão. |
| **Dados de teste** | - **Novo Cliente:** Nome: "Empresa Exemplo", Email: "contacto@exemplo.com", Telefone: "31999998888", CPF/CNPJ: "12.345.678/0001-90".<br>- **Edição:** Telefone alterado para "31988887777". |
| **Critérios de êxito** | O sistema deve responder com status 201 Created no registo, 200 OK na atualização e 204 No Content na eliminação, atualizando a lista na interface em tempo real e sem erros na consola. |

####  Caso de Teste de Insucesso

#### CT-002-I — Falha de Conexão no Carregamento da Dashboard

| Campo | Descrição |
|---|---|
| **Descrição** | Este caso de teste verifica se o sistema trata adequadamente uma falha de conexão ou erro interno no servidor (500) ao tentar carregar os dados da Dashboard sem travar a interface. |
| **Responsável Caso de Teste** | Nicolas Oliveira |
| **Tipo do Teste** | Insucesso |
| **Requisitos associados** | RNF-002: O sistema deverá apresentar uma interface simples e de fácil utilização. RNF-004: O sistema deverá exigir autenticação para acesso às informações internas. |
| **Passos** | 1. Estar autenticado na aplicação com um token válido. 2. Simular uma interrupção na conexão com o banco de dados PostgreSQL ou servidor. 3. Acessar ou recarregar a página da Dashboard . 4. Analisar a resposta das requisições e a interface apresentada.|
| **Dados de teste** |- Estado da API: Indisponível / Erro interno de conexão. - Resposta esperada da API: Status 500 Internal Server Error. |
| **Critérios de êxito** | A aplicação deve capturar a exceção, exibir uma mensagem de erro amigável na interface ("Não foi possível conectar ao servidor.") e manter o layout estável sem exceções não tratadas na tela. |

#### CT-004-I — Bloqueio de Acesso às Notificações sem Autenticação Válida

| Campo | Descrição |
|---|---|
| **Descrição** | Este caso de teste verifica se o sistema bloqueia o acesso à Central de Notificações e redireciona o utilizador para a página de login quando o token JWT estiver expirado, inválido ou ausente. |
| **Responsável Caso de Teste** | Nicolas Oliveira |
| **Tipo do Teste** | Insucesso |
| **Requisitos associados** | RF-001: Permitir que o usuário realize login no sistema. RNF-004: O sistema deverá exigir autenticação para acesso às informações internas. |
| **Passos** | 1. Inserir um token inválido, expirado ou remover a chave @crm:token do localStorage. 2. Tentar aceder diretamente ao endereço da Central de Notificações. 3. Observar a resposta das requisições de API e o comportamento do roteamento.|
| **Dados de teste** |- Token de Autenticação: Ausente / Token expirado (Bearer token_invalido_123) - Resposta esperada da API: Status 401 Unauthorized ou 403 Forbidden. |
| **Critérios de êxito** |O sistema deve interceptar a requisição, remover o token inválido do localStorage (caso exista), negar a exibição das informações internas e redirecionar imediatamente o utilizador para a tela de Login (/login).|


### Caso de Teste 2: Tentativa de Registo com CPF/CNPJ Duplicado (Insucesso)

| Campo | Descrição |
| --- | --- |
| **Descrição** | Este caso de teste verifica se o sistema impede o registo de um cliente cujo CPF/CNPJ já se encontra registado na base de dados, exibindo o tratamento de erro adequado. |
| **Responsável Caso de Teste** | Júlia Gonçalves |
| **Tipo do Teste** | Insucesso |
| **Passos** | 1. Aceder à página de Registo de Clientes.<br>2. Preencher o formulário inserindo um CPF/CNPJ que já pertença a um cliente existente no sistema.<br>3. Clicar no botão "Salvar".<br>4. Analisar a resposta da API e a mensagem exibida na interface. |
| **Dados de teste** | - **Cliente Existente:** CPF/CNPJ "12.345.678/0001-90".<br>- **Resposta Esperada da API:** Status 400 Bad Request com a mensagem `{"error": "CPF/CNPJ já cadastrado."}`. |
| **Critérios de êxito** | O sistema deve bloquear a inserção na base de dados, retornar o status 400 Bad Request e exibir uma mensagem amigável na interface notificando o utilizador sobre o conflito. |


### ETAPA 4
Criar casos de teste da etapa 4
