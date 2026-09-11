# Site Dr. Márcio Crisanto · notas de entrega

Padrão GSD PRO. HTML estático, sem dependências externas (fontes e ícones hospedados localmente).
Para testar localmente: `python3 -m http.server` na pasta e abrir http://localhost:8000 (os módulos JS exigem servidor).

## Estrutura

```
index.html · 404.html · favicon.ico · site.webmanifest · sitemap.xml · robots.txt · llms.txt · _headers e _redirects (Netlify)
assets/images  logo, foto, og-image 1200x630, pasta congressos/ (vazia, para as fotos)
assets/icons   ícones Icons8 (PNG usados como máscara CSS, herdam a cor do texto)
assets/fonts   Cormorant Garamond + Inter (woff2, subset latin)
css/variables.css · css/styles.css
js/script.js · js/modules/{menu,scroll,booking,plans,api}.js · js/gtag-init.js
```

## Fluxo de agendamento

1. Paciente escolhe o local (cards com endereço, telefones, convênios e "Como chegar")
2. Escolhe particular ou convênio; se o plano não aparece naquela unidade, o site sugere as que aparecem
3. Vê a mensagem pronta e envia pelo WhatsApp

Mensagem base: "Olá, vim através do site do Dr. Márcio Crisanto e gostaria de agendar uma consulta com ele." (nunca cita o MedGuias). Prioridade dos números: site feito pelo Luiz > site oficial da clínica > diretórios
O passo 3 acrescenta o local e o tipo de atendimento (ex.: "Local: Clifor Olinda. Atendimento pelo convênio Unimed.").
Sem JavaScript, cada card abre o WhatsApp direto com a mensagem base + unidade.

## Dados checados (set/2026) e o que mudou em relação às imagens antigas

| Unidade | O que foi atualizado | Fonte |
|---|---|---|
| Ortoclínica Boa Viagem | Endereço completo com 4º andar, salas 402 a 404 (placa na foto do Google). Fixos 2129-1402 e 3076-9245 mantidos. WhatsApp (81) 99116-8831 | Doctoralia, MedGuias, Instagram da clínica |
| Clínica de Ortopedia de Boa Viagem | Endereço e fixo 3974-6797 mantidos. **Sem WhatsApp encontrado**: o botão liga para a clínica | Doctoralia, Apontador, listas públicas |
| Clifor | Convênios (14) tirados do cliforolinda.com.br: Assefaz, Bradesco Saúde, Camed, CapeSesp, Cassi, Compesa Saúde, Fachesf, Fisco Saúde, Geap, Mediservice, Postal Saúde, Saúde Caixa, SulAmérica, Unimed, e particular. O Dr. Márcio aparece na equipe do site. **Endereço mudou**: Praça Doze de Março, 36, sala 01, Bairro Novo, Olinda, 53030-110. Fixo 3429-6165 mantido. WhatsApp (81) 98237-9160 (o do site cliforolinda.com.br, feito pelo Luiz). O MedGuias traz (81) 99505-5054 | Receita/Econodata, rede ASSEFAZ 2025, cliforolinda.com.br |
| Maxclinicas | **Agora é Maxiclínicas São Marcos (Rede D'Or)**. Telefone: só a central (81) 3003-3230, que é o do perfil dele na Rede D'Or. Sem WhatsApp: o botão principal abre o agendamento online já no perfil dele e na unidade Paissandu | rededorsaoluiz.com.br (perfil oficial) |
| Clínica de Saúde do Cabo (nova) | Av. Presidente Getúlio Vargas, 974, Centro, Cabo de Santo Agostinho, 54505-560. Fixo (81) 3518-1525, WhatsApp (81) 99216-6979. Convênios: Amil, Bradesco, Hapvida, Porto, SulAmérica, Unimed | MedGuias, site oficial da clínica, seu-convenio.com |
| Hospital São Sebastião (novo) | Av. Presidente Getúlio Vargas, 864, Cabo de Santo Agostinho. Fixo (81) 3512-4150 (sem WhatsApp: botão liga). Convênios do site oficial do hospital. CEP ficou de fora porque o site do hospital traz 64.505-342, que é inválido para PE | MedGuias, hospitalsaosebastiaocabo.com.br |

## Confirmar com o Dr. Márcio antes de publicar

- [ ] **Convênios de cada unidade.** As fontes públicas se contradizem (o Doctoralia dele diz "só particular"; o MedGuias lista Unimed, Amil, Bradesco, Cassi, Geap, Correios, SulAmérica). As listas do site vieram de diretórios e da rede credenciada; o site sempre avisa para confirmar ao agendar
- [ ] Maxiclínicas atende particular? Não encontrado; hoje o card mostra só convênios
- [ ] WhatsApp da Ortoclínica (99116-8831), da Clifor (98237-9160) e da Clínica de Saúde do Cabo (99216-6979) recebem agendamento dele
- [ ] Ele consulta no Hospital São Sebastião ou só opera lá? Se só opera, dá pra tirar o card do agendamento
- [ ] Clínica de Ortopedia de Boa Viagem tem WhatsApp? Se tiver, preencher `data-whatsapp` no card e trocar o botão
- [ ] Ele ainda atende na Clínica de Ortopedia de Boa Viagem? Só uma fonte (MedGuias) o liga a ela
- [x] Formação: UPE + residência e especialização em cirurgia de coluna no HC-UFPE (fonte: perfil dele no MedGuias), já na seção Sobre
- [ ] Foto do centro cirúrgico (seção Sobre): suavizei as manchas vermelhas na luva do auxiliar à direita. Confirmar se ele autoriza e se a equipe da foto concorda com a publicação
- [ ] Fotos dos congressos: baixar os originais do Instagram (ou pedir às clínicas) e salvar em `assets/images/congressos/`; o HTML tem o comentário de como encaixar em cada card

## Ajustes por causa do CFM (Resolução 2.336/2023)

- Especialidade exibida como "Ortopedia e Traumatologia · RQE 9294", com a palavra "Médico" e CRM-PE, no hero, no Sobre e no rodapé. "Coluna" aparece como área de atuação, não como especialidade, porque o RQE é de Ortopedia e Traumatologia. **Se ele tiver RQE de área de atuação em coluna, vale incluir**
- Sem promessa de resultado, sem superlativo, sem preço, sem antes/depois e sem depoimentos
- Congressos entram como atualização profissional (permitido)
- Bloco de sinais de alerta e FAQ com caráter educativo

## Kit SEO

**Title (53):** Ortopedista de Coluna em Recife | Dr. Márcio Crisanto
**Meta description (156):** Ortopedista de coluna em Recife (Boa Viagem e Paissandu), Olinda e Cabo. Hérnia de disco, dor lombar e ciática. Dr. Márcio Crisanto, CRM-PE 12253, RQE 9294.
**H1:** "Ortopedista de coluna em Recife, Olinda e Cabo" + "Cuidado com a sua coluna, do diagnóstico ao tratamento."
**Schema:** WebSite, WebPage (revisada pelo médico), Person (formação, CRM e RQE como credenciais), IndividualPhysician (endereço, geo, serviços, áreas atendidas), 5 MedicalClinic, Hospital (como afiliação) e FAQPage. Validado contra os tipos do schema.org. Obs.: desde 2023 o Google só mostra o FAQ em destaque para sites de saúde muito grandes; o schema continua útil para Bing e buscadores com IA, mas não conte com a sanfona na busca
**Social:** og:image 1200x630, og:site_name, og:image:alt, twitter:card
**Favicon e manifest:** favicon.ico 16/32/48, PNG 32 e 192, apple-touch 180, site.webmanifest
**Performance:** Lighthouse mobile local: Performance 91, Acessibilidade 100, Boas práticas 100, SEO 100. Depois: CSS sem @import em cascata, foto do hero não baixa no celular, avatar de 120px, modulepreload dos módulos JS
**Netlify:** _redirects força https e domínio sem www (acrescentar a linha do *.netlify.app quando criar o site); _headers com HSTS, CSP e cache; 404.html próprio
**Arquivos na raiz:** sitemap.xml, robots.txt, llms.txt, _headers, _redirects, 404.html, site.webmanifest

**Palavras-chave de cauda longa**
- Transacional: ortopedista de coluna em Boa Viagem · ortopedista de coluna Recife convênio Unimed · ortopedista de coluna Olinda · consulta ortopedista coluna Recife particular
- Navegacional local: ortopedista de coluna perto de mim · ortopedista coluna Paissandu · médico de coluna Boa Viagem
- Informacional: hérnia de disco precisa de cirurgia · dor ciática qual médico procurar · quando procurar ortopedista de coluna

**Domínio** (livres no registro.br em 10/09/2026):
1. drmarciocrisanto.com.br (usado no canonical, sitemap e schema)
2. drmarciocrisanto.med.br (extensão exclusiva de médicos, exige CRM)
3. marciocrisanto.com.br

**Analytics:** tags do GA4 e do Search Console comentadas no `<head>`; evento `clique_agendamento` já disparado em todo clique de WhatsApp/telefone (js/modules/api.js). Ao ativar o GA4, liberar googletagmanager.com na CSP do `_headers`.

## Créditos

Rodapé: "Site desenvolvido por Luiz Crisanto" (link para devluizcrisanto.com.br) e "Ícones por Icons8" (link para icons8.com.br, exigido pela licença gratuita).

## IHC

Avaliação heurística completa em `IHC.md`.

## Próxima fase de SEO (para ser referência em Recife)

Páginas próprias por condição e por cidade, com 900 a 1.500 palavras, revisadas pelo Dr. Márcio (caixa de autoria com CRM/RQE e data de revisão), fontes citadas e schema MedicalWebPage. Fase 1: /sobre/, /hernia-de-disco/, /dor-lombar/, /dor-ciatica/, /cirurgia-de-coluna/, /ortopedista-coluna-olinda/, /ortopedista-coluna-cabo-de-santo-agostinho/. Quando houver mais de uma página, trocar os caminhos para absolutos (/css, /assets, /js e /#secao no menu).
Off-page: pedir link para o site no perfil dele no site da Clifor, no Instagram da Ortoclínica, no Doctoralia e na bio do Instagram; manter nome, endereço e telefone iguais em todos os diretórios.
