$f = (Resolve-Path "curso-avaliacao/app.js").Path
$enc = [System.Text.Encoding]::UTF8

$calc = @"

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
"@

[System.IO.File]::AppendAllText($f, $calc, $enc)
Write-Output "Calculadora adicionada! Linhas: $((Get-Content $f).Count)"
