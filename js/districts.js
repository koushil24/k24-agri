/* K_24 AGRI – districts.js (Phase 2): District > Taluk selector for the homepage.
   Reads data/districts.json so districts and taluks can be edited without touching code. */
(function () {
  var base = document.body.getAttribute('data-base') || '';
  var selDistrict = document.getElementById('selDistrict');
  var selTaluk = document.getElementById('selTaluk');
  var result = document.getElementById('locResult');
  if (!selDistrict || !selTaluk) return;

  var districts = [];

  function option(value, text) {
    var o = document.createElement('option');
    o.value = value; o.textContent = text; return o;
  }

  function showError() {
    selDistrict.innerHTML = '';
    selDistrict.appendChild(option('', 'Districts could not be loaded'));
    selDistrict.disabled = true;
    result.hidden = false;
    result.className = 'location-result status-error';
    result.textContent = 'The district list could not be loaded. Please refresh the page.';
  }

  function fillDistricts() {
    selDistrict.innerHTML = '';
    selDistrict.appendChild(option('', 'Select a district'));
    districts.forEach(function (d) { selDistrict.appendChild(option(d.id, d.en)); });
  }

  function find(id) { return districts.filter(function (d) { return d.id === id; })[0]; }

  function update() {
    var d = find(selDistrict.value);
    selTaluk.innerHTML = '';
    selTaluk.appendChild(option('', 'Select a taluk'));
    result.hidden = true;
    if (!d) { selTaluk.disabled = true; return; }
    if (d.taluks.length === 0) {
      selTaluk.disabled = true;
      selTaluk.options[0].textContent = 'Taluk data not added yet';
    } else {
      d.taluks.forEach(function (t) { selTaluk.appendChild(option(t.id, t.en)); });
      selTaluk.disabled = false;
    }
    var link = base + 'pages/district-explorer.html?district=' + encodeURIComponent(d.id);
    result.hidden = false;
    result.className = 'location-result';
    result.innerHTML = '';
    var p = document.createElement('p');
    p.style.margin = '0 0 .6rem';
    p.textContent = 'Karnataka > ' + d.en + (d.demo ? ' (demonstration region)' : '');
    var a = document.createElement('a');
    a.className = 'btn btn-primary';
    a.href = link;
    a.textContent = 'Open District Explorer';
    result.appendChild(p); result.appendChild(a);
  }

  fetch(base + 'data/districts.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) { districts = data.districts; fillDistricts(); })
    .catch(showError);

  selDistrict.addEventListener('change', update);
})();
