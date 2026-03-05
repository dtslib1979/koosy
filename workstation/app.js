/* === KOOSY WORKSTATION — AUTH + MODULES === */
(function(){
  'use strict';

  var HASH='5817ae4948371f9b6b7d94615c0704e6a13ba5a773938351ebd832d0fcdbdf2f';
  var SESSION_KEY='koosy_ws_session';
  var SESSION_TTL=24*60*60*1000;

  function sha256(str){
    var buf=new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256',buf).then(function(h){
      return Array.from(new Uint8Array(h)).map(function(b){return b.toString(16).padStart(2,'0')}).join('');
    });
  }

  function getSession(){
    try{ var s=JSON.parse(localStorage.getItem(SESSION_KEY)); if(s&&s.t&&(Date.now()-s.t)<SESSION_TTL)return true; }catch(e){}
    return false;
  }
  function setSession(){ localStorage.setItem(SESSION_KEY,JSON.stringify({t:Date.now()})); }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); }

  window.KOOSY=window.KOOSY||{};
  window.KOOSY.ws={
    isAuth:getSession,
    logout:function(){clearSession();location.href='index.html';},

    initGate:function(){
      if(getSession()){location.href='dashboard.html';return;}
      var form=document.getElementById('gateForm');
      var input=document.getElementById('gateInput');
      var err=document.getElementById('gateError');
      if(!form)return;
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var val=input.value.trim();
        if(!val)return;
        sha256(val).then(function(h){
          if(h===HASH){
            setSession();
            location.href='dashboard.html';
          }else{
            err.textContent='Access denied';
            err.classList.add('is-visible');
            form.classList.add('shake');
            input.value='';
            input.focus();
            setTimeout(function(){form.classList.remove('shake')},400);
            setTimeout(function(){err.classList.remove('is-visible')},2000);
          }
        });
      });
      input.focus();
    },

    initDashboard:function(){
      if(!getSession()){location.href='index.html';return;}
      this._initIdeaBoard();
      this._initProductTracker();
      this._initAnalytics();
      this._initNotes();
      this._initReveal();
    },

    _initIdeaBoard:function(){
      var KEY='koosy_ws_ideas';
      var container=document.getElementById('ideaCards');
      var input=document.getElementById('ideaInput');
      var addBtn=document.getElementById('ideaAdd');
      if(!container)return;
      function load(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch(e){return[];}}
      function save(ideas){localStorage.setItem(KEY,JSON.stringify(ideas));}
      function render(){
        var ideas=load();
        if(!ideas.length){container.innerHTML='<div class="ws-module__empty">No ideas yet</div>';return;}
        var html='';
        for(var i=ideas.length-1;i>=0;i--){
          html+='<div class="idea-card" data-idx="'+i+'"><div class="idea-card__text">'+escHtml(ideas[i].text)+'</div><div class="idea-card__time">'+timeAgo(ideas[i].ts)+'</div><button class="idea-card__del" data-idx="'+i+'" title="Delete">&times;</button></div>';
        }
        container.innerHTML=html;
        container.querySelectorAll('.idea-card__del').forEach(function(btn){
          btn.addEventListener('click',function(){ var idx=parseInt(this.getAttribute('data-idx')); var ideas=load();ideas.splice(idx,1);save(ideas);render(); });
        });
      }
      function addIdea(){ var text=input.value.trim(); if(!text)return; var ideas=load(); ideas.push({text:text,ts:Date.now()}); save(ideas); input.value=''; render(); }
      if(addBtn)addBtn.addEventListener('click',addIdea);
      if(input)input.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();addIdea();} });
      render();
    },

    _initProductTracker:function(){
      var container=document.getElementById('productList');
      if(!container)return;
      fetch('../catalog/index.json').then(function(r){return r.json()}).then(function(data){
        var products=data.products||[];
        if(!products.length){container.innerHTML='<div class="ws-module__empty">No products</div>';return;}
        var html='';
        for(var i=0;i<products.length;i++){
          var p=products[i];
          var stateClass=p.state==='ALL_LIVE'?'live':'ready';
          html+='<div class="product-row"><div><div class="product-row__name">'+escHtml(p.name)+'</div><div class="product-row__price">₩'+p.price.toLocaleString()+'</div></div><div class="product-row__state product-row__state--'+stateClass+'">'+p.state.replace('_',' ')+'</div></div>';
        }
        container.innerHTML=html;
      }).catch(function(){container.innerHTML='<div class="ws-module__empty">Failed to load</div>';});
    },

    _initAnalytics:function(){
      var container=document.getElementById('analyticsBody');
      if(!container)return;
      fetch('../analytics/dashboard.json').then(function(r){return r.json()}).then(function(data){
        var kpi=data.kpi||{};
        var html='<div class="analytics-grid">';
        html+='<div class="analytics-card"><div class="analytics-card__label">Revenue</div><div class="analytics-card__value">₩'+(kpi.total_revenue||0).toLocaleString()+'</div></div>';
        html+='<div class="analytics-card"><div class="analytics-card__label">Orders</div><div class="analytics-card__value">'+(kpi.total_orders||0)+'</div></div>';
        html+='<div class="analytics-card"><div class="analytics-card__label">Traffic</div><div class="analytics-card__value">'+(kpi.total_traffic||0)+'</div></div>';
        html+='<div class="analytics-card"><div class="analytics-card__label">Products</div><div class="analytics-card__value">'+(kpi.products_live||0)+' / '+(kpi.products_total||0)+'</div></div>';
        html+='</div>';
        container.innerHTML=html;
      }).catch(function(){container.innerHTML='<div class="ws-module__empty">Failed to load</div>';});
    },

    _initNotes:function(){
      var KEY='koosy_ws_notes';
      var area=document.getElementById('notesArea');
      if(!area)return;
      area.value=localStorage.getItem(KEY)||'';
      var timer;
      area.addEventListener('input',function(){ clearTimeout(timer); timer=setTimeout(function(){localStorage.setItem(KEY,area.value);},500); });
    },

    _initReveal:function(){
      if(!('IntersectionObserver' in window)){ document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('is-visible');}); return; }
      var obs=new IntersectionObserver(function(entries){ entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}}); },{threshold:0.1});
      document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});
    }
  };

  function escHtml(s){ var d=document.createElement('div');d.textContent=s;return d.innerHTML; }
  function timeAgo(ts){ var d=Date.now()-ts; if(d<60000)return 'just now'; if(d<3600000)return Math.floor(d/60000)+'m ago'; if(d<86400000)return Math.floor(d/3600000)+'h ago'; return Math.floor(d/86400000)+'d ago'; }
})();
