// ===== CONFIG =====
var PERFIS_KEY = 'curso_aval_perfis_v1';
var ADMIN_PASS = 'aval2025';
var FICHAS_KEY = 'curso_aval_fichas_v1';
var estado = {};
var perfilAtual = '';
var adminLogado = false;
var adminClickCount = 0;

// ===== STORAGE =====
function getStorageKey(nome) { return 'curso_aval_' + nome.toLowerCase().replace(/\s+/g,'_'); }
function salvarEstado() { try { localStorage.setItem(getStorageKey(perfilAtual), JSON.stringify(estado)); } catch(e){} }
function carregarEstado(nome) {
  try { return JSON.parse(localStorage.getItem(getStorageKey(nome))) || {}; } catch(e) { return {}; }
}
function salvarPerfil(nome) {
  var perfis = carregarPerfis();
  var idx = perfis.findIndex(function(p){ return p.nome === nome; });
  var info = { nome: nome, ultimoAcesso: new Date().toISOString() };
  if (idx >= 0) perfis[idx] = Object.assign(perfis[idx], info);
  else perfis.push(info);
  localStorage.setItem(PERFIS_KEY, JSON.stringify(perfis));
}
function carregarPerfis() { try { return JSON.parse(localStorage.getItem(PERFIS_KEY)) || []; } catch(e){ return []; } }

// ===== INTRO =====
function iniciarCurso() {
  var nome = document.getElementById('intro-nome-input').value.trim();
  if (!nome) { document.getElementById('intro-nome-input').focus(); return; }
  perfilAtual = nome;
  estado = carregarEstado(nome);
  if (!estado.aulasFeitas) estado.aulasFeitas = {};
  if (!estado.quizFeito) estado.quizFeito = {};
  if (!estado.quizScores) estado.quizScores = {};
  salvarPerfil(nome);
  salvarEstado();
  document.getElementById('intro-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('header-aluno-nome').textContent = nome;
  renderNav();
  renderModulos();
  atualizarProgresso();
  criarParticulas();
}

function criarParticulas() {
  var canvas = document.getElementById('intro-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  var particles = [];
  for (var i = 0; i < 60; i++) {
    particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      r: Math.random()*2+1, vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4,
      a: Math.random()*.5+.1 });
  }
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(function(p) {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(79,142,247,'+p.a+')'; ctx.fill();
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', function() {
  criarParticulas();
  var inp = document.getElementById('intro-nome-input');
  if (inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') iniciarCurso(); });
});

var CURSO = { nome: 'Avaliacao Fisica e Postural Profissional', modulos: [] };

CURSO.modulos.push({id:1,titulo:'Fundamentos da Avaliacao Fisica',aulas:[
{id:101,titulo:'O que e avaliacao fisica e por que fazer',duracao:'12 min',conteudo:'<h3>O que e avaliacao fisica</h3><p>A avaliacao fisica e o conjunto de procedimentos que permitem ao profissional conhecer o estado atual do individuo, identificar riscos e prescrever exercicios com seguranca.</p><div class=destaque>Sem avaliacao a prescricao e baseada em suposicoes. Com avaliacao e baseada em evidencias.</div><ul><li>Identificar fatores de risco cardiovascular</li><li>Estabelecer linha de base para comparacao futura</li><li>Personalizar a prescricao de exercicios</li><li>Motivar o aluno mostrando evolucao mensuravel</li><li>Proteger o profissional legalmente</li></ul>'},
{id:102,titulo:'Etica e responsabilidade profissional',duracao:'10 min',conteudo:'<h3>Etica Profissional</h3><p>O profissional de Educacao Fisica tem responsabilidade legal e etica sobre os procedimentos que realiza.</p><div class=alerta>O profissional de EF nao diagnostica doencas. Ele identifica alteracoes funcionais e encaminha ao medico quando necessario.</div><ul><li>CREF: registro obrigatorio para atuar legalmente</li><li>Sigilo: dados do aluno sao confidenciais</li><li>Consentimento: termo deve ser assinado antes da avaliacao</li><li>Encaminhamento: saber quando encaminhar ao medico</li></ul>'},
{id:103,titulo:'Anamnese completa: o que perguntar',duracao:'15 min',conteudo:'<h3>Anamnese Completa</h3><p>A anamnese e a entrevista inicial com o aluno. E o primeiro e mais importante passo da avaliacao.</p><div class=tabela-wrap><table><tr><th>Categoria</th><th>O que investigar</th></tr><tr><td>Historico medico</td><td>Doencas cronicas, cirurgias, medicamentos</td></tr><tr><td>Atividade fisica</td><td>Experiencia anterior, frequencia, modalidades</td></tr><tr><td>Queixas e dores</td><td>Localizacao, intensidade, frequencia</td></tr><tr><td>Objetivos</td><td>Emagrecimento, hipertrofia, saude</td></tr><tr><td>Habitos de vida</td><td>Sono, alimentacao, estresse</td></tr></table></div>'},
{id:104,titulo:'PAR-Q e triagem de risco cardiovascular',duracao:'14 min',conteudo:'<h3>PAR-Q</h3><p>O PAR-Q e um questionario de 7 perguntas que identifica se o individuo precisa de liberacao medica antes de iniciar atividade fisica.</p><ul><li>Algum medico ja disse que voce tem problema cardiaco?</li><li>Voce sente dor no peito ao praticar atividade fisica?</li><li>Voce perdeu o equilibrio por tontura?</li><li>Voce tem algum problema osseo ou articular?</li><li>Seu medico prescreveu medicamento para pressao?</li></ul><div class=alerta>Se qualquer resposta for SIM, encaminhe ao medico antes de iniciar.</div>'}
],quiz:[
{pergunta:'Qual o principal objetivo da avaliacao fisica?',opcoes:['Diagnosticar doencas','Conhecer o estado atual e prescrever com seguranca','Substituir a consulta medica','Apenas motivar o aluno'],correta:1},
{pergunta:'O PAR-Q e utilizado para:',opcoes:['Medir composicao corporal','Avaliar postura','Triagem de risco cardiovascular','Calcular o VO2 maximo'],correta:2},
{pergunta:'Quantas perguntas tem o PAR-Q?',opcoes:['5','6','7','10'],correta:2}
]});

CURSO.modulos.push({id:2,titulo:'Composicao Corporal',aulas:[
{id:201,titulo:'Massa magra, gordura e agua corporal',duracao:'13 min',conteudo:'<h3>Composicao Corporal</h3><p>A composicao corporal descreve as proporcoes dos diferentes componentes do corpo humano: massa magra, gordura corporal e agua corporal.</p><div class=destaque>Modelo de 2 compartimentos: divide o corpo em massa gorda e massa livre de gordura (MLG).</div><div class=tabela-wrap><table><tr><th>Componente</th><th>Homens</th><th>Mulheres</th></tr><tr><td>Gordura essencial</td><td>2-5%</td><td>10-13%</td></tr><tr><td>Atletico</td><td>6-13%</td><td>14-20%</td></tr><tr><td>Fitness</td><td>14-17%</td><td>21-24%</td></tr><tr><td>Aceitavel</td><td>18-24%</td><td>25-31%</td></tr><tr><td>Obesidade</td><td>25%+</td><td>32%+</td></tr></table></div>'},
{id:202,titulo:'Dobras cutaneas: protocolo e tecnica',duracao:'18 min',conteudo:'<h3>Dobras Cutaneas</h3><p>A adipometria por dobras cutaneas e o metodo mais utilizado na pratica. Requer treinamento e padronizacao para resultados confiaveis.</p><div class=alerta>Regra de ouro: sempre use o mesmo protocolo, avaliador e adipometro nas reavaliaÃ§Ãµes.</div><ol><li>Marque o ponto anatomico com caneta dermografica</li><li>Pegue a dobra com polegar e indicador, 1cm acima do ponto</li><li>Aplique o adipometro perpendicular a dobra</li><li>Aguarde 2 segundos e leia</li><li>Repita 3 vezes e use a mediana</li></ol>'},
{id:203,titulo:'Protocolos: Jackson-Pollock, Guedes, Faulkner',duracao:'16 min',conteudo:'<h3>Protocolos de Estimativa de Gordura</h3><div class=tabela-wrap><table><tr><th>Protocolo</th><th>Dobras</th><th>Populacao</th></tr><tr><td>Jackson-Pollock 7</td><td>Peitoral, Axilar, Tricipital, Subescapular, Abdominal, Suprailiaca, Coxa</td><td>Adultos geral</td></tr><tr><td>JP 3 Homens</td><td>Peitoral, Abdominal, Coxa</td><td>Homens</td></tr><tr><td>JP 3 Mulheres</td><td>Tricipital, Suprailiaca, Coxa</td><td>Mulheres</td></tr><tr><td>Guedes</td><td>Tricipital, Subescapular, Suprailiaca</td><td>Brasileiros</td></tr><tr><td>Faulkner</td><td>Tricipital, Subescapular, Suprailiaca, Abdominal</td><td>Atletas</td></tr></table></div>'},
{id:204,titulo:'IMC, circunferencias e relacao cintura-quadril',duracao:'12 min',conteudo:'<h3>Indices Antropometricos</h3><p><strong>IMC:</strong> Peso(kg) / Altura(m)^2</p><div class=tabela-wrap><table><tr><th>IMC</th><th>Classificacao</th></tr><tr><td>Abaixo de 18,5</td><td>Abaixo do peso</td></tr><tr><td>18,5-24,9</td><td>Peso normal</td></tr><tr><td>25,0-29,9</td><td>Sobrepeso</td></tr><tr><td>30,0-34,9</td><td>Obesidade I</td></tr><tr><td>40+</td><td>Obesidade III</td></tr></table></div><div class=alerta>O IMC nao diferencia massa muscular de gordura.</div>'}
],quiz:[
{pergunta:'Qual protocolo e mais indicado para brasileiros?',opcoes:['Faulkner','Jackson-Pollock 7','Guedes','Durnin-Womersley'],correta:2},
{pergunta:'O IMC e calculado por:',opcoes:['Peso/Altura','Peso/Altura ao quadrado','Altura/Peso','Circunferencia/Altura'],correta:1},
{pergunta:'Risco de circunferencia abdominal para mulheres:',opcoes:['Acima de 80cm','Acima de 90cm','Acima de 70cm','Acima de 100cm'],correta:0}
]});

CURSO.modulos.push({id:3,titulo:'Avaliacao Postural',aulas:[
{id:301,titulo:'Postura ideal e desvios posturais',duracao:'15 min',conteudo:'<h3>Postura Ideal e Desvios Posturais</h3><p>A postura ideal e aquela em que o alinhamento dos segmentos corporais minimiza o estresse sobre estruturas passivas e o trabalho muscular necessario.</p><div class=destaque>Linha de prumo lateral: lobulo da orelha, processo acromio, grande trocanter, ligeiramente anterior ao joelho e ao maleo lateral.</div><ul><li>Hiperlordose cervical: aumento da curvatura cervical</li><li>Hipercifose toracica: aumento da curvatura toracica</li><li>Hiperlordose lombar: aumento da curvatura lombar</li><li>Escoliose: desvio lateral da coluna</li><li>Anteroversao pelvica: pelve inclinada para frente</li></ul>'},
{id:302,titulo:'Avaliacao nas 4 vistas',duracao:'20 min',conteudo:'<h3>Avaliacao nas 4 Vistas</h3><p><strong>Vista Anterior:</strong> alinhamento da cabeca, nivel dos ombros, cristas iliacas, joelhos (valgo/varo), pe (pronado/supinado).</p><p><strong>Vista Posterior:</strong> alinhamento da coluna (escoliose), nivel das escapulas, nivel dos gluteos, eixo do calcaneo.</p><p><strong>Vista Lateral:</strong> posicao da cabeca, curvaturas cervical/toracica/lombar, posicao do ombro, posicao da pelve, joelho.</p><div class=alerta>Avalie o aluno em roupas adequadas para visualizar os pontos anatomicos.</div>'},
{id:303,titulo:'Testes funcionais: overhead squat e single leg squat',duracao:'18 min',conteudo:'<h3>Testes Funcionais</h3><p><strong>Overhead Squat:</strong> Pes na largura dos ombros, bracos elevados, agachar ate 90 graus. Observe: queda dos bracos, inclinacao do tronco, valgo dos joelhos, elevacao dos calcanhares.</p><p><strong>Single Leg Squat:</strong> Apoio em um pe, agachar ate 45 graus. Observe: valgo do joelho, inclinacao lateral do tronco, queda da pelve (sinal de Trendelenburg).</p><div class=destaque>Os testes funcionais guiam a prescricao corretiva com muito mais precisao que a avaliacao estatica isolada.</div>'},
{id:304,titulo:'Sindrome cruzada de Janda',duracao:'14 min',conteudo:'<h3>Sindrome Cruzada de Janda</h3><p><strong>Sindrome Cruzada Superior:</strong> Encurtados: peitoral menor, trapezio superior, elevador da escapula. Inibidos: flexores profundos do pescoco, trapezio medio/inferior. Resultado: protracao de cabeca e ombros.</p><p><strong>Sindrome Cruzada Inferior:</strong> Encurtados: iliopsoas, reto femoral, TFL, eretor lombar. Inibidos: gluteo maximo, abdominais profundos. Resultado: anteroversao pelvica e hiperlordose lombar.</p><div class=destaque>Identificar o padrao de Janda permite criar um protocolo corretivo sistematico.</div>'}
],quiz:[
{pergunta:'Na sindrome cruzada inferior, qual musculo tipicamente esta inibido?',opcoes:['Iliopsoas','Reto femoral','Gluteo maximo','Eretor da espinha'],correta:2},
{pergunta:'O overhead squat avalia principalmente:',opcoes:['Forca maxima','Padroes de movimento e disfuncoes','Composicao corporal','Flexibilidade isolada'],correta:1},
{pergunta:'A anteroversao pelvica esta associada a:',opcoes:['Hipercifose toracica','Hiperlordose lombar','Escoliose','Retroversao cervical'],correta:1}
]});

CURSO.modulos.push({id:4,titulo:'Testes de Aptidao Fisica',aulas:[
{id:401,titulo:'Teste de forca: 1RM e repeticoes maximas',duracao:'16 min',conteudo:'<h3>Avaliacao de Forca</h3><p><strong>Teste de 1RM:</strong> Carga maxima que o individuo consegue mover em uma unica repeticao com tecnica correta. Protocolo: aquecimento, tentativas progressivas com 3-5 min de descanso.</p><div class=alerta>Contraindicado para iniciantes, idosos e pessoas com historico cardiovascular.</div><div class=tabela-wrap><table><tr><th>Reps</th><th>% 1RM</th></tr><tr><td>1</td><td>100%</td></tr><tr><td>5</td><td>87%</td></tr><tr><td>10</td><td>75%</td></tr><tr><td>15</td><td>65%</td></tr></table></div>'},
{id:402,titulo:'Teste de flexibilidade: banco de Wells e goniometria',duracao:'12 min',conteudo:'<h3>Avaliacao de Flexibilidade</h3><p><strong>Banco de Wells:</strong> Avalia flexibilidade de isquiotibiais e lombar. Sentado com joelhos estendidos, empurrar a regua o maximo possivel.</p><div class=tabela-wrap><table><tr><th>Classificacao</th><th>Homens</th><th>Mulheres</th></tr><tr><td>Excelente</td><td>maior 38cm</td><td>maior 41cm</td></tr><tr><td>Bom</td><td>34-38cm</td><td>37-41cm</td></tr><tr><td>Regular</td><td>25-33cm</td><td>28-36cm</td></tr><tr><td>Fraco</td><td>menor 25cm</td><td>menor 28cm</td></tr></table></div>'},
{id:403,titulo:'Teste cardiorrespiratorio: Cooper e step test',duracao:'14 min',conteudo:'<h3>Avaliacao Cardiorrespiratoria</h3><p><strong>Teste de Cooper (12 min):</strong> Correr/caminhar o maximo de distancia em 12 minutos. VO2max estimado = (distancia em metros - 504,9) / 44,73.</p><p><strong>Step Test de 3 minutos:</strong> Subir e descer um step de 30cm por 3 minutos a 96 bpm. Medir FC apos 1 minuto de recuperacao.</p><div class=destaque>Para populacao sedentaria e idosos, prefira o step test ou o teste de caminhada de 6 minutos.</div>'},
{id:404,titulo:'Interpretacao e classificacao dos resultados',duracao:'13 min',conteudo:'<h3>Interpretacao dos Resultados</h3><p>Apos coletar todos os dados, o profissional deve interpretar os resultados de forma integrada, nao isolada.</p><div class=destaque>Um resultado isolado tem pouco valor. O conjunto dos dados e que revela o perfil real do avaliado.</div><ol><li>Compare cada resultado com os valores de referencia para sexo e idade</li><li>Identifique os pontos criticos</li><li>Cruze os dados posturais com os funcionais</li><li>Considere o historico clinico e os objetivos do aluno</li><li>Priorize as intervencoes por ordem de risco e impacto</li></ol>'}
],quiz:[
{pergunta:'Qual teste avalia flexibilidade de isquiotibiais?',opcoes:['Cooper','Banco de Wells','1RM','Step Test'],correta:1},
{pergunta:'O teste de Cooper dura:',opcoes:['6 minutos','10 minutos','12 minutos','15 minutos'],correta:2},
{pergunta:'Para populacao sedentaria, qual teste cardio e mais indicado?',opcoes:['Cooper','1RM','Step Test ou caminhada de 6 min','Teste de Wingate'],correta:2}
]});

CURSO.modulos.push({id:5,titulo:'Prescricao Corretiva',aulas:[
{id:501,titulo:'Protocolo CES: inibir, alongar, ativar, integrar',duracao:'17 min',conteudo:'<h3>Protocolo CES</h3><p>O protocolo CES do NASM e a abordagem mais sistematizada para correcao postural e funcional.</p><ol><li><strong>Inibir:</strong> Foam roller nos musculos hiperativos. 30-60s por ponto.</li><li><strong>Alongar:</strong> Alongamento estatico dos musculos encurtados. 20-30s, 2-3 series.</li><li><strong>Ativar:</strong> Exercicios isolados dos musculos inibidos. 10-15 reps lentas.</li><li><strong>Integrar:</strong> Exercicios funcionais globais.</li></ol><div class=destaque>Sempre siga a ordem: inibir, alongar, ativar, integrar.</div>'},
{id:502,titulo:'Exercicios corretivos por regiao',duracao:'20 min',conteudo:'<h3>Exercicios Corretivos</h3><p><strong>Cervical e Ombros:</strong></p><ul><li>Inibir: foam roller em peitoral e trapezio superior</li><li>Alongar: peitoral na porta, inclinacao cervical</li><li>Ativar: chin tuck, rotacao externa com elastico</li><li>Integrar: remada, face pull</li></ul><p><strong>Lombar e Pelve:</strong></p><ul><li>Inibir: foam roller em TFL e iliopsoas</li><li>Alongar: afundo, piriforme</li><li>Ativar: ponte glutea, bird dog</li><li>Integrar: agachamento, deadlift romeno</li></ul>'},
{id:503,titulo:'Periodizacao do treino corretivo',duracao:'12 min',conteudo:'<h3>Periodizacao Corretiva</h3><div class=tabela-wrap><table><tr><th>Fase</th><th>Duracao</th><th>Foco</th></tr><tr><td>1 - Estabilizacao</td><td>4-6 semanas</td><td>Ativacao e controle motor</td></tr><tr><td>2 - Forca</td><td>4-8 semanas</td><td>Forca dos musculos inibidos</td></tr><tr><td>3 - Potencia</td><td>4-6 semanas</td><td>Integracao funcional</td></tr></table></div><div class=destaque>Reavaliar a cada 4-6 semanas para ajustar o protocolo.</div>'}
],quiz:[
{pergunta:'Qual e a primeira fase do protocolo CES?',opcoes:['Ativar','Alongar','Inibir','Integrar'],correta:2},
{pergunta:'Qual exercicio e indicado para ativar o gluteo maximo?',opcoes:['Leg press','Ponte glutea','Agachamento livre','Cadeira extensora'],correta:1},
{pergunta:'Com que frequencia deve-se reavaliar o protocolo corretivo?',opcoes:['A cada 2 semanas','A cada 4-6 semanas','A cada 6 meses','Apenas no inicio'],correta:1}
]});

CURSO.modulos.push({id:6,titulo:'Laudo e Relatorio Profissional',aulas:[
{id:601,titulo:'Como estruturar um laudo postural',duracao:'15 min',conteudo:'<h3>Estrutura do Laudo Postural</h3><p>O laudo postural e o documento que formaliza os achados da avaliacao. Deve ser claro, objetivo e tecnicamente embasado.</p><ol><li>Identificacao do avaliado</li><li>Objetivo da avaliacao</li><li>Metodologia utilizada</li><li>Achados posturais por vista</li><li>Achados funcionais</li><li>Hipoteses de disfuncao muscular</li><li>Recomendacoes e encaminhamentos</li><li>Assinatura e CREF do profissional</li></ol><div class=alerta>O laudo nao e diagnostico medico. Use termos como: hipotese, sugere, indica, observado.</div>'},
{id:602,titulo:'Linguagem tecnica e termos corretos',duracao:'10 min',conteudo:'<h3>Linguagem Tecnica</h3><div class=tabela-wrap><table><tr><th>Evitar</th><th>Usar</th></tr><tr><td>Tem escoliose</td><td>Observa-se desvio lateral da coluna</td></tr><tr><td>Musculo fraco</td><td>Musculo possivelmente inibido</td></tr><tr><td>Problema no joelho</td><td>Valgo dinamico de joelho observado no agachamento</td></tr><tr><td>Postura errada</td><td>Desvio postural identificado</td></tr></table></div>'},
{id:603,titulo:'Apresentacao dos resultados ao aluno',duracao:'12 min',conteudo:'<h3>Apresentacao ao Aluno</h3><ul><li>Use linguagem acessivel, sem jargoes tecnicos excessivos</li><li>Mostre os pontos positivos antes dos negativos</li><li>Use imagens e referencias visuais quando possivel</li><li>Explique o que cada achado significa na pratica do dia a dia</li><li>Apresente o plano de acao de forma clara e motivadora</li></ul><div class=destaque>O aluno que entende sua avaliacao tem muito mais chances de seguir o programa.</div>'}
],quiz:[
{pergunta:'O laudo postural pode conter diagnostico de doencas?',opcoes:['Sim, sempre','Sim, com especializacao','Nao, apenas observacoes funcionais','Apenas com autorizacao medica'],correta:2},
{pergunta:'Qual termo e mais adequado no laudo?',opcoes:['Tem escoliose','Desvio lateral da coluna observado','Coluna torta','Problema na coluna'],correta:1},
{pergunta:'Qual e o primeiro passo ao apresentar resultados ao aluno?',opcoes:['Mostrar os problemas encontrados','Mostrar os pontos positivos antes','Entregar o laudo sem explicar','Encaminhar ao medico'],correta:1}
]});

CURSO.modulos.push({id:7,titulo:'Pratica Profissional e Mercado',aulas:[
{id:701,titulo:'Montando seu protocolo de avaliacao',duracao:'18 min',conteudo:'<h3>Montando seu Protocolo</h3><p>Um protocolo padronizado garante consistencia, profissionalismo e protecao legal.</p><ul><li>Ficha de anamnese e PAR-Q assinados</li><li>Termo de consentimento informado</li><li>Medicoes antropometricas</li><li>Dobras cutaneas</li><li>Avaliacao postural nas 4 vistas</li><li>Testes funcionais</li><li>Testes de aptidao</li><li>Laudo escrito e assinado</li><li>Apresentacao ao aluno</li><li>Agendamento da reavaliacao</li></ul>'},
{id:702,titulo:'Precificacao e posicionamento no mercado',duracao:'14 min',conteudo:'<h3>Precificacao e Mercado</h3><p>A avaliacao fisica e postural e um diferencial competitivo poderoso. Profissionais que avaliam cobram mais e reteem mais alunos.</p><ul><li>Avaliacao inclusa no pacote de treino</li><li>Avaliacao como servico separado (R-400)</li><li>Pacote avaliacao + laudo + plano corretivo</li><li>Reavaliacao trimestral como fidelizacao</li></ul><div class=destaque>Documente tudo. A evolucao mensuravel e seu maior argumento de venda.</div>'},
{id:703,titulo:'Casos praticos e estudos de caso',duracao:'20 min',conteudo:'<h3>Casos Praticos</h3><p><strong>Caso 1 - Dor lombar:</strong> Homem, 35 anos, sedentario. Avaliacao: anteroversao pelvica, hiperlordose lombar. Protocolo: inibir TFL e eretor, alongar iliopsoas, ativar gluteo, integrar com agachamento.</p><p><strong>Caso 2 - Dor no ombro:</strong> Mulher, 28 anos, crossfit. Avaliacao: protracao de ombro, hipercifose toracica. Protocolo: inibir peitoral, alongar peitoral na porta, ativar trapezio medio, integrar com remada.</p><div class=destaque>Cada caso e unico. O protocolo deve ser individualizado com base nos achados da avaliacao.</div>'}
],quiz:[
{pergunta:'Qual documento deve ser assinado antes da avaliacao?',opcoes:['Apenas a ficha de anamnese','PAR-Q e termo de consentimento','Somente o laudo','Nenhum documento'],correta:1},
{pergunta:'Qual e o principal beneficio de documentar a evolucao do aluno?',opcoes:['Cumprir obrigacao legal','Argumento de venda e fidelizacao','Facilitar encaminhamentos','Reduzir o tempo de atendimento'],correta:1},
{pergunta:'No caso de dor lombar com anteroversao pelvica, qual musculo deve ser ativado?',opcoes:['Iliopsoas','Eretor da espinha','Gluteo maximo','Reto femoral'],correta:2}
]});
// ===== PROGRESSO =====
function calcProgresso() {
  var totalAulas = 0, feitas = 0;
  CURSO.modulos.forEach(function(m) {
    totalAulas += m.aulas.length;
    m.aulas.forEach(function(a) { if (estado.aulasFeitas && estado.aulasFeitas[a.id]) feitas++; });
  });
  return totalAulas ? Math.round((feitas / totalAulas) * 100) : 0;
}
function atualizarProgresso() {
  var pct = calcProgresso();
  var fill = document.getElementById('header-prog-fill');
  var txt = document.getElementById('header-prog-txt');
  if (fill) fill.style.width = pct + '%';
  if (txt) txt.textContent = pct + '%';
  if (pct === 100) setTimeout(mostrarCertificado, 800);
}
function calcProgressoModulo(mod) {
  if (!mod.aulas.length) return 0;
  var feitas = mod.aulas.filter(function(a){ return estado.aulasFeitas && estado.aulasFeitas[a.id]; }).length;
  return Math.round((feitas / mod.aulas.length) * 100);
}

// ===== NAV =====
function renderNav() {
  var nav = document.getElementById('nav-modulos');
  if (!nav) return;
  nav.innerHTML = CURSO.modulos.map(function(m) {
    var pct = calcProgressoModulo(m);
    var cls = pct === 100 ? 'concluido' : '';
    return '<div class="nav-mod-item ' + cls + '" onclick="scrollToModulo(' + m.id + ')">' +
      '<div class="nav-mod-num">' + (pct === 100 ? '&#10003;' : m.id) + '</div>' +
      '<span>' + m.titulo + '</span>' +
      '<span class="nav-mod-pct">' + pct + '%</span></div>';
  }).join('');
}
function scrollToModulo(id) {
  var el = document.getElementById('modulo-' + id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== RENDER MODULOS =====
function renderModulos() {
  var container = document.getElementById('modulos-container');
  if (!container) return;
  container.innerHTML = CURSO.modulos.map(function(m) { return renderModuloCard(m); }).join('');
}
function renderModuloCard(m) {
  var pct = calcProgressoModulo(m);
  var aulasHTML = m.aulas.map(function(a, ai) {
    var feita = estado.aulasFeitas && estado.aulasFeitas[a.id];
    return '<div class="aula-item' + (feita ? ' concluida' : '') + '" onclick="toggleAula(' + m.id + ',' + a.id + ',this)">' +
      '<div class="aula-check">' + (feita ? '&#10003;' : '') + '</div>' +
      '<span class="aula-num">' + (ai+1) + '.</span>' +
      '<span class="aula-titulo">' + a.titulo + '</span>' +
      '<span class="aula-duracao">' + a.duracao + '</span></div>' +
      '<div class="aula-conteudo" id="aula-cont-' + a.id + '" style="display:none">' +
        a.conteudo +
        '<button class="btn-concluir-aula' + (feita ? ' ja-feita' : '') + '" onclick="concluirAula(' + m.id + ',' + a.id + ',event)">' +
          (feita ? '&#10003; Aula concluida' : '&#10003; Marcar como concluida') +
        '</button></div>';
  }).join('');
  var quizHTML = renderQuiz(m);
  return '<div class="modulo-section" id="modulo-' + m.id + '">' +
    '<div class="modulo-card" id="modulo-card-' + m.id + '">' +
      '<div class="modulo-header" onclick="toggleModulo(' + m.id + ')">' +
        '<div class="modulo-num">' + m.id + '</div>' +
        '<div class="modulo-info"><div class="modulo-titulo">' + m.titulo + '</div>' +
        '<div class="modulo-meta">' + m.aulas.length + ' aulas</div></div>' +
        '<div class="modulo-pct-wrap"><div class="modulo-pct-bar"><div class="modulo-pct-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="modulo-pct-txt">' + pct + '%</span></div>' +
        '<span class="modulo-chevron">&#8964;</span></div>' +
      '<div class="modulo-body"><div class="aulas-lista">' + aulasHTML + '</div>' + quizHTML + '</div>' +
    '</div></div>';
}
function toggleModulo(id) {
  var card = document.getElementById('modulo-card-' + id);
  if (card) card.classList.toggle('open');
}
function toggleAula(modId, aulaId, el) {
  var cont = document.getElementById('aula-cont-' + aulaId);
  if (!cont) return;
  var isOpen = cont.style.display !== 'none';
  var mod = CURSO.modulos.find(function(m){ return m.id === modId; });
  if (mod) mod.aulas.forEach(function(a) {
    var c = document.getElementById('aula-cont-' + a.id);
    if (c) c.style.display = 'none';
  });
  if (!isOpen) cont.style.display = 'block';
}
function concluirAula(modId, aulaId, e) {
  e.stopPropagation();
  if (!estado.aulasFeitas) estado.aulasFeitas = {};
  estado.aulasFeitas[aulaId] = true;
  salvarEstado();
  var mod = CURSO.modulos.find(function(m){ return m.id === modId; });
  var section = document.getElementById('modulo-' + modId);
  var wasOpen = document.getElementById('modulo-card-' + modId).classList.contains('open');
  section.outerHTML = renderModuloCard(mod);
  if (wasOpen) { var card = document.getElementById('modulo-card-' + modId); if (card) card.classList.add('open'); }
  atualizarProgresso(); renderNav(); mostrarToast('Aula concluida!');
}

// ===== QUIZ =====
function renderQuiz(mod) {
  if (!mod.quiz || !mod.quiz.length) return '';
  var feito = estado.quizFeito && estado.quizFeito[mod.id];
  var score = (estado.quizScores && estado.quizScores[mod.id]) || 0;
  var total = mod.quiz.length;
  var aprovado = feito && (score / total) >= 0.7;
  var questoesHTML = mod.quiz.map(function(q, qi) {
    var resps = estado['quiz_resp_' + mod.id];
    var respostaUsuario = (feito && resps) ? resps[qi] : -1;
    var opcoesHTML = q.opcoes.map(function(op, oi) {
      var cls = 'quiz-option' + (feito ? ' disabled' : '');
      if (feito && oi === q.correta) cls += ' correta';
      else if (feito && oi === respostaUsuario && oi !== q.correta) cls += ' errada';
      return '<label class="' + cls + '"><input type="radio" name="quiz-' + mod.id + '-q' + qi + '" value="' + oi + '"' +
        (feito ? ' disabled' : '') + (respostaUsuario === oi ? ' checked' : '') + '/>' + op + '</label>';
    }).join('');
    return '<div class="quiz-question"><div class="quiz-q-text">' + (qi+1) + '. ' + q.pergunta + '</div>' +
      '<div class="quiz-options">' + opcoesHTML + '</div></div>';
  }).join('');
  var resultHTML = feito
    ? '<div class="quiz-result show ' + (aprovado ? 'aprovado' : 'reprovado') + '">' +
        (aprovado ? '&#127881; Parabens! Voce acertou ' + score + '/' + total + ' questoes!'
                  : '&#128161; Voce acertou ' + score + '/' + total + '. Revise e tente novamente.') +
      '</div><button class="btn-quiz btn-refazer" onclick="refazerQuiz(' + mod.id + ')">&#128260; Refazer</button>'
    : '<div class="quiz-result" id="quiz-result-' + mod.id + '"></div>';
  return '<div class="quiz-section"><div class="quiz-titulo">&#10067; Quiz - Modulo ' + mod.id + '</div>' +
    questoesHTML + (!feito ? '<button class="btn-quiz" onclick="responderQuiz(' + mod.id + ')">Enviar Respostas</button>' : '') +
    resultHTML + '</div>';
}
function responderQuiz(modId) {
  var mod = CURSO.modulos.find(function(m){ return m.id === modId; });
  if (!mod) return;
  var respostas = [], acertos = 0, todas = true;
  mod.quiz.forEach(function(q, qi) {
    var sel = document.querySelector('input[name="quiz-' + modId + '-q' + qi + '"]:checked');
    if (!sel) { todas = false; return; }
    var r = parseInt(sel.value); respostas.push(r);
    if (r === q.correta) acertos++;
  });
  if (!todas) { alert('Responda todas as questoes antes de enviar.'); return; }
  if (!estado.quizFeito) estado.quizFeito = {};
  if (!estado.quizScores) estado.quizScores = {};
  estado.quizFeito[modId] = true; estado.quizScores[modId] = acertos;
  estado['quiz_resp_' + modId] = respostas; salvarEstado();
  var section = document.getElementById('modulo-' + modId);
  var wasOpen = document.getElementById('modulo-card-' + modId).classList.contains('open');
  section.outerHTML = renderModuloCard(mod);
  if (wasOpen) { var card = document.getElementById('modulo-card-' + modId); if (card) card.classList.add('open'); }
  atualizarProgresso(); renderNav();
}
function refazerQuiz(modId) {
  delete estado.quizFeito[modId]; delete estado.quizScores[modId]; delete estado['quiz_resp_' + modId];
  salvarEstado();
  var mod = CURSO.modulos.find(function(m){ return m.id === modId; });
  var section = document.getElementById('modulo-' + modId);
  var wasOpen = document.getElementById('modulo-card-' + modId).classList.contains('open');
  section.outerHTML = renderModuloCard(mod);
  if (wasOpen) { var card = document.getElementById('modulo-card-' + modId); if (card) card.classList.add('open'); }
  atualizarProgresso(); renderNav();
}

// ===== CERTIFICADO =====
function mostrarCertificado() {
  var div = document.getElementById('cert-content');
  var data = new Date().toLocaleDateString('pt-BR');
  div.innerHTML = '<div class="cert-wrap"><div class="cert-logo">&#9670; EvoAssess</div>' +
    '<div class="cert-titulo">Certificado de Conclusao</div>' +
    '<div class="cert-sub">Este certificado e concedido a</div>' +
    '<div class="cert-nome">' + perfilAtual + '</div>' +
    '<div class="cert-curso">Curso de Avaliacao Fisica e Postural Profissional</div>' +
    '<div class="cert-data">Concluido em ' + data + '</div>' +
    '<button class="btn-imprimir-cert" onclick="window.print()">&#128424; Imprimir</button></div>';
  document.getElementById('modal-cert').style.display = 'flex';
}

// ===== ADMIN =====
function abrirAdmin() {
  var box = document.getElementById('admin-content');
  if (!adminLogado) {
    box.innerHTML = '<div class="admin-senha-wrap"><p style="color:#aaa;margin-bottom:.8rem">Senha do administrador:</p>' +
      '<input type="password" id="admin-senha-inp" placeholder="Senha..." onkeydown="if(event.key===\'Enter\')loginAdmin()"/>' +
      '<button class="btn-admin-login" onclick="loginAdmin()">Entrar</button></div>';
  } else { renderAdminPainel(); }
  document.getElementById('modal-admin').style.display = 'flex';
}
function loginAdmin() {
  var senha = document.getElementById('admin-senha-inp').value;
  if (senha === ADMIN_PASS) { adminLogado = true; renderAdminPainel(); }
  else { alert('Senha incorreta'); }
}
function renderAdminPainel() {
  var perfis = carregarPerfis();
  var box = document.getElementById('admin-content');
  var totalAulas = CURSO.modulos.reduce(function(s,m){ return s+m.aulas.length; }, 0);
  box.innerHTML = '<div class="admin-painel"><h3>Alunos cadastrados (' + perfis.length + ')</h3>' +
    (perfis.length === 0 ? '<p style="color:#aaa">Nenhum aluno ainda.</p>' :
      perfis.map(function(p) {
        var est = carregarEstado(p.nome);
        var feitas = est.aulasFeitas ? Object.keys(est.aulasFeitas).length : 0;
        var pct = totalAulas ? Math.round((feitas/totalAulas)*100) : 0;
        var acesso = p.ultimoAcesso ? new Date(p.ultimoAcesso).toLocaleDateString('pt-BR') : '-';
        return '<div class="admin-aluno-card"><div><div class="admin-aluno-nome">' + p.nome + '</div>' +
          '<div class="admin-aluno-meta">' + pct + '% concluido - ' + feitas + ' aulas - Acesso: ' + acesso + '</div></div>' +
          '<button class="btn-del" onclick="deletarAluno(\'' + p.nome + '\')">Excluir</button></div>';
      }).join('')
    ) + '</div>';
}
function deletarAluno(nome) {
  if (!confirm('Excluir aluno ' + nome + '?')) return;
  var perfis = carregarPerfis().filter(function(p){ return p.nome !== nome; });
  localStorage.setItem(PERFIS_KEY, JSON.stringify(perfis));
  localStorage.removeItem(getStorageKey(nome));
  renderAdminPainel();
}

// ===== AREA PROFISSIONAL =====
function abrirAreaProf() {
  renderFicha(); renderFichasSalvas(); renderProtocolo(); renderCalculadora();
  document.getElementById('modal-area-prof').style.display = 'flex';
}
function mudarModalTab(tab) {
  document.querySelectorAll('.mtab').forEach(function(b){ b.classList.remove('ativa'); });
  document.querySelectorAll('.modal-tab-content').forEach(function(c){ c.classList.remove('ativa'); });
  document.querySelector('[onclick="mudarModalTab(\'' + tab + '\')"]').classList.add('ativa');
  document.getElementById('modal-tab-' + tab).classList.add('ativa');
}
function renderFicha() {
  var div = document.getElementById('modal-tab-ficha');
  div.innerHTML = '<div class="ficha-section"><h4>1. Identificacao</h4>' +
    '<div class="ficha-grid">' +
    '<div class="ficha-campo full"><label>Nome do avaliado</label><input type="text" id="fic-nome" placeholder="Nome completo"/></div>' +
    '<div class="ficha-campo"><label>Data</label><input type="date" id="fic-data"/></div>' +
    '<div class="ficha-campo"><label>Idade</label><input type="number" id="fic-idade" placeholder="Anos"/></div>' +
    '<div class="ficha-campo"><label>Sexo</label><select id="fic-sexo"><option value="">Selecione</option><option>Masculino</option><option>Feminino</option></select></div>' +
    '<div class="ficha-campo"><label>Objetivo</label><input type="text" id="fic-objetivo" placeholder="Ex: Emagrecimento"/></div>' +
    '</div></div>' +
    '<div class="ficha-section"><h4>2. Medidas</h4>' +
    '<table class="tabela-medidas"><tr><th>Medida</th><th>Valor</th><th>Unidade</th></tr>' +
    '<tr><td>Peso</td><td><input type="number" id="fic-peso" step="0.1"/></td><td>kg</td></tr>' +
    '<tr><td>Estatura</td><td><input type="number" id="fic-altura" step="0.1"/></td><td>cm</td></tr>' +
    '<tr><td>Circ. Cintura</td><td><input type="number" id="fic-cintura" step="0.1"/></td><td>cm</td></tr>' +
    '<tr><td>Circ. Quadril</td><td><input type="number" id="fic-quadril" step="0.1"/></td><td>cm</td></tr>' +
    '</table></div>' +
    '<div class="ficha-section"><h4>3. Observacoes Posturais</h4>' +
    '<div class="ficha-campo"><textarea id="fic-obs" rows="4" placeholder="Descreva os achados posturais..."></textarea></div></div>' +
    '<button class="btn-salvar-ficha" onclick="salvarFicha()">&#128190; Salvar Ficha</button>';
  document.getElementById('fic-data').value = new Date().toISOString().split('T')[0];
}
function salvarFicha() {
  var nome = document.getElementById('fic-nome').value.trim();
  if (!nome) { alert('Informe o nome do avaliado.'); return; }
  var fichas = carregarFichas();
  fichas.push({ id: Date.now(), nome: nome,
    data: document.getElementById('fic-data').value,
    idade: document.getElementById('fic-idade').value,
    sexo: document.getElementById('fic-sexo').value,
    objetivo: document.getElementById('fic-objetivo').value,
    peso: document.getElementById('fic-peso').value,
    altura: document.getElementById('fic-altura').value,
    obs: document.getElementById('fic-obs').value });
  localStorage.setItem(FICHAS_KEY, JSON.stringify(fichas));
  mostrarToast('Ficha salva!'); renderFichasSalvas(); mudarModalTab('fichas-salvas');
}
function carregarFichas() { try { return JSON.parse(localStorage.getItem(FICHAS_KEY)) || []; } catch(e){ return []; } }
function renderFichasSalvas() {
  var div = document.getElementById('modal-tab-fichas-salvas');
  var fichas = carregarFichas();
  if (!fichas.length) { div.innerHTML = '<p style="color:#aaa;padding:1rem">Nenhuma ficha salva ainda.</p>'; return; }
  div.innerHTML = fichas.map(function(f) {
    var data = f.data ? new Date(f.data + 'T12:00').toLocaleDateString('pt-BR') : '-';
    return '<div class="ficha-card"><div class="ficha-card-nome">' + f.nome + '</div>' +
      '<div class="ficha-card-meta">' + data + ' - ' + (f.sexo||'-') + ' - ' + (f.idade||'-') + ' anos</div>' +
      '<div class="ficha-card-actions"><button class="btn-sm btn-sm-danger" onclick="deletarFicha(' + f.id + ')">Excluir</button></div></div>';
  }).join('');
}
function deletarFicha(id) {
  if (!confirm('Excluir esta ficha?')) return;
  var fichas = carregarFichas().filter(function(f){ return f.id !== id; });
  localStorage.setItem(FICHAS_KEY, JSON.stringify(fichas)); renderFichasSalvas();
}
function renderProtocolo() {
  var div = document.getElementById('modal-tab-protocolo');
  var fases = [
    { titulo: 'Pre-Avaliacao', itens: ['Verificar PAR-Q assinado','Preparar equipamentos','Calibrar balanca','Preparar ficha de avaliacao','Explicar procedimentos ao avaliado'] },
    { titulo: 'Durante a Avaliacao', itens: ['Registrar dados de identificacao','Aferir peso e estatura','Medir circunferencias','Coletar dobras cutaneas','Realizar avaliacao postural nas 4 vistas','Aplicar testes funcionais'] },
    { titulo: 'Pos-Avaliacao', itens: ['Calcular IMC e percentual de gordura','Elaborar laudo postural','Definir objetivos e metas','Apresentar resultados ao aluno','Arquivar ficha assinada'] }
  ];
  div.innerHTML = fases.map(function(fase) {
    return '<div class="protocolo-fase"><h4>' + fase.titulo + '</h4>' +
      fase.itens.map(function(item, i) {
        var id = 'prot-' + fase.titulo.replace(/\s/g,'') + i;
        return '<div class="protocolo-item" id="' + id + '" onclick="toggleProtocolo(\'' + id + '\')">' +
          '<div class="protocolo-check"></div>' + item + '</div>';
      }).join('') + '</div>';
  }).join('');
}
function toggleProtocolo(id) { var el = document.getElementById(id); if (el) el.classList.toggle('feito'); }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function mostrarToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2500);
}
// ===== CALCULADORA =====
function renderCalculadora() {
  var div = document.getElementById('modal-tab-calculadora');
  div.innerHTML = '<div class="calc-section"><h4>Dados do Avaliado</h4>' +
    '<div class="calc-grid">' +
      '<div class="calc-campo"><label>Sexo</label><select id="calc-sexo"><option value="M">Masculino</option><option value="F">Feminino</option></select></div>' +
      '<div class="calc-campo"><label>Idade (anos)</label><input type="number" id="calc-idade" placeholder="Ex: 30" min="1" max="120"/></div>' +
      '<div class="calc-campo"><label>Peso (kg)</label><input type="number" id="calc-peso" placeholder="Ex: 75.5" step="0.1"/></div>' +
      '<div class="calc-campo"><label>Estatura (cm)</label><input type="number" id="calc-altura" placeholder="Ex: 175" step="0.1"/></div>' +
    '</div></div>' +
    '<div class="calc-section"><h4>Dobras Cutaneas (mm) - Opcional</h4>' +
    '<div class="calc-grid cols3">' +
      '<div class="calc-campo"><label>Tricipital</label><input type="number" id="calc-tricipital" placeholder="mm" step="0.1"/></div>' +
      '<div class="calc-campo"><label>Subescapular</label><input type="number" id="calc-subescapular" placeholder="mm" step="0.1"/></div>' +
      '<div class="calc-campo"><label>Suprailiaca</label><input type="number" id="calc-suprailiaca" placeholder="mm" step="0.1"/></div>' +
      '<div class="calc-campo"><label>Abdominal</label><input type="number" id="calc-abdominal" placeholder="mm" step="0.1"/></div>' +
      '<div class="calc-campo"><label>Coxa</label><input type="number" id="calc-coxa" placeholder="mm" step="0.1"/></div>' +
      '<div class="calc-campo"><label>Peitoral (H)</label><input type="number" id="calc-peitoral" placeholder="mm" step="0.1"/></div>' +
    '</div>' +
    '<div class="calc-campo" style="margin-top:.5rem"><label>Protocolo</label>' +
      '<select id="calc-protocolo">' +
        '<option value="jp3">Jackson-Pollock 3 dobras</option>' +
        '<option value="jp7">Jackson-Pollock 7 dobras</option>' +
        '<option value="guedes">Guedes (3 dobras)</option>' +
        '<option value="faulkner">Faulkner (4 dobras)</option>' +
      '</select>' +
    '</div></div>' +
    '<div class="calc-section"><h4>Nivel de Atividade</h4>' +
    '<div class="calc-campo"><select id="calc-atividade">' +
      '<option value="1.2">Sedentario (sem exercicio)</option>' +
      '<option value="1.375">Levemente ativo (1-3x/semana)</option>' +
      '<option value="1.55" selected>Moderadamente ativo (3-5x/semana)</option>' +
      '<option value="1.725">Muito ativo (6-7x/semana)</option>' +
      '<option value="1.9">Extremamente ativo (2x/dia)</option>' +
    '</select></div></div>' +
    '<button class="btn-calcular" onclick="calcularTudo()">&#9889; Calcular Tudo</button>' +
    '<div class="calc-resultado" id="calc-resultado"></div>';
}

function calcularTudo() {
  var sexo = document.getElementById('calc-sexo').value;
  var idade = parseFloat(document.getElementById('calc-idade').value);
  var peso = parseFloat(document.getElementById('calc-peso').value);
  var altura = parseFloat(document.getElementById('calc-altura').value);
  var fatorAtiv = parseFloat(document.getElementById('calc-atividade').value);

  if (!idade || !peso || !altura) { alert('Preencha pelo menos sexo, idade, peso e estatura.'); return; }

  // IMC
  var alturaM = altura / 100;
  var imc = peso / (alturaM * alturaM);
  var imcClass = imc < 18.5 ? 'class-baixo' : imc < 25 ? 'class-normal' : imc < 30 ? 'class-sobrepeso' : 'class-obesidade';
  var imcLabel = imc < 18.5 ? 'Abaixo do peso' : imc < 25 ? 'Peso normal' : imc < 30 ? 'Sobrepeso' : imc < 35 ? 'Obesidade I' : imc < 40 ? 'Obesidade II' : 'Obesidade III';

  // Metabolismo Basal - Harris-Benedict revisado (Mifflin-St Jeor)
  var tmb;
  if (sexo === 'M') tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
  else tmb = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;

  var get = tmb * fatorAtiv; // Gasto Energetico Total

  // Percentual de gordura via dobras
  var percGordura = null;
  var protocolo = document.getElementById('calc-protocolo').value;
  var tri = parseFloat(document.getElementById('calc-tricipital').value) || 0;
  var sub = parseFloat(document.getElementById('calc-subescapular').value) || 0;
  var sup = parseFloat(document.getElementById('calc-suprailiaca').value) || 0;
  var abd = parseFloat(document.getElementById('calc-abdominal').value) || 0;
  var coxa = parseFloat(document.getElementById('calc-coxa').value) || 0;
  var peit = parseFloat(document.getElementById('calc-peitoral').value) || 0;

  var densidade = null;
  if (protocolo === 'jp3' && (tri + coxa + sup + peit) > 0) {
    var soma3;
    if (sexo === 'M') { soma3 = peit + abd + coxa; densidade = 1.10938 - (0.0008267 * soma3) + (0.0000016 * soma3 * soma3) - (0.0002574 * idade); }
    else { soma3 = tri + sup + coxa; densidade = 1.0994921 - (0.0009929 * soma3) + (0.0000023 * soma3 * soma3) - (0.0001392 * idade); }
  } else if (protocolo === 'jp7' && (tri + sub + sup + abd + coxa + peit) > 0) {
    var soma7 = peit + tri + sub + sup + abd + coxa + (sexo === 'M' ? 0 : tri);
    if (sexo === 'M') densidade = 1.112 - (0.00043499 * soma7) + (0.00000055 * soma7 * soma7) - (0.00028826 * idade);
    else densidade = 1.097 - (0.00046971 * soma7) + (0.00000056 * soma7 * soma7) - (0.00012828 * idade);
  } else if (protocolo === 'guedes' && (tri + sub + sup) > 0) {
    var soma3g = tri + sub + sup;
    if (sexo === 'M') densidade = 1.1714 - (0.0671 * Math.log(soma3g));
    else densidade = 1.1665 - (0.0706 * Math.log(soma3g));
  } else if (protocolo === 'faulkner' && (tri + sub + sup + abd) > 0) {
    percGordura = 0.153 * (tri + sub + sup + abd) + 5.783;
  }

  if (densidade !== null && percGordura === null) percGordura = (4.95 / densidade - 4.50) * 100;

  var massaGorda = percGordura !== null ? (peso * percGordura / 100) : null;
  var massaMagra = massaGorda !== null ? (peso - massaGorda) : null;

  // Macros sugeridos (emagrecimento moderado -500kcal)
  var calEmagr = get - 500;
  var calMant = get;
  var calHiper = get + 300;

  // Montar resultado
  var html = '<h4>Resultado da Avaliacao</h4>';

  // Cards principais
  html += '<div class="calc-cards">';
  html += '<div class="calc-card"><div class="cc-valor">' + imc.toFixed(1) + '</div><div class="cc-label">IMC</div><div class="cc-sub"><span class="calc-classificacao ' + imcClass + '">' + imcLabel + '</span></div></div>';
  html += '<div class="calc-card destaque"><div class="cc-valor">' + Math.round(tmb) + '</div><div class="cc-label">TMB (kcal/dia)</div><div class="cc-sub">Mifflin-St Jeor</div></div>';
  html += '<div class="calc-card destaque"><div class="cc-valor">' + Math.round(get) + '</div><div class="cc-label">GET (kcal/dia)</div><div class="cc-sub">Gasto total</div></div>';
  if (percGordura !== null) {
    html += '<div class="calc-card"><div class="cc-valor">' + percGordura.toFixed(1) + '%</div><div class="cc-label">% Gordura</div><div class="cc-sub">' + (massaMagra ? massaMagra.toFixed(1) + 'kg magra' : '') + '</div></div>';
    html += '<div class="calc-card"><div class="cc-valor">' + (massaGorda ? massaGorda.toFixed(1) : '-') + 'kg</div><div class="cc-label">Massa Gorda</div><div class="cc-sub">' + (massaMagra ? massaMagra.toFixed(1) + 'kg magra' : '') + '</div></div>';
  }
  html += '</div>';

  // Barra de gordura
  if (percGordura !== null) {
    var limiteIdeal = sexo === 'M' ? 17 : 24;
    var pctBarra = Math.min(percGordura, 40);
    var corBarra = percGordura <= limiteIdeal ? '#22c55e' : percGordura <= (sexo === 'M' ? 25 : 32) ? '#f0c040' : '#ef4444';
    html += '<div class="calc-barra-wrap">' +
      '<div class="calc-barra-label"><span>0%</span><span>Ideal: ate ' + limiteIdeal + '%</span><span>40%</span></div>' +
      '<div class="calc-barra"><div class="calc-barra-fill" style="width:' + (pctBarra/40*100) + '%;background:' + corBarra + '"></div>' +
      '<div class="calc-barra-marker" style="left:' + (limiteIdeal/40*100) + '%"></div></div></div>';
  }

  // Tabela de macros
  html += '<h4 style="margin-top:1.2rem">Distribuicao de Macronutrientes</h4>';
  html += '<table class="calc-tabela-macro"><tr><th>Objetivo</th><th>Calorias</th><th>Proteina</th><th>Carboidrato</th><th>Gordura</th></tr>';
  var objetivos = [
    { nome: 'Emagrecimento', cal: calEmagr },
    { nome: 'Manutencao', cal: calMant },
    { nome: 'Hipertrofia', cal: calHiper }
  ];
  objetivos.forEach(function(obj) {
    var prot = massaMagra ? (massaMagra * 2.2) : (peso * 1.8);
    var gord = obj.cal * 0.25 / 9;
    var carb = (obj.cal - (prot * 4) - (gord * 9)) / 4;
    html += '<tr><td>' + obj.nome + '</td><td><strong>' + Math.round(obj.cal) + ' kcal</strong></td>' +
      '<td>' + Math.round(prot) + 'g</td><td>' + Math.round(carb) + 'g</td><td>' + Math.round(gord) + 'g</td></tr>';
  });
  html += '</table>';

  // Alerta
  html += '<div class="calc-alerta">&#9888; Estes calculos sao estimativas baseadas em equacoes validadas. Para prescricao nutricional, encaminhe ao nutricionista.</div>';

  var res = document.getElementById('calc-resultado');
  res.innerHTML = html;
  res.classList.add('show');
}