
// == Simulados: patch de exercícios extras (AFEAM 2009 A06 e CET 2008 Prova 24) ==
// Como usar: copie este arquivo para "site_concurso/patch_exercicios_extras.js"
// e adicione a linha abaixo antes do fechamento </body> do index.html:
// <script src="patch_exercicios_extras.js"></script>
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var el = document.getElementById('gabaritos-data');
    if(!el){ console.warn('[patch] gabaritos-data não encontrado'); return; }
    var data = {};
    try{ data = JSON.parse(el.textContent || '{}'); }catch(e){ data = {}; }
    data.gabaritos = data.gabaritos || {};
    data.provas = data.provas || {};

    // --- PDFs esperados (copie os arquivos para a pasta "provas/") ---
    var extrasProvas = {
      "AFEAM2009_A06": "provas/a06_analista_de_fomento_tecnologia_da_informacao_suporte_tecnico_hardware_e_software_x.pdf",
      "CET2008_Prova24": "provas/24_prova.pdf"
    };

    // --- Gabaritos ---
    var gabAFEAM = {
      1:'B',2:'D',3:'C',4:'E',5:'A',6:'B',7:'A',8:'E',9:'C',10:'D',11:'A',12:'E',13:'B',14:'B',15:'C',16:'D',17:'D',18:'A',19:'C',20:'E',21:'*',22:'B',23:'A',24:'C',25:'E',26:'E',27:'C',28:'A',29:'D',30:'B',31:'C',32:'B',33:'D',34:'D',35:'C',36:'E',37:'A',38:'C',39:'A',40:'*',
      41:'C',42:'B',43:'B',44:'B',45:'E',46:'B',47:'A',48:'C',49:'E',50:'A',51:'D',52:'D',53:'C',54:'A',55:'E',56:'C',57:'B',58:'C',59:'A',60:'E'
    };

    var gabCET24_list = ['C','B','C','A','C','C','B','D','A','C','A','D','B','B','C','B','A','B','D','B','C','A','C','D','A','C','B','D','A','C','A','D','D','B','A','D','C','C','A','B','B','B','D','C','C','B','C','C','A','C','B','C','C','A','C'];
    var gabCET = {}; gabCET_list = gabCET24_list; for(var i=1;i<=gabCET_list.length;i++){ gabCET[i]=gabCET_list[i-1]; }

    // Mescla com dados existentes
    data.provas = Object.assign({}, data.provas, extrasProvas);
    data.gabaritos["AFEAM2009_A06"] = gabAFEAM;
    data.gabaritos["CET2008_Prova24"] = gabCET;

    // Atualiza o bloco JSON na página
    try{ el.textContent = JSON.stringify(data); }catch(e){ console.warn('[patch] não foi possível sobrescrever JSON', e); }

    // Adiciona opções ao select do Simulado (se ainda não houver)
    var sel = document.getElementById('simProva');
    if(sel){
      if(!sel.querySelector('option[value="AFEAM2009_A06"]')){
        var o1 = document.createElement('option'); o1.value = 'AFEAM2009_A06'; o1.textContent = 'AFEAM 2009 — TI Suporte (60q)'; sel.appendChild(o1);
      }
      if(!sel.querySelector('option[value="CET2008_Prova24"]')){
        var o2 = document.createElement('option'); o2.value = 'CET2008_Prova24'; o2.textContent = 'CET 2008 — ATI Gestão SW/HW (55q)'; sel.appendChild(o2);
      }
    }

    // Garante suporte a questão anulada (*): se o engine original não tratar,
    // interceptamos o botão "Corrigir" e aplicamos correção robusta.
    var btnCorrigir = document.getElementById('simCorrigir');
    var resultadoEl = document.getElementById('simResultado');
    function currentGab(){ 
      var prova = (document.getElementById('simProva')||{}).value || '';
      var base = (data.gabaritos||{})[prova] || {}; 
      try{ var extra = JSON.parse(localStorage.getItem('gab-manual-'+prova) || '{}'); }catch(e){ extra = {}; }
      return Object.assign({}, base, extra);
    }
    function corrigeRobusto(){
      var simQtd = document.getElementById('simQtd'); var q = parseInt(simQtd && simQtd.value || '40', 10);
      var g = currentGab(); var ac=0,er=0,br=0,an=0;
      var val = parseFloat((document.getElementById('simValor')||{}).value || '1');
      var pen = parseFloat((document.getElementById('simPen')||{}).value || '0');
      for(var i=1;i<=q;i++){
        var sel = document.querySelector('input[name="sim-q'+i+'"]:checked');
        var r = sel ? sel.value : null;
        if(!g[i]){ if(!r){br++;} else {er++;} continue; }
        if(g[i]==='*'){ ac++; an++; continue; }
        if(!r){ br++; continue; }
        if(g[i]===r){ ac++; } else { er++; }
      }
      var nota = ac*val - er*pen; var pct = Math.round(100*ac/Math.max(1,q));
      if(resultadoEl){
        resultadoEl.innerHTML = '<div class="doc" style="background:#f0fff7;border-color:#bbf7d0"><strong>Resultado:</strong> '
          + ac + ' acertos, ' + er + ' erros, ' + br + ' em branco (anuladas: ' + an + '). '
          + 'Nota: <strong>' + nota.toFixed(2) + '</strong> (' + pct + '%)</div>';
      }
    }
    if(btnCorrigir && !btnCorrigir.dataset.patchExtras){
      btnCorrigir.dataset.patchExtras = '1';
      btnCorrigir.addEventListener('click', function(ev){
        try{
          // tenta detectar se o engine original já tratou (*) — se não, sobrescreve
          setTimeout(function(){ corrigeRobusto(); }, 0);
        }catch(e){ corrigeRobusto(); }
      }, true);
    }

    // Recarrega PDF/Quiz ao trocar prova
    var selProva = document.getElementById('simProva');
    if(selProva){
      selProva.addEventListener('change', function(){
        // dispara o fluxo normal do site; se não existir, apenas limpa o resultado
        if(resultadoEl) resultadoEl.innerHTML = '';
      });
    }

    console.log('[patch] Exercícios extras adicionados.');
  });
})();
