# SkinScan
## Documento de Especificação de Requisitos

**Versão:** 1.0  
**Data:** Junho de 2026  
**Status:** Em elaboração  

**Equipe de Desenvolvimento:**  
Victor Hugo Lucio Martins Dos Santos  
Alexandre Martins da Costa  
Emerson de Sousa Amorim  

---

## Histórico de Revisões do Documento

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | Junho/2026 | Equipe SkinScan | Versão inicial do documento de requisitos |

---

## 1. Introdução

### 1.1. Propósito do Documento de Requisitos

Este documento tem o objetivo de detalhar os requisitos dos usuários que deverão ser atendidos pelo sistema a ser construído no projeto SkinScan. Ele servirá como base para a construção do sistema por parte dos desenvolvedores e como referência para validação do produto final.

Aqui está presente uma descrição detalhada das funções do produto, de suas interfaces, do comportamento esperado do sistema, das regras de negócio envolvidas e das restrições técnicas e de ambiente identificadas na fase de levantamento de requisitos.

### 1.2. Público-Alvo do Documento

Este documento se destina à equipe de desenvolvimento do projeto SkinScan — Victor Hugo Lucio Martins Dos Santos, Alexandre Martins da Costa e Emerson de Sousa Amorim — e ao professor orientador da disciplina. Poderá também ser utilizado como referência por outros stakeholders envolvidos no projeto.

### 1.3. Definições, Acrônimos e Abreviações

- **Astra DB** – banco de dados NoSQL baseado em Apache Cassandra, oferecido como serviço em nuvem pela DataStax, utilizado para armazenamento dos dados do sistema.
- **IA** – Inteligência Artificial: conjunto de técnicas computacionais que permitem ao sistema aprender a identificar padrões a partir de dados.
- **LGPD** – Lei Geral de Proteção de Dados (Lei nº 13.709/2018): legislação brasileira que regulamenta o tratamento de dados pessoais.
- **Python** – linguagem de programação utilizada no desenvolvimento do back-end do sistema.
- **React** – biblioteca JavaScript utilizada no desenvolvimento do front-end do sistema.
- **RF** – Requisito Funcional: define o que o sistema deve fazer.
- **RNF** – Requisito Não Funcional: define como o sistema deve se comportar.
- **RN** – Regra de Negócio: define condições, restrições e validações que o sistema deve respeitar.
- **UC** – Caso de Uso: descreve uma interação entre um ator e o sistema para atingir um objetivo.
- **Visão Computacional** – subcampo da IA voltado ao processamento e interpretação de imagens por sistemas computacionais.

---

## 2. Descrição Geral do Produto

### 2.1. Situação Atual

Atualmente, pessoas que apresentam lesões de pele, queimaduras ou picadas de insetos e animais muitas vezes não conseguem identificar rapidamente a possível causa ou gravidade de sua condição. Em grande parte dos casos, o caminho disponível é aguardar uma consulta médica, que pode demorar dias ou semanas dependendo da localização e das condições de acesso ao sistema de saúde.

Isso é ainda mais crítico em regiões do interior do Brasil, onde o acesso a dermatologistas é escasso, e em situações envolvendo animais peçonhentos nativos da fauna brasileira, como aranhas, escorpiões e cobras, nas quais a identificação rápida da causa pode ser determinante para o atendimento correto.

Profissionais de saúde menos especializados, como agentes comunitários de saúde e técnicos de enfermagem, frequentemente realizam triagem sem ferramentas de apoio à decisão que os auxiliem na identificação preliminar de condições dermatológicas.

### 2.2. Objetivos do Produto

O SkinScan é um aplicativo móvel que utiliza técnicas de Inteligência Artificial e Visão Computacional para auxiliar na identificação preliminar de lesões, alterações cutâneas, queimaduras e possíveis picadas de insetos ou animais peçonhentos. A interação com o sistema ocorre por meio de uma interface de chat, na qual o usuário pode enviar imagens e informações textuais para obter uma análise orientativa.

O sistema tem como objetivos:

- Auxiliar usuários leigos e profissionais menos especializados na compreensão inicial de lesões cutâneas;
- Fornecer análise preliminar com hipótese principal, visão geral da condição, gravidade, orientações de primeiros socorros e especialidade médica indicada;
- Utilizar as informações de perfil do usuário como contexto adicional para enriquecer as análises;
- Alertar o usuário sobre situações que demandem atendimento médico urgente;
- Funcionar como ferramenta de apoio à triagem em contextos com acesso limitado a especialistas;
- Incentivar sempre a busca por avaliação médica profissional.

### 2.3. Benefícios do Projeto

O desenvolvimento do SkinScan trará os seguintes benefícios:

- Acesso rápido e facilitado a uma análise preliminar de lesões de pele, independentemente da localização geográfica do usuário;
- Apoio à tomada de decisão de profissionais de saúde menos experientes em processos de triagem;
- Redução do tempo entre o surgimento do sintoma e o encaminhamento ao atendimento médico adequado;
- Ferramenta especialmente relevante para o contexto brasileiro, dado o contato frequente da população com animais peçonhentos nativos;
- Interface acessível no formato de chat, familiar ao usuário moderno, sem necessidade de conhecimento técnico para utilização.

### 2.4. Escopo

O projeto trata-se da criação de um aplicativo móvel para dispositivos Android e iOS, com back-end em Python, front-end em React e banco de dados Astra DB. O escopo do SkinScan envolve as seguintes macro-funcionalidades:

| Nº | Módulo/Funcionalidade | Descrição |
|----|----------------------|-----------|
| 1 | Login e Cadastro | Tela inicial do app com opções de login e cadastro. O fluxo de obrigatoriedade do login ainda está sendo definido pela equipe. |
| 2 | Chat de Análise | Interface principal do app, no formato de chat. O usuário pode enviar mensagens de texto, capturar fotos pela câmera ou selecionar imagens da galeria para análise. |
| 3 | Análise por Inteligência Artificial | Processamento da imagem e do contexto informado pelo usuário via IA, com retorno da hipótese principal, visão geral da condição, gravidade, primeiros socorros e especialidade médica indicada. |
| 4 | Aviso de Limitação do Sistema | Exibição obrigatória de aviso ao final de cada análise informando que o sistema não fornece diagnóstico definitivo e não substitui avaliação médica profissional. |
| 5 | Perfil do Usuário | Aba onde o usuário pode cadastrar informações pessoais (nome, idade, localização/região, histórico de alergias, condições de saúde pré-existentes e medicamentos em uso) para auxiliar a IA na análise. |
| 6 | Histórico de Análises | O sistema salva o histórico de conversas e análises realizadas pelo usuário, permitindo consulta posterior. |
| 7 | Identificação de Picadas | Identificação de possíveis picadas de insetos ou animais peçonhentos com base em padrões visuais e banco de dados de lesões catalogadas. *(Funcionalidade secundária)* |

### 2.5. Atores

| Nº | Ator | Definição e Responsabilidades |
|----|------|-------------------------------|
| 1 | Usuário | Pessoa que utiliza o aplicativo para obter análises preliminares de lesões de pele. Pode ser qualquer indivíduo do público-alvo definido: população em geral, estudantes da área da saúde, técnicos de enfermagem, enfermeiros, agentes comunitários de saúde ou médicos. Não há diferenciação de perfil de acesso entre esses grupos. |
| 2 | Administrador | Responsável pela manutenção técnica do sistema. Gerencia usuários, atualiza a base de dados utilizada pela IA e monitora o funcionamento geral da aplicação. |
| 3 | Sistema de Inteligência Artificial | Componente interno responsável pelo processamento das imagens e contexto enviados pelo usuário via chat. Identifica padrões, retorna hipóteses, calcula nível de gravidade e sugere conduta inicial. |

### 2.6. Premissas

- O médico é e permanecerá sendo a palavra final no diagnóstico de qualquer condição dermatológica identificada pelo sistema.
- O fluxo de obrigatoriedade do login/cadastro ainda está sendo definido pela equipe de desenvolvimento.
- As informações registradas no perfil do usuário serão utilizadas como contexto adicional pela IA, quando disponíveis, mas seu preenchimento é opcional.
- O histórico de análises será salvo automaticamente para cada usuário autenticado.
- O processamento das análises será realizado em ambiente de nuvem, dependendo de conexão à internet.
- A identificação de picadas de animais peçonhentos será tratada como funcionalidade secundária, podendo ser entregue em versão posterior do sistema.
- Será adotada metodologia de desenvolvimento adequada ao contexto acadêmico e ao prazo disponível.

### 2.7. Itens Fora do Escopo

- Realização de diagnóstico médico definitivo de qualquer natureza;
- Prescrição de medicamentos ou emissão de receitas médicas;
- Emissão de laudos médicos oficiais;
- Realização de teleconsulta ou videochamada com profissionais de saúde;
- Integração com sistemas de hospitais, clínicas ou prontuários eletrônicos na versão inicial;
- Diferenciação de funcionalidades por perfil de usuário (leigo vs. profissional);
- Suporte a idiomas além do português brasileiro na versão inicial;
- Testes específicos de carga, estresse e desempenho em larga escala.

---

## 3. Requisitos Específicos

### 3.1. Requisitos Funcionais

Os requisitos funcionais definem o comportamento perceptível do sistema pelos usuários, incluindo telas, fluxo de chat, análise por IA e funcionalidades de perfil e histórico.

| ID | Descrição |
|----|-----------|
| RF 01 | O sistema deverá exibir uma tela de login com opções de acesso por conta existente ou novo cadastro. |
| RF 02 | O sistema deverá permitir o cadastro de novos usuários mediante informação de nome, e-mail, data de nascimento e senha. |
| RF 03 | O sistema deverá permitir autenticação de usuários previamente cadastrados. |
| RF 04 | O sistema deverá disponibilizar uma interface de chat como tela principal de interação do usuário com o aplicativo. |
| RF 05 | O sistema deverá permitir o envio de imagens pelo chat, capturadas diretamente pela câmera do dispositivo ou selecionadas da galeria. |
| RF 06 | O sistema deverá processar as imagens e o contexto textual enviados pelo usuário utilizando técnicas de Inteligência Artificial. |
| RF 07 | O sistema deverá apresentar, como resultado da análise: a hipótese principal identificada, uma visão geral da condição, informações de primeiros socorros, a gravidade da situação e a especialidade médica indicada para o caso. |
| RF 08 | O sistema deverá exibir, ao final de cada análise, um aviso destacado informando que o resultado não representa diagnóstico definitivo e não substitui avaliação médica profissional. |
| RF 09 | O sistema deverá apresentar o percentual de confiança associado ao resultado da análise. |
| RF 10 | O sistema deverá emitir alerta ao usuário quando forem identificados sinais de possível gravidade ou urgência médica. |
| RF 11 | O sistema deverá salvar o histórico de conversas e análises realizadas pelo usuário para consulta posterior. |
| RF 12 | O sistema deverá disponibilizar uma aba de perfil onde o usuário pode registrar: nome, idade, localização/região, histórico de alergias, condições de saúde pré-existentes e medicamentos em uso. |
| RF 13 | O sistema deverá utilizar as informações do perfil do usuário como contexto adicional para a análise realizada pela IA. |
| RF 14 | O sistema deverá exigir o aceite do termo de responsabilidade antes de permitir o uso do aplicativo. |
| RF 15 | O sistema deverá ser capaz de identificar possíveis picadas de insetos ou animais peçonhentos com base em padrões visuais e banco de dados de lesões catalogadas. *(Funcionalidade secundária)* |
| RF 16 | O sistema deverá permitir que administradores atualizem a base de dados de imagens e lesões utilizada pela aplicação. |

### 3.2. Requisitos Não Funcionais

Os requisitos não funcionais definem parâmetros de funcionamento do sistema que influenciam a experiência do usuário sem serem diretamente acionados por ele, como desempenho, segurança, usabilidade e a pilha tecnológica adotada.

| ID | Descrição | Categoria |
|----|-----------|-----------|
| RNF 01 | O sistema deverá possuir interface simples, intuitiva e acessível para usuários sem conhecimento técnico na área da saúde ou de tecnologia. | Usabilidade |
| RNF 02 | O sistema deverá funcionar em dispositivos com sistemas operacionais Android e iOS. | Compatibilidade |
| RNF 03 | As credenciais dos usuários deverão ser armazenadas de forma segura e criptografada. | Segurança |
| RNF 04 | Os dados pessoais e imagens tratados pelo sistema deverão respeitar os princípios da Lei Geral de Proteção de Dados (LGPD). | Privacidade |
| RNF 05 | O sistema deverá apresentar o resultado da análise em tempo adequado para uso cotidiano, evitando esperas que comprometam a experiência do usuário. | Performance |
| RNF 06 | Funcionalidades básicas do aplicativo deverão permanecer acessíveis mesmo em situações de conectividade limitada ou intermitente, sempre que tecnicamente viável. | Disponibilidade |
| RNF 07 | O sistema deverá informar de forma clara e destacada que os resultados apresentados possuem caráter orientativo e não substituem avaliação médica profissional. | Confiabilidade |
| RNF 08 | O back-end do sistema será desenvolvido em Python e o front-end em React. O banco de dados utilizado será o Astra DB. | Padrões |
| RNF 09 | O aplicativo deverá ser desenvolvido utilizando tecnologias que permitam manutenção e atualização contínua dos modelos de IA sem necessidade de nova publicação nas lojas de aplicativos. | Manutenibilidade |

### 3.3. Regras de Negócio

As regras de negócio descrevem as condições, restrições e validações que o sistema deve respeitar para que seu funcionamento esteja alinhado com os objetivos do projeto e com as responsabilidades éticas e legais envolvidas.

| ID | Nome | Descrição |
|----|------|-----------|
| RN 01 | Aceite Obrigatório | O usuário deverá aceitar o termo de responsabilidade antes de utilizar qualquer funcionalidade do sistema. Sem o aceite, o acesso às análises não será liberado. |
| RN 02 | Diagnóstico Não Definitivo | Nenhum resultado apresentado pelo sistema poderá ser descrito como diagnóstico médico definitivo. Toda saída de análise deverá ser acompanhada de aviso sobre seu caráter orientativo. |
| RN 03 | Exibição de Confiabilidade | Toda análise deverá apresentar obrigatoriamente um percentual de confiança associado ao resultado retornado pelo modelo de IA. |
| RN 04 | Classificação de Risco | Toda análise deverá apresentar obrigatoriamente uma classificação de gravidade, expressa em linguagem compreensível ao público geral. |
| RN 05 | Alerta em Situações Críticas | Quando a análise identificar uma situação potencialmente grave, o sistema deverá exibir alerta de urgência e recomendar explicitamente a busca por atendimento médico imediato. |
| RN 06 | Imagem Obrigatória para Análise | Nenhuma análise dermatológica poderá ser iniciada sem o envio de uma imagem válida. O contexto textual complementar é opcional. |
| RN 07 | Sem Diferenciação de Perfil | Não haverá perfis de acesso distintos para usuários leigos e profissionais da saúde. A interface e os resultados deverão ser adequados a ambos os públicos. |
| RN 08 | Linguagem Acessível | Os resultados e orientações apresentados pelo sistema deverão utilizar linguagem clara e acessível, evitando jargão técnico excessivo, sem prejuízo da precisão das informações. |
| RN 09 | Uso do Perfil como Contexto | As informações registradas no perfil do usuário (alergias, condições pré-existentes, medicamentos, localização) deverão ser utilizadas como contexto adicional pela IA na geração das análises, quando disponíveis. |

### 3.4. Restrições de Hardware

| Nº | Descrição |
|----|-----------|
| 1 | O dispositivo deverá possuir câmera traseira funcional para captura de imagens. |
| 2 | O dispositivo deverá possuir conexão à internet (Wi-Fi ou dados móveis) para envio de imagens e recebimento dos resultados da análise. |
| 3 | O dispositivo deverá ter espaço de armazenamento suficiente para instalação e funcionamento do aplicativo. |

### 3.5. Restrições de Software

| Nº | Descrição |
|----|-----------|
| 1 | O sistema deverá ser compatível com dispositivos Android (versão 8.0 ou superior) e iOS (versão 13 ou superior). |
| 2 | O back-end do sistema será desenvolvido em Python. |
| 3 | O front-end do sistema será desenvolvido em React. |
| 4 | O banco de dados utilizado será o Astra DB. |
| 5 | O processamento das análises por IA será realizado em servidores externos (nuvem). |

### 3.6. Restrições de Ambiente

| Nº | Descrição |
|----|-----------|
| 1 | O aplicativo será disponibilizado nas lojas oficiais Google Play Store (Android) e Apple App Store (iOS). |
| 2 | O ambiente de produção será baseado em infraestrutura de nuvem, garantindo escalabilidade e disponibilidade dos serviços de IA. |

### 3.7. Lista de Riscos

| Nº | Descrição | Mitigação |
|----|-----------|-----------|
| 1 | Dificuldade na obtenção de um banco de imagens dermatológicas de qualidade suficiente para o treinamento do modelo de IA. | Pesquisar datasets públicos disponíveis (ex.: HAM10000, ISIC Archive) e avaliar possibilidade de parceria com instituições de saúde. |
| 2 | Baixa acurácia do modelo de IA em condições adversas de iluminação ou qualidade de imagem. | Implementar validação de qualidade da imagem antes do envio e orientar o usuário sobre boas práticas de captura. |
| 3 | Risco legal relacionado à interpretação errônea dos resultados como diagnóstico médico definitivo. | Exibir avisos claros sobre o caráter orientativo das análises e exigir aceite do termo de responsabilidade. |
| 4 | Curva de aprendizado da equipe nas tecnologias de visão computacional e IA aplicada à saúde. | Dedicar tempo inicial ao estudo das bibliotecas e frameworks disponíveis, com apoio do professor orientador. |
| 5 | Prazo limitado para desenvolvimento de todas as funcionalidades planejadas. | Priorizar as funcionalidades principais (análise dermatológica via chat) e tratar a identificação de picadas como escopo secundário. |

---

## 4. Diagramas UML

> **Nota:** os diagramas UML apresentados neste documento encontram-se descritos de forma textual para fins de especificação e levantamento de requisitos. A modelagem gráfica correspondente será elaborada posteriormente pela equipe utilizando ferramentas apropriadas de modelagem UML.

### 4.1. Identificação dos Casos de Uso

| ID | Caso de Uso | Descrição do Objetivo |
|----|-------------|----------------------|
| UC01 | Aceitar Termo de Responsabilidade | Permite que o usuário leia e aceite o termo antes de utilizar o sistema. |
| UC02 | Realizar Cadastro | Permite que um novo usuário crie uma conta no sistema. |
| UC03 | Realizar Login | Permite que um usuário cadastrado acesse o sistema com suas credenciais. |
| UC04 | Enviar Imagem para Análise | Permite que o usuário capture uma foto pela câmera ou selecione uma imagem da galeria e a envie pelo chat para análise. |
| UC05 | Informar Contexto Textual | Permite que o usuário descreva sintomas, histórico ou outras informações relevantes via chat, complementando a análise da imagem. |
| UC06 | Solicitar Análise | Permite que o usuário dispare o processamento da imagem e do contexto pela IA. |
| UC07 | Visualizar Resultado da Análise | Permite que o usuário visualize a hipótese principal, visão geral da condição, gravidade, primeiros socorros, especialidade médica indicada e aviso de limitação do sistema. |
| UC08 | Receber Alerta de Urgência | Permite que o usuário seja alertado quando a análise identificar sinais de possível gravidade que demandem atendimento imediato. |
| UC09 | Consultar Histórico de Análises | Permite que o usuário acesse análises realizadas anteriormente. |
| UC10 | Gerenciar Perfil | Permite que o usuário cadastre e edite suas informações pessoais de saúde na aba de perfil. |
| UC11 | Atualizar Base de Dados | Permite que o administrador atualize o banco de imagens e dados utilizado pelo modelo de IA. |

### 4.2. Diagrama de Casos de Uso

O diagrama abaixo descreve as interações entre os atores e o sistema. Os atores identificados são: Usuário, Administrador e Sistema de Inteligência Artificial.

**ATOR: Usuário**  
UC01 Aceitar Termo | UC02 Realizar Cadastro | UC03 Realizar Login  
UC04 Enviar Imagem | UC05 Informar Contexto Textual | UC06 Solicitar Análise  
UC07 Visualizar Resultado | UC08 Receber Alerta | UC09 Consultar Histórico | UC10 Gerenciar Perfil  

**ATOR: Administrador**  
UC11 Atualizar Base de Dados  

**ATOR: Sistema de Inteligência Artificial**  
UC06 Processar Análise | UC07 Retornar Resultado | UC08 Gerar Alerta de Urgência  

> *Nota: o diagrama visual (UML) deverá ser elaborado pela equipe com ferramenta gráfica (ex.: draw.io, Lucidchart, Astah).*

### 4.3. Diagrama de Atividades

A tabela abaixo representa o fluxo principal de atividades do sistema, do acesso pelo usuário até a exibição do resultado da análise.

| Passo | Ação | Descrição |
|-------|------|-----------|
| 1 | [INÍCIO] Abrir o aplicativo | O usuário abre o SkinScan no dispositivo móvel. |
| 2 | Exibir tela de login/cadastro | O sistema apresenta as opções de login com conta existente ou criação de nova conta. (Fluxo de obrigatoriedade a definir) |
| 3 | Aceitar Termo de Responsabilidade | O sistema exibe o termo de uso. O usuário deve aceitar para continuar. |
| 4 | Acessar o chat principal | O usuário acessa a interface de chat, tela principal do aplicativo. |
| 5 | Enviar imagem | O usuário captura uma foto pela câmera ou seleciona uma imagem da galeria e a envia pelo chat. |
| 6 | [OPCIONAL] Informar contexto textual | O usuário pode adicionar informações complementares por texto (sintomas, histórico, dúvidas). |
| 7 | Processar análise (IA) | O sistema processa a imagem e o contexto utilizando o modelo de IA. As informações do perfil do usuário, se disponíveis, são utilizadas como contexto adicional. |
| 8 | Exibir resultado | O sistema exibe: hipótese principal, visão geral da condição, gravidade, orientações de primeiros socorros e especialidade médica indicada. |
| 9 | Exibir aviso obrigatório | Ao final do resultado, o sistema exibe o aviso de que a análise não substitui diagnóstico médico profissional. |
| 10 | [CONDICIONAL] Emitir alerta de urgência | Se a análise identificar sinais de gravidade, o sistema emite alerta recomendando atendimento médico imediato. |
| 11 | Salvar conversa no histórico | A análise realizada é salva automaticamente no histórico do usuário. |
| 12 | [FIM] Aguardar nova interação | O usuário pode iniciar uma nova análise, consultar o histórico ou acessar o perfil. |

### 4.4. Diagrama de Classes

A tabela abaixo apresenta as principais classes identificadas no sistema, seus atributos e responsabilidades.

| Classe | Atributos Principais | Métodos / Responsabilidades |
|--------|---------------------|-----------------------------|
| Usuario | id, nome, email, senha, dataNascimento, localizacao, alergias, condicoesSaude, medicamentos | cadastrar(), autenticar(), atualizarPerfil(), consultarHistorico() |
| Analise | id, idUsuario, imagem, contextoTextual, hipotese, percentualConfianca, gravidade, primeirosSocorros, especialidadeIndicada, dataHora | processar(), salvarHistorico(), gerarAlerta() |
| Chat | id, idUsuario, mensagens, dataInicio | enviarMensagem(), enviarImagem(), exibirResultado(), exibirAviso() |
| Mensagem | id, idChat, tipo (texto/imagem), conteudo, dataHora, remetente | exibir() |
| SistemaIA | modelo, versao, baseDados | analisarImagem(), identificarCondicao(), calcularConfianca(), avaliarGravidade() |
| Administrador | id, nome, email, senha | atualizarBaseDados(), gerenciarUsuarios(), monitorarSistema() |

### 4.5. Diagrama de Sequência

A tabela abaixo representa a sequência de interações entre os componentes do sistema durante o fluxo principal de análise.

| Passo | Origem | Destino | Mensagem / Ação |
|-------|--------|---------|-----------------|
| 1 | Usuário | App (Front-end) | Abre o aplicativo e visualiza tela de login/cadastro |
| 2 | Usuário | App (Front-end) | Realiza login ou cria nova conta |
| 3 | App (Front-end) | Back-end (Python) | Envia credenciais para autenticação |
| 4 | Back-end (Python) | Astra DB | Valida credenciais do usuário |
| 5 | Back-end (Python) | App (Front-end) | Retorna confirmação de autenticação |
| 6 | App (Front-end) | Usuário | Exibe termo de responsabilidade |
| 7 | Usuário | App (Front-end) | Aceita o termo e acessa o chat principal |
| 8 | Usuário | App (Front-end) | Envia imagem pelo chat (câmera ou galeria) |
| 9 | App (Front-end) | Back-end (Python) | Envia imagem + contexto textual + dados do perfil do usuário |
| 10 | Back-end (Python) | Sistema de IA | Processa imagem e contexto |
| 11 | Sistema de IA | Back-end (Python) | Retorna hipótese, gravidade, primeiros socorros e especialidade indicada |
| 12 | Back-end (Python) | Astra DB | Salva análise no histórico do usuário |
| 13 | Back-end (Python) | App (Front-end) | Envia resultado da análise |
| 14 | App (Front-end) | Usuário | Exibe resultado + aviso de limitação do sistema |
| 15 | App (Front-end) | Usuário | [Se grave] Exibe alerta de urgência médica |
