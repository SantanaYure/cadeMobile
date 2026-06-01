# GUIA DE DESIGN DO CADÊ?

Este documento define as decisões visuais do app Cadê?.
Antes de criar ou alterar telas, componentes, cores, fontes, espaçamentos, cards, botões ou estados visuais, siga este guia.

## Princípio geral

O Cadê? deve parecer simples, confiável e organizado.

A interface deve transmitir que o usuário está no controle, enquanto a IA atua como assistente que analisa, sugere e ajuda a evitar bagunça, duplicatas e perda de tempo.

## Ícones

Biblioteca:

```txt
React Native Vector Icons
```

Uso recomendado:

* Arquivos
* Pastas
* Busca
* Categorias
* Filtros
* Sugestões da IA
* Alertas de duplicidade
* Ações como editar, mover, renomear e excluir

## Paleta de cores

```txt
#FEFEFE
Fundo principal

#511E01
Texto principal e elementos de maior contraste

#FED809
Destaques, botões principais e chamadas de ação

#D3E601
Status positivo, sugestões da IA e confirmações

#E5E2DC
Cor neutra para bordas, divisores, cards suaves, inputs e fundos secundários

#7A6F66
Texto secundário, legendas e informações de menor destaque

#D92D20
Erros, exclusão e ações perigosas

#F79009
Avisos, atenção e possíveis conflitos

#12B76A
Sucesso, confirmação e ações concluídas
```

## Fontes

### Inter

Usada em:

* Títulos
* Botões
* Menus
* Labels
* Cards de arquivos
* Categorias
* Busca

### Nunito Sans

Usada em:

* Textos de apoio
* Descrições
* Estados vazios
* Mensagens da IA
* Explicações curtas

## Tipografia

### Inter

* Título principal: 28px, Bold
* Título de seção: 22px, SemiBold
* Título de card: 16px, SemiBold
* Botões: 15px, SemiBold
* Labels e filtros: 14px, Medium

### Nunito Sans

* Texto comum: 15px, Regular
* Texto de apoio: 14px, Regular
* Descrições da IA: 14px, Regular
* Estados vazios: 16px, Regular
* Legendas: 12px, Regular

## Espaçamentos

Usar escala simples:

* 4px: ajustes pequenos
* 8px: distância entre ícone e texto
* 12px: espaçamento interno compacto
* 16px: padrão entre elementos
* 24px: separação entre seções
* 32px: respiro entre blocos grandes

## Grid e layout

* Margem lateral padrão: 16px
* Espaço entre cards: 12px
* Espaço entre seções: 24px
* Altura mínima de botão: 48px
* Altura do input de busca: 48px
* Área clicável mínima: 44px
* Conteúdo principal deve evitar excesso de informação na primeira tela

## Bordas

* Cards de arquivos: 16px
* Botões: 12px
* Inputs de busca: 14px
* Chips de categoria: 999px
* Modais: 20px

## Componentes principais

### Card de arquivo

Deve mostrar:

* Ícone do tipo de arquivo
* Nome do arquivo
* Categoria
* Data de atualização
* Status da IA, quando existir
* Alerta de possível duplicata, se houver

### Busca

A busca deve ser o elemento mais importante da tela inicial.

Placeholder:

```txt
Buscar arquivos, categorias ou sugestões da IA
```

### Chips de categoria

Categorias iniciais:

* Todos
* Trabalho
* Acadêmico
* Pessoal
* Financeiro
* Documentos
* Imagens
* Duplicados
* Sugestões da IA

## Botões

### Botão primário

* Fundo: `#FED809`
* Texto: `#511E01`
* Altura mínima: 48px
* Borda: 12px
* Fonte: Inter SemiBold

### Botão secundário

* Fundo: `#FEFEFE`
* Texto: `#511E01`
* Borda: `#E5E2DC`

### Botão perigoso

* Usar `#D92D20`
* Sempre exigir confirmação antes da ação

## Estados visuais

### Vazio

```txt
Nenhum arquivo encontrado por aqui.
```

Complemento:

```txt
Selecione uma pasta para começar a organizar seus arquivos.
```

### Carregando

Usar skeleton em cards, não apenas spinner.

### Erro

```txt
Não foi possível analisar esta pasta. Tente novamente.
```

### Aviso

```txt
Encontramos arquivos com nomes muito parecidos.
```

### Sucesso

```txt
Arquivos analisados com sucesso.
```

### Sugestão da IA

Usar destaque com `#D3E601`, mas em fundo suave.

## Padrão de ações

Renomear, mover e excluir sempre precisam de confirmação.

Sugestões da IA nunca devem ser aplicadas sem revisão do usuário.

A IA pode sugerir:

* Categoria
* Novo nome
* Possível duplicata
* Possível versão mais recente
* Organização por pasta
* Etiquetas

O usuário deve decidir antes de qualquer alteração real nos arquivos.

## Tom visual da IA

A IA deve parecer assistente, não dona da decisão.

Usar frases como:

* Sugestão
* Possível duplicata
* Parece ser um documento financeiro
* Você pode revisar antes de aplicar
* Encontramos arquivos parecidos
* Esta pode ser a versão mais recente

Evitar frases como:

* Arquivo corrigido automaticamente
* Organização concluída sem revisão
* Esse arquivo está errado
* A IA decidiu mover este arquivo

## Hierarquia de informação

Prioridade visual:

1. Nome do arquivo
2. Tipo ou ícone do arquivo
3. Categoria
4. Data de atualização
5. Sugestão da IA
6. Ações disponíveis

## Acessibilidade

* Manter contraste forte entre texto e fundo
* Não depender apenas de cor para indicar erro ou sucesso
* Usar ícone e texto juntos em alertas importantes
* Garantir área clicável confortável
* Evitar textos pequenos demais
* Manter botões principais com pelo menos 48px de altura
