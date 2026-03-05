/* KOOSY Education Kit — Core App */
(function(){
  'use strict';
  var BASE=(function(){var p=window.location.pathname;return(p.indexOf('/channels/')!==-1||p.indexOf('/showroom/')!==-1)?'../catalog/':'catalog/'})();
  var COLOR_MAP={red:'#ef4444',blue:'#3b82f6',green:'#10b981',purple:'#8b5cf6',yellow:'#f59e0b',white:'#f5f5f5',black:'#1a1a1a'};
  var CAT_ICONS={kit:'\uD83D\uDD27',course:'\uD83D\uDCDA',template:'\uD83E\uDD16',bundle:'\uD83D\uDCE6'};
  var catalog=null;
  window.KOOSY={COLOR_MAP:COLOR_MAP,CAT_ICONS:CAT_ICONS,getCatalog:getCatalog,formatPrice:formatPrice,getColorHex:getColorHex,getCatIcon:getCatIcon};
  function getCatalog(){if(catalog)return Promise.resolve(catalog);return fetch(BASE+'index.json').then(function(r){return r.json()}).then(function(d){catalog=d;return d})}
  function formatPrice(n){return'\u20A9'+Number(n).toLocaleString('ko-KR')}
  function getColorHex(name){return COLOR_MAP[name]||'#888'}
  function getCatIcon(cat){return CAT_ICONS[cat.split('/')[0]]||'\uD83D\uDCE6'}
  function initLoader(){var l=document.querySelector('.loader');if(!l)return;var s=Date.now();function dismiss(){var d=Math.max(0,800-(Date.now()-s));setTimeout(function(){l.classList.add('is-done');setTimeout(function(){if(l.parentNode)l.parentNode.removeChild(l)},700)},d)}if(document.readyState==='complete')dismiss();else window.addEventListener('load',dismiss)}
  function initNavScroll(){var n=document.querySelector('.nav');if(!n)return;var s=false;function onS(){var is=window.scrollY>10;if(is!==s){s=is;n.classList.toggle('nav--scrolled',s)}}window.addEventListener('scroll',onS,{passive:true});onS()}
  function initActiveChannel(){var tabs=document.querySelectorAll('.nav__ch');if(!tabs.length)return;var p=window.location.pathname;for(var i=0;i<tabs.length;i++){var h=tabs[i].getAttribute('href');if(h&&p.indexOf(h.replace(/^\.\.?\//,''))!==-1)tabs[i].classList.add('is-active')}}
  function init(){initLoader();initNavScroll();initActiveChannel()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
