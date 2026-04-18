$f = (Resolve-Path "app.js").Path

# MODULO 2
$m2 = @'

CURSO.modulos.push({
  id: 2,
  titulo: 'Composicao Corporal',
  aulas: [
    { id: 201, titulo: 'Conceitos: massa magra, gordura e agua corporal', duracao: '13 min',
      conteudo: '<h3>Composicao Corporal</h3><p>A composicao corporal descreve as proporcoes dos diferentes componentes do corpo humano. Os principais sao: massa magra (musculos, ossos, orgaos), gordura corporal e agua corporal.</p><div class="destaque"><strong>Modelo de 2 compartimentos:</strong> Divide o corpo em massa gorda e massa livre de gordura (MLG). E o mais utilizado na pratica.</div><div class="tabela-wrap"><table><tr><th>Componente</th><th>Homens</th><th>Mulheres</th></tr><tr><td>Gordura essencial</td><td>2-5%</td><td>10-13%</td></tr><tr><td>Atletico</td><td>6-13%</td><td>14-20%</td></tr><tr><td>Fitness</td><td>14-17%</td><td>21-24%</td></tr><tr><td>Aceitavel</td><td>18-24%</td><td>25-31%</td></tr><tr><td>Obesidade</td><td>25%+</td><td>32%+</td></tr></table></div><p>A agua corporal representa 60-70% do peso corporal total e varia conforme hidratacao, temperatura e composicao corporal.</p>' },
    { id: 202, titulo: 'Dobras cutaneas: protocolo e tecnica', duracao: '18 min',
      conteudo: '<h3>Dobras Cutaneas</h3><p>A adipometria por dobras cutaneas e o metodo mais utilizado na pratica do personal trainer. Requer treinamento e padronizacao para resultados confiaveis.</p><div class="alerta"><strong>Regra de ouro:</strong> Sempre use o mesmo protocolo, o mesmo avaliador e o mesmo adipometro nas reavaliações.</div><p><strong>Tecnica correta:</strong></p><ol><li>Marque o ponto anatomico com caneta dermografica</li><li>Pegue a dobra com polegar e indicador, 1 cm acima do ponto</li><li>Aplique o adipometro perpendicular a dobra</li><li>Aguarde 2 segundos e leia</li><li>Repita 3 vezes e use a mediana</li></ol><p><strong>Principais pontos:</strong> Tricipital, Bicipital, Subescapular, Peitoral, Axilar media, Suprailiaca, Abdominal, Coxa, Panturrilha medial.</p><div class="destaque">Protocolo de 7 dobras de Jackson e Pollock e o mais validado para populacao geral.</div>' },
    { id: 203, titulo: 'Protocolos: Jackson-Pollock, Guedes, Faulkner', duracao: '16 min',
      conteudo: '<h3>Protocolos de Estimativa de Gordura</h3><div class="tabela-wrap"><table><tr><th>Protocolo</th><th>Dobras</th><th>Populacao</th></tr><tr><td>Jackson-Pollock 7</td><td>Peitoral, Axilar, Tricipital, Subescapular, Abdominal, Suprailiaca, Coxa</td><td>Adultos geral</td></tr><tr><td>Jackson-Pollock 3 (H)</td><td>Peitoral, Abdominal, Coxa</td><td>Homens</td></tr><tr><td>Jackson-Pollock 3 (M)</td><td>Tricipital, Suprailiaca, Coxa</td><td>Mulheres</td></tr><tr><td>Guedes</td><td>Tricipital, Subescapular, Suprailiaca</td><td>Brasileiros</td></tr><tr><td>Faulkner</td><td>Tricipital, Subescapular, Suprailiaca, Abdominal</td><td>Atletas</td></tr></table></div><p>Para calcular o percentual de gordura, aplique a formula de Siri: %G = (4,95/D - 4,50) x 100, onde D e a densidade corporal obtida pela equacao do protocolo escolhido.</p>' },
    { id: 204, titulo: 'IMC, circunferencias e relacao cintura-quadril', duracao: '12 min',
      conteudo: '<h3>Indices Antropometricos</h3><p><strong>IMC (Indice de Massa Corporal):</strong> Peso(kg) / Altura(m)^2</p><div class="tabela-wrap"><table><tr><th>IMC</th><th>Classificacao</th></tr><tr><td>Abaixo de 18,5</td><td>Abaixo do peso</td></tr><tr><td>18,5 - 24,9</td><td>Peso normal</td></tr><tr><td>25,0 - 29,9</td><td>Sobrepeso</td></tr><tr><td>30,0 - 34,9</td><td>Obesidade grau I</td></tr><tr><td>35,0 - 39,9</td><td>Obesidade grau II</td></tr><tr><td>40,0+</td><td>Obesidade grau III</td></tr></table></div><div class="alerta">O IMC nao diferencia massa muscular de gordura. Um atleta pode ter IMC elevado sem obesidade.</div><p><strong>Relacao Cintura-Quadril (RCQ):</strong> Cintura / Quadril. Risco elevado: Homens > 0,95 | Mulheres > 0,85</p><p><strong>Circunferencia abdominal:</strong> Risco elevado: Homens > 94cm | Mulheres > 80cm. Risco muito elevado: Homens > 102cm | Mulheres > 88cm.</p>' }
  ],
  quiz: [
    { pergunta: 'Qual protocolo de dobras cutaneas e mais indicado para brasileiros?', opcoes: ['Faulkner', 'Jackson-Pollock 7', 'Guedes', 'Durnin-Womersley'], correta: 2 },
    { pergunta: 'O IMC e calculado por:', opcoes: ['Peso / Altura', 'Peso / Altura ao quadrado', 'Altura / Peso', 'Circunferencia / Altura'], correta: 1 },
    { pergunta: 'Qual o risco de circunferencia abdominal para mulheres?', opcoes: ['Acima de 80cm', 'Acima de 90cm', 'Acima de 70cm', 'Acima de 100cm'], correta: 0 }
  ]
});
'@
Add-Content -Path $f -Value $m2 -Encoding UTF8

# MODULO 3
$m3 = @'

CURSO.modulos.push({
  id: 3,
  titulo: 'Avaliacao Postural',
  aulas: [
    { id: 301, titulo: 'Postura ideal e desvios posturais', duracao: '15 min',
      conteudo: '<h3>Postura Ideal e Desvios Posturais</h3><p>A postura ideal e aquela em que o alinhamento dos segmentos corporais minimiza o estresse sobre estruturas passivas (ligamentos, capsulas) e o trabalho muscular necessario para manter a posicao.</p><div class="destaque"><strong>Linha de prumo:</strong> Na vista lateral, deve passar pelo lobulo da orelha, processo acromio, grande trocanter, ligeiramente anterior ao joelho e ao maleo lateral.</div><p><strong>Principais desvios:</strong></p><ul><li><strong>Hiperlordose cervical:</strong> Aumento da curvatura cervical</li><li><strong>Hipercifose toracica:</strong> Aumento da curvatura toracica (corcunda)</li><li><strong>Hiperlordose lombar:</strong> Aumento da curvatura lombar</li><li><strong>Escoliose:</strong> Desvio lateral da coluna</li><li><strong>Anteroversao pelvica:</strong> Pelve inclinada para frente</li><li><strong>Retroversao pelvica:</strong> Pelve inclinada para tras</li></ul>' },
    { id: 302, titulo: 'Avaliacao nas 4 vistas: anterior, posterior, lateral D e E', duracao: '20 min',
      conteudo: '<h3>Avaliacao nas 4 Vistas</h3><p>A avaliacao postural deve ser realizada nas 4 vistas para uma analise completa.</p><p><strong>Vista Anterior:</strong></p><ul><li>Alinhamento da cabeca (inclinacao lateral)</li><li>Nivel dos ombros (simetria)</li><li>Nivel das cristas iliacas</li><li>Joelhos: valgo (X) ou varo (O)</li><li>Pe: pronado ou supinado</li></ul><p><strong>Vista Posterior:</strong></p><ul><li>Alinhamento da coluna (escoliose)</li><li>Nivel das escapulas (alada, elevada, deprimida)</li><li>Nivel dos gluteos</li><li>Eixo do calcaneo</li></ul><p><strong>Vista Lateral Direita e Esquerda:</strong></p><ul><li>Posicao da cabeca (protracao)</li><li>Curvatura cervical, toracica e lombar</li><li>Posicao do ombro (protracao)</li><li>Posicao da pelve (anteroversao/retroversao)</li><li>Joelho: hiperextensao ou flexao</li></ul><div class="alerta">Sempre avalie o aluno em roupas adequadas (shorts e top) para visualizar os pontos anatomicos.</div>' },
    { id: 303, titulo: 'Testes funcionais: overhead squat, single leg squat', duracao: '18 min',
      conteudo: '<h3>Testes Funcionais</h3><p>Os testes funcionais avaliam padroes de movimento e revelam disfuncoes que a avaliacao estatica nao detecta.</p><p><strong>Overhead Squat (Agachamento com Braco Elevado):</strong></p><ul><li>Instrucao: Pes na largura dos ombros, bracos elevados acima da cabeca, agachar ate 90 graus</li><li>Observe: Queda dos bracos para frente, inclinacao do tronco, joelhos caindo para dentro (valgo), elevacao dos calcanhares</li></ul><p><strong>Single Leg Squat (Agachamento Unipodal):</strong></p><ul><li>Instrucao: Apoio em um pe, agachar ate 45 graus</li><li>Observe: Valgo do joelho, inclinacao lateral do tronco, queda da pelve (sinal de Trendelenburg)</li></ul><p><strong>Teste de Thomas:</strong> Avalia encurtamento do iliopsoas e reto femoral. Deitado, flexionar um joelho ao peito — o outro membro deve permanecer apoiado na maca.</p><div class="destaque">Os testes funcionais guiam a prescricao corretiva com muito mais precisao que a avaliacao estatica isolada.</div>' },
    { id: 304, titulo: 'Relacao postura-dor: sindrome cruzada de Janda', duracao: '14 min',
      conteudo: '<h3>Sindrome Cruzada de Janda</h3><p>Vladimir Janda descreveu padroes previstos de desequilibrio muscular que levam a disfuncoes posturais e dor.</p><p><strong>Sindrome Cruzada Superior:</strong></p><ul><li>Musculos encurtados/hiperativos: Peitoral menor, esternocleidomastoideo, escalenos, suboccipitais, elevador da escapula, trapezio superior</li><li>Musculos inibidos/fracos: Flexores profundos do pescoco, trapezio medio e inferior, serrátil anterior, romboides</li><li>Resultado: Protracao de cabeca e ombros, hipercifose toracica</li></ul><p><strong>Sindrome Cruzada Inferior:</strong></p><ul><li>Musculos encurtados/hiperativos: Iliopsoas, reto femoral, tensor da fascia lata, eretor da espinha lombar</li><li>Musculos inibidos/fracos: Gluteo maximo, abdominais profundos, isquiotibiais</li><li>Resultado: Anteroversao pelvica, hiperlordose lombar</li></ul><div class="destaque">Identificar o padrao de Janda permite criar um protocolo corretivo sistematico e eficiente.</div>' }
  ],
  quiz: [
    { pergunta: 'Na sindrome cruzada inferior, qual musculo tipicamente esta inibido?', opcoes: ['Iliopsoas', 'Reto femoral', 'Gluteo maximo', 'Eretor da espinha'], correta: 2 },
    { pergunta: 'O overhead squat avalia principalmente:', opcoes: ['Forca maxima', 'Padroes de movimento e disfuncoes', 'Composicao corporal', 'Flexibilidade isolada'], correta: 1 },
    { pergunta: 'A anteroversao pelvica esta associada a:', opcoes: ['Hipercifose toracica', 'Hiperlordose lombar', 'Escoliose', 'Retroversao cervical'], correta: 1 }
  ]
});
'@
Add-Content -Path $f -Value $m3 -Encoding UTF8

Write-Output "modulos 2 e 3 ok"
'@
