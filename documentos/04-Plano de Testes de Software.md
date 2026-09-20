# Planos de Testes de Software

Apresente os casos de testes utilizados na realização da verificação e validação da aplicação. Escolha cenários de testes que demonstrem os requisitos sendo satisfeitos bem como o tratamento de erros (robustez da aplicação).

### Tipo de Teste
- **Sucesso**: Tem o objetivo de verificar se as funcionalidades funcionam corretamente.
- **Insucesso**: Tem o objetivo de verificar se o sistema trata erros de maneira correta.

#### Exemplo de Caso de Teste de Sucesso
O caso de teste de sucesso deve ser identificado por CT - xxx - S

<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - S<br>Login com credenciais válidas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se um usuário pode fazer login com sucesso utilizando credenciais válidas.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">José da Silva</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001: O funcionário deve conseguir logar no aplicativo</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Abrir o aplicativo.<br>
      2. Inserir o CPF válido.<br>
      3. Inserir a senha válida.<br>
      4. Clicar no botão "Entrar".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>CPF:</strong> Colocar CPF cadastrado na base<br>
      - <strong>Senha:</strong> Colocar valor de senha válida
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve redirecionar o usuário para a página inicial do aplicativo após o login bem-sucedido.</td>
  </tr>
</table>

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

#### Exemplo de Caso de Teste de Insucesso
Os casos de testes de insucesso devem ser identificados por CT - xxx - I + sequencial de insucesso.
Para cada etapa do projeto, criar uma seção com o nome da Etapa do projeto: Etapa 2, Etapa 3 e Etapa 4
### ETAPA 2  
<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - I01<br>Login com credenciais inválidas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica o tratamento de credenciais inválidas no login.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">José da Silva</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001: O funcionário não conseguirá logar no aplicativo</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Abrir o aplicativo.<br>
      2. Inserir o CPF válido.<br>
      3. Inserir a senha inválida.<br>
      4. Clicar no botão "Entrar".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>CPF:</strong> Colocar CPF cadastrado na base<br>
      - <strong>Senha:</strong> Colocar senha inválida
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve apresentar a mensagem de login inválido.</td>
  </tr>
</table>

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
