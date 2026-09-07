# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="01-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. 

## Usuários
| Tipo de Usuário   | Descrição | Responsabilidades |
|------------------|-----------|------------------|
| **xxx** | xxxxx | xxxxx |

### Exemplo

| Tipo de Usuário   | Descrição | Responsabilidades |
|------------------|-----------|------------------|
| **Administrador** | Gerencia a aplicação e os usuários. | Gerenciar usuários, configurar o sistema, acessar todos os relatórios. |
| **Funcionário** | Usa a aplicação para suas tarefas principais. | Criar e editar registros, visualizar relatórios. |


## Arquitetura e Tecnologias

Descreva brevemente a arquitetura definida para o projeto e as tecnologias a serem utilizadas. Sugere-se a criação de um diagrama de componentes da solução.

## Project Model Canvas

Deve ser desenvolvido a partir do microfundamento: Empreendedorismo e inovação.
Colocar a imagem do modelo construído apresentando a proposta de solução.

> **Links Úteis**:
> Disponíveis em material de apoio do projeto

## Requisitos

Para definição das prioridades dos requisitos foi utilizada uma adaptação da técnica **MoSCoW**.

Os requisitos classificados como **ALTA** representam funcionalidades essenciais para o funcionamento da primeira versão do sistema.

Os requisitos classificados como **MÉDIA** possuem importância para melhorar a utilização e organização do sistema, mas podem ser implementados após as funcionalidades principais.

Os requisitos classificados como **BAIXA** representam funcionalidades complementares que podem ser desenvolvidas posteriormente caso exista disponibilidade no projeto.

---

## Requisitos Funcionais

| ID         | Descrição do Requisito                                                           | Prioridade | Etapa   | Complexidade |
| ---------- | -------------------------------------------------------------------------------- | ---------- | ------- | ------------ |
| **RF-001** | Permitir que o usuário realize login no sistema.                                 | ALTA       | Etapa 1 | Baixa        |
| **RF-002** | Permitir o cadastro, edição e consulta de clientes.                              | ALTA       | Etapa 1 | Baixa        |
| **RF-003** | Permitir o cadastro de equipamentos vinculados a um cliente.                     | ALTA       | Etapa 1 | Média        |
| **RF-004** | Permitir o registro das instalações realizadas nos equipamentos.                 | ALTA       | Etapa 2 | Média        |
| **RF-005** | Permitir o registro das manutenções realizadas nos equipamentos.                 | ALTA       | Etapa 2 | Média        |
| **RF-006** | Permitir a criação e consulta de ordens de serviço.                              | ALTA       | Etapa 2 | Média        |
| **RF-007** | Permitir a atualização do status de uma ordem de serviço.                        | ALTA       | Etapa 3 | Baixa        |
| **RF-008** | Permitir o agendamento de atendimentos para clientes.                            | ALTA       | Etapa 3 | Média        |
| **RF-009** | Permitir a consulta do histórico de serviços realizados em cada equipamento.     | ALTA       | Etapa 4 | Média        |
| **RF-010** | Permitir pesquisar clientes e equipamentos cadastrados no sistema.               | MÉDIA      | Etapa 4 | Baixa        |
| **RF-011** | Permitir a geração de relatórios dos serviços realizados em determinado período. | MÉDIA      | Etapa 4 | Média        |
| **RF-012** | Permitir ao administrador cadastrar e gerenciar usuários do sistema.             | MÉDIA      | Etapa 5 | Média        |

---

## Requisitos Não Funcionais

| ID          | Descrição do Requisito                                                                                                          | Prioridade |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **RNF-001** | O sistema deverá possuir interface responsiva para utilização em computadores, tablets e dispositivos móveis.                   | ALTA       |
| **RNF-002** | O sistema deverá apresentar uma interface simples e de fácil utilização.                                                        | ALTA       |
| **RNF-003** | As principais requisições realizadas pelo usuário deverão ser processadas em até 3 segundos em condições normais de utilização. | MÉDIA      |
| **RNF-004** | O sistema deverá exigir autenticação para acesso às informações internas.                                                       | ALTA       |
| **RNF-005** | As senhas dos usuários deverão ser armazenadas de maneira segura e protegida.                                                   | ALTA       |
| **RNF-006** | O sistema deverá funcionar nos principais navegadores modernos, como Google Chrome, Microsoft Edge e Mozilla Firefox.           | MÉDIA      |

---

# Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

| ID         | Restrição                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| **RE-001** | O projeto deverá ser desenvolvido e entregue até o final do semestre letivo.                                     |
| **RE-002** | O sistema será desenvolvido inicialmente para atender apenas uma empresa de refrigeração.                        |
| **RE-003** | O desenvolvimento deverá utilizar tecnologias compatíveis com os conhecimentos adquiridos durante o curso.       |
| **RE-004** | A primeira versão do sistema deverá priorizar as funcionalidades essenciais definidas nos requisitos funcionais. |
| **RE-005** | Sempre que possível deverão ser utilizadas ferramentas e serviços gratuitos ou disponíveis para uso acadêmico.   |

## Diagrama de Caso de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

Para mais informações, consulte o microfundamento Engenharia de Requisitos de Software 

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Casos de Uso”.

> **Links Úteis**:
> - [Criando Casos de Uso](https://www.ibm.com/docs/pt-br/elm/6.0?topic=requirements-creating-use-cases)
> - [Como Criar Diagrama de Caso de Uso: Tutorial Passo a Passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)

## Modelo da Base de Dados

# Para banco de dados relacional:
- Apresentar o MER (Modelo Entidade-Relacionamento)
- Apresentar o Projeto Físico da Base de Dados (estrutura das tabelas, tipos de dados, chaves primárias e estrangeiras)
# Para banco de dados NoSQL:
Apresentar o Modelo da Base de Dados (estrutura dos documentos, coleções, ou grafos, conforme o tipo de NoSQL utilizado)

