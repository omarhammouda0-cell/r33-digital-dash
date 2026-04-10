document.addEventListener('DOMContentLoaded', function() {

  // ── SELECT ──
  const rpmValue     = document.getElementById('rpm-value');
  const rpmSegRow    = document.getElementById('rpm-seg-row');
  const coolantValue = document.getElementById('coolant-value');
  const coolantFill  = document.getElementById('coolant-fill');
  const batteryValue = document.getElementById('battery-value');
  const batteryFill  = document.getElementById('battery-fill');
  const boostValue   = document.getElementById('boost-value');
  const afrValue     = document.getElementById('afr-value');
  const afrFill      = document.getElementById('afr-fill');
  const iatValue     = document.getElementById('iat-value');
  const iatFill      = document.getElementById('iat-fill');
  const tpsValue     = document.getElementById('tps-value');
  const tpsFill      = document.getElementById('tps-fill');
  const faultCoolant = document.getElementById('fault-coolant');
  const faultBattery = document.getElementById('fault-battery');
  const faultBoost   = document.getElementById('fault-boost');
  const noFault      = document.querySelector('.no-fault');


  // ── BUILD SEGMENTS ──
  const SEGS  = 40;
  const MIN_H = 12;
  const MAX_H = 80;

function segHeight(i) {
  const t = i / (SEGS - 1);
  const curved = t * t * t;
  return Math.round(MIN_H + (curved * (MAX_H - MIN_H)));
}
  for (let i = 0; i < SEGS; i++) {
    const seg = document.createElement('div');
    seg.className = 'seg';
    seg.style.height = segHeight(i) + 'px';
    rpmSegRow.appendChild(seg);
  }


  // ── HELPER — colour ──
  function setColour(element, value, warnAt, dangerAt) {
    if (value >= dangerAt) {
      element.classList.add('danger');
      element.classList.remove('warn', 'cool');
    } else if (value >= warnAt) {
      element.classList.add('warn');
      element.classList.remove('cool', 'danger');
    } else {
      element.classList.add('cool');
      element.classList.remove('warn', 'danger');
    }
  }


  // ── HELPER — bar width ──
  function setBar(fillElement, value, max) {
    let percent = Math.round((value / max) * 100);
    fillElement.style.width = percent + '%';
  }


  // ── HELPER — faults ──
  function showFaults(coolantFault, batteryFault, boostFault) {
    faultCoolant.classList.toggle('active', coolantFault);
    faultBattery.classList.toggle('active', batteryFault);
    faultBoost.classList.toggle('active', boostFault);
    noFault.classList.toggle('active', !coolantFault && !batteryFault && !boostFault);
  }


  // ── UPDATE ──
  function updateDash() {
    let rpm     = Math.round(Math.random() * 8000);
    let coolant = Math.round(Math.random() * 120);
    let battery = +(Math.random() * 6 + 10).toFixed(1);
    let boost   = +(Math.random() * 20).toFixed(1);
    let afr     = +(Math.random() * 6 + 10).toFixed(1);
    let iat     = Math.round(Math.random() * 80);
    let tps     = Math.round(Math.random() * 100);

    // Push to display
    rpmValue.textContent     = rpm;
    coolantValue.textContent = coolant + '°C';
    batteryValue.textContent = battery + 'v';
    boostValue.textContent   = boost;
    afrValue.textContent     = afr;
    iatValue.textContent     = iat + '°C';
    tpsValue.textContent     = tps + '%';

    // RPM segments
    const segs   = rpmSegRow.querySelectorAll('.seg');
    const filled = Math.round((rpm / 8000) * SEGS);
    segs.forEach(function(seg, i) {
      seg.className    = 'seg';
      seg.style.height = segHeight(i) + 'px';
      if (i < filled) {
        if (i >= 32)      seg.classList.add('on-red');
        else if (i >= 24) seg.classList.add('on-yellow');
        else              seg.classList.add('on-green');
      }
    });

    // Bars
    setBar(coolantFill, coolant, 120);
    setBar(batteryFill, battery, 16);
    setBar(afrFill,     afr,     16);
    setBar(iatFill,     iat,     80);
    setBar(tpsFill,     tps,     100);

    // Colours
    setColour(rpmValue,     rpm,     6000, 6000);
    setColour(coolantValue, coolant, 95,   110);
    setColour(batteryValue, battery, 11,   10.5);
    setColour(boostValue,   boost,   15,   18);
    setColour(afrValue,     afr,     14,   15);
    setColour(iatValue,     iat,     50,   70);
    setColour(tpsValue,     tps,     70,   90);

    // Faults
    showFaults(coolant > 110, battery < 11, boost > 18);
  }

  setInterval(updateDash, 800);

});