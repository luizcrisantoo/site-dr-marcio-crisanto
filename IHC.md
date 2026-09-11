# Avaliação de IHC · site Dr. Márcio Crisanto

Critérios usados: as 10 heurísticas de Nielsen, WCAG 2.1 nível AA, leis de Fitts e Hick, e princípios da Gestalt.
Teste automático: axe-core (WCAG 2 A e AA), 0 violações em 375px e 1440px.

## 10 heurísticas de Nielsen

| # | Heurística | Como o site atende |
|---|---|---|
| 1 | Visibilidade do status do sistema | Stepper "Local > Atendimento > Enviar" com etapa atual e concluídas; card escolhido fica destacado; menu marca a seção em que o visitante está (`aria-current`); mensagem de status ao escolher o plano |
| 2 | Correspondência com o mundo real | Linguagem do paciente ("dor que desce pela perna", não só "radiculopatia"); ícones que mostram o problema (pescoço, costas, pessoa de bengala); regiões da cidade que o paciente usa (Zona Sul, Zona Norte, Olinda, Cabo) |
| 3 | Controle e liberdade do usuário | Botões "Trocar local" e "Voltar" em cada passo; Esc fecha o menu; filtro "Todas" desfaz o filtro de região; "Prefiro ligar" como saída alternativa ao WhatsApp |
| 4 | Consistência e padrões | Mesmo estilo de botão para a mesma ação em todo o site; cores e tipografia vindas de um só arquivo de variáveis; padrão de card igual para os 6 locais |
| 5 | Prevenção de erros | "Continuar" só libera depois de escolher o tipo de atendimento (e o plano, se convênio), com a dica visível do que falta; aviso quando o plano não aparece na unidade escolhida, antes de enviar |
| 6 | Reconhecer em vez de lembrar | Passo 2 mostra o local escolhido; passo 3 mostra o resumo e a mensagem exata que será enviada; convênios visíveis em cada card |
| 7 | Flexibilidade e eficiência | Atalho "Agendar aqui" em cada card; telefone clicável; barra fixa de agendamento no celular; link "Pular para o conteúdo"; o site funciona sem JavaScript (cada card abre o WhatsApp direto) |
| 8 | Estética e design minimalista | Poucas seções, espaçamento reduzido, uma paleta (a da logo), uma serifada e uma sem serifa |
| 9 | Ajudar a reconhecer e corrigir erros | Quando o plano não está na lista, o site diz isso em linguagem simples e já oferece as unidades que aceitam, com um toque para trocar |
| 10 | Ajuda e documentação | Seção de dúvidas frequentes; aviso de sinais de alerta; nota sobre confirmação de cobertura |

## WCAG 2.1 AA

- Contraste mínimo 4.5:1 em todo texto (os textos auxiliares escurecem junto com a rampa de fundo)
- Foco visível em todos os elementos interativos (contorno de 3px)
- Alvos de toque com no mínimo 44x44px (botões, filtros, perguntas do FAQ)
- Texto do corpo em 17px, unidades relativas e `clamp()` para acompanhar o zoom
- HTML semântico com landmarks (`header`, `nav`, `main`, `footer`), um único `h1` e hierarquia de títulos
- Todas as imagens com `alt` descritivo; imagens decorativas com `alt=""`
- Links que abrem em nova aba avisam isso ao leitor de tela
- Formulário com `label` em todos os campos; mensagens de status com `role="status"` / `aria-live`
- Filtro com `aria-pressed`, menu com `aria-expanded`, stepper com `aria-current="step"`
- Respeita `prefers-reduced-motion` (desliga animações)
- Idioma declarado (`lang="pt-BR"`)

## Leis e princípios

- **Fitts:** botões de agendamento grandes, largura total no celular e sempre ao alcance do polegar (barra fixa)
- **Hick:** 6 locais filtráveis por região; 2 opções no passo 2 (particular ou convênio) antes da lista de planos
- **Divulgação progressiva:** cada card mostra no máximo 2 linhas de convênios e um botão "+N convênios" para ver o resto; cards vizinhos ficam com a mesma altura e sem vazio
- **Gestalt (proximidade e semelhança):** endereço, telefone e convênios agrupados dentro de cada card; seções separadas por degraus de cor bem visíveis
- **Hierarquia visual:** um CTA principal por tela, secundários em estilo contornado
- **Prova social com fonte independente:** faixa "Avaliações de pacientes" na seção Sobre (e na /sobre/), com links para as avaliações reais no Google e no Doctoralia; fica no momento em que o paciente avalia quem é o médico, em botões contornados para não competir com o "Agendar consulta", e sem copiar textos, notas ou estrelas

## Pontos que dependem de conteúdo (não de código)

- Fotos reais dos congressos na seção de congressos
- Confirmação dos convênios de cada unidade com o Dr. Márcio (evita que o paciente seja informado errado)
