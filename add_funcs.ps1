$f = (Resolve-Path "curso-avaliacao/app.js").Path
$enc = [System.Text.Encoding]::UTF8

$funcs = @"

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
  renderFicha(); renderFichasSalvas(); renderProtocolo();
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
"@

[System.IO.File]::AppendAllText($f, $funcs, $enc)
Write-Output "Funcoes adicionadas! Total linhas: $((Get-Content $f).Count)"
