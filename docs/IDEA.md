# IDEA.md — Visual Hunt

> Referência histórica da ideia original. O contrato atual do produto vive em `docs/prd.md`.
> Diferença relevante: a v1 atual exige autenticação para busca visual, conforme ADR-0002.

## O Problema

Profissionais e entusiastas de OSINT precisam rastrear a origem
de imagens, encontrar variações, identificar rostos ou objetos
e verificar a autenticidade de fotos. Para isso, precisam fazer
busca reversa em múltiplos Image Search Engines (ISEs) — Google
Images, Yandex, TinEye, Bing, etc.

O problema é que cada ISE tem pontos cegos diferentes. Uma imagem
que o Google não encontra, o Yandex acha. Uma que o Yandex censura,
o TinEye rasteia. Hoje o investigador abre 4, 5 abas, repete o
upload em cada uma, e consolida os resultados manualmente. Isso é
lento, repetitivo e quebra o fluxo de investigação.

## Objetivo

Visual Hunt é um bundler de ISEs para busca reversa de imagens.
O usuário faz upload de uma imagem uma única vez e o sistema
dispara a busca em paralelo em todos os ISEs suportados,
consolidando os resultados em uma única interface.

Com isso eu quero poder:
- Fazer upload de uma imagem e receber os resultados de múltiplos
  ISEs consolidados em um só lugar
- Saber em qual ISE cada resultado foi encontrado
- Acompanhar o progresso da busca via polling enquanto os jobs
  processam em background
- Futuramente: filtrar resultados por ISE, similaridade ou data

## Usuário

Investigadores e entusiastas de OSINT que precisam rastrear
a origem ou variações de uma imagem específica. São pessoas
que já conhecem ferramentas como Google Images, Yandex e TinEye
e entendem as limitações de cada uma. O Visual Hunt não precisa
explicar o conceito de busca reversa — ele só precisa ser mais
rápido e completo do que fazer manualmente.

## Contexto e Referências

Ferramentas existentes que fazem algo parecido:
- Search By Image (extensão de browser) — faz uma ISE por vez
- TinEye — especializado, mas só uma fonte
- Karma Decay — apenas Reddit

O diferencial do Visual Hunt é a busca paralela em múltiplos
ISEs e a consolidação dos resultados em uma única tela.

## Como Funciona (Fluxo Principal)

1. Usuário faz upload de uma imagem
2. A imagem é enviada ao Cloudinary (CDN/armazenamento temporário)
3. O servidor recebe a URL pública da imagem e enfileira um job
   de busca para cada ISE suportado
4. Cada job chama a API correspondente usando a URL do Cloudinary
5. O frontend faz polling na task para acompanhar o progresso
6. Conforme os jobs terminam, os resultados são exibidos

## ISEs Suportados

- Google Images via ScrappingDog API (fase inicial)
- Outras ISEs a definir nas próximas versões

## Limites Conhecidos

- Rate limit assumido: 10 req/s nas APIs externas
- Os resultados não são em tempo real — o usuário aguarda
  via polling até os jobs concluírem

## Escopo Inicial (v1)

- Upload de imagem pelo usuário
- Armazenamento temporário via Cloudinary
- Busca no Google Images via ScrappingDog
- Exibição dos resultados com link de origem e thumbnail
- Polling do status da busca no frontend
- Interface simples, sem autenticação

## Fora do Escopo por Enquanto

- Scraping direto (apenas APIs na v1)
- Autenticação e histórico de buscas
- App mobile
- Busca por URL (apenas upload na v1)
- Filtros avançados de resultado
- Suporte a múltiplas ISEs simultâneas (começa só com Google)
