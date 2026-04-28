<!DOCTYPE html>
<html lang='{{ str_replace('_', '-', app()->getLocale()) }}'>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title inertia>{{ config('app.name', 'Laravel') }}</title>
<link rel='preconnect' href='https://fonts.bunny.net'>
<link href='https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap' rel='stylesheet' />
<script src='https://cdn.tailwindcss.com'></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
      colors: {
        navy: '#1c4c6e',
        'navy-dark': '#153a5c',
        indigo: '#4338ca',
        green: '#10b981',
      }
    }
  }
}
</script>
<style type='text/tailwindcss'>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

@layer base {
  html, body, #app {
    font-family: 'Tajawal', sans-serif !important;
  }
}

:root {
  --navy: #1c4c6e;
  --navy-dark: #153a5c;
  --indigo: #4338ca;
  --indigo-light: #eef2ff;
  --green: #10b981;
  --green-soft: #f0fdf4;
  --gray-bg: #f3f4f6;
  --border: #e2e8f0;
  --text-dark: #1e293b;
  --text-muted: #64748b;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.staff-portal-body {
  background: #f3f4f6 !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: #1e293b !important;
}

/* ── PREMIER HEADER ── */
.premium-header {
  background: #1c4c6e !important;
  color: #fff !important;
  padding: 12px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  position: relative;
  z-index: 50;
}

.header-user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-full-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.school-tagline {
  font-size: 11px;
  opacity: 0.8;
  font-weight: 500;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.h-ctrl-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255,255,255,0.1) !important;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.15);
}

.logout-link {
  background: #334155 !important;
  color: #fff !important;
  border: none;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-link:hover {
  background: #ef4444 !important;
}

/* ── SUMMARY KPI BOX ── */
.summary-container {
  max-width: 1200px;
  margin: 25px auto;
  padding: 0 20px;
}

.kpi-card-box {
  background: #fff !important;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  overflow: hidden;
  position: relative;
  border: 1px solid #e2e8f0;
}

.kpi-item {
  flex: 1;
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #f1f5f9;
}

.kpi-item:last-child { border-left: none; }

.kpi-val {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b !important;
  line-height: 1;
}

.kpi-val.big { font-size: 38px; }

.kpi-lbl {
  font-size: 12px;
  color: #64748b !important;
  margin-top: 8px;
  font-weight: 600;
}

.kpi-success-radial {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.success-percent {
  font-size: 28px;
  font-weight: 900;
  color: #10b981 !important;
}

.kpi-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 6px;
  background: #10b981 !important;
  transition: width 0.5s ease-out;
}

/* ── ACTIONS BAR ── */
.actions-bar {
  background: #fff !important;
  padding: 15px 25px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

.filters-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

.f-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.f-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569 !important;
}

.f-select {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  background: #fff !important;
  min-width: 120px;
}

.btns-group {
  display: flex;
  gap: 10px;
}

.p-btn {
  border: none;
  padding: 9px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  color: #fff !important;
}

.btn-indigo { background: #1c4c6e !important; box-shadow: 0 4px 12px rgba(28, 76, 110, 0.25) !important; border: 1px solid rgba(255,255,255,0.1) !important; }
.btn-green { background: #1D9E75 !important; box-shadow: 0 4px 12px rgba(29, 158, 117, 0.25) !important; border: 1px solid rgba(255,255,255,0.1) !important; }
.btn-dark { background: #334155 !important; box-shadow: 0 4px 12px rgba(51, 65, 85, 0.15) !important; border: 1px solid rgba(255,255,255,0.1) !important; }

.p-btn:hover { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2) !important; }

/* ── GRADES TABLE ── */
.table-viewport {
  background: #fff !important;
  border-radius: var(--radius-sm);
  overflow: auto;
  border: 1px solid #e2e8f0;
  box-shadow: var(--shadow);
  position: relative;
}

.classic-table {
  width: 100%;
  border-collapse: collapse;
}

.classic-table th {
  background: #f8fafc !important;
  padding: 12px 15px;
  font-size: 13px;
  font-weight: 700;
  border-bottom: 2px solid #1c4c6e;
  color: #1e293b !important;
}

.th-assessment {
  min-width: 140px;
  text-align: center;
}

.ass-badge {
  background: #334155 !important;
  color: #fff !important;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-bottom: 4px;
  display: inline-block;
}

.ass-title {
  display: block;
  font-size: 14px;
  margin: 5px 0;
}

.ass-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.ass-icon-btn {
  background: none !important;
  border: none;
  cursor: pointer;
  color: #64748b !important;
  font-size: 14px;
  transition: color 0.2s;
}

.ass-icon-btn.edit:hover { color: #4338ca !important; }
.ass-icon-btn.trash:hover { color: #ef4444 !important; }

.classic-table td {
  padding: 8px 15px;
  border-bottom: 1px solid #f1f5f9;
}

.student-col {
  position: sticky;
  right: 0;
  background: #fff !important;
  z-index: 10;
  border-left: 2px solid #f1f5f9;
  text-align: right;
  min-width: 250px;
}

.std-name-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 14px;
}

.std-num {
  color: #64748b !important;
  width: 20px;
  font-size: 12px;
}

.score-cell {
  text-align: center;
}

.score-input {
  width: 75px;
  padding: 8px 5px;
  border: 1px solid #10b981;
  border-radius: 12px;
  background: #f0fdf4 !important;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Western numerals */
}

.score-input.saving-inp {
  border-color: #3b82f6 !important;
  background: #eff6ff !important;
  animation: pulse-save 1s infinite;
}

@keyframes pulse-save {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.score-input.low {
  background: #fef2f2 !important;
  border-color: #ef4444 !important;
  color: #b91c1c !important;
}

.score-input.absent {
  background: #fffbeb !important;
  border-color: #f59e0b !important;
  color: #92400e !important;
}

.score-input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  border-color: #059669 !important;
}

.score-input.empty {
  background: #fff !important;
  border-color: #e2e8f0 !important;
}

.score-input.absent {
  background: #ffe4e6 !important;
  border-color: #ef4444 !important;
  color: #ef4444 !important;
}

.total-col {
  background: #f8fafc !important;
  font-weight: 900;
  color: #1c4c6e !important;
  font-size: 16px;
}

/* ── MODALS ── */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff !important;
  padding: 30px;
  border-radius: var(--radius);
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}

.modal-header {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 800;
  text-align: right;
}

.modal-field {
  margin-bottom: 15px;
}

.modal-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  text-align: right;
}

.modal-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-align: right;
}

.modal-btns {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 25px;
}

:root {
  --blue: #1F4E79;
  --blue-light: #E6F1FB;
  --green: #1D9E75;
  --green-light: #EAF3DE;
  --red: #E24B4A;
  --red-light: #FCEBEB;
  --amber: #EF9F27;
  --amber-light: #FFF2CC;
  --border: #e2e8f0;
  --text: #1a202c;
  --text-muted: #718096;
  --radius: 12px;
  --radius-sm: 8px;
}

.parent-portal-body {
  background: #f0f4f8 !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ── LOGIN ── */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1F4E79 0%, #2563a8 60%, #1D9E75 100%) !important;
}

.login-card {
  background: #fff !important;
  border-radius: 16px;
  width: 100%;
  max-width: 380px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .25);
}

.login-banner {
  background: linear-gradient(135deg, #1F4E79, #2563a8) !important;
  padding: 24px;
  text-align: center;
}

.login-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, .15) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin: 0 auto 12px;
}

.login-school {
  font-size: 14px;
  font-weight: 700;
  color: #fff !important;
  line-height: 1.5;
}

.login-year {
  font-size: 11px;
  color: #B5D4F4 !important;
  margin-top: 4px;
}

.login-body {
  padding: 28px;
}

.lang-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
}

.lang-btn {
  font-size: 12px;
  padding: 5px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  background: #fff !important;
  color: #64748b !important;
  transition: all .2s;
}

.lang-btn.on {
  background: var(--blue) !important;
  color: #fff !important;
  border-color: var(--blue) !important;
}

.portal-badge {
  background: var(--green-light) !important;
  color: #085041 !important;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 16px;
}

.field label {
  font-size: 12px;
  color: #64748b !important;
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.field input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
  transition: border .2s;
}

.field input:focus {
  border-color: var(--blue) !important;
  box-shadow: 0 0 0 3px rgba(31, 78, 121, .1);
}

.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #10b981 !important;
  color: #fff !important;
  transition: opacity .2s;
}

.login-btn:hover {
  opacity: .9;
}

.login-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.err-msg {
  font-size: 12px;
  color: var(--red) !important;
  text-align: center;
  margin-top: 10px;
}

/* ── TOP BAR ── */
.top-bar {
  background: #24588e !important;
  padding: 0 20px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
  color: #fff !important;
  z-index: 100;
  position: relative; /* Base for absolute centering */
}

.top-school {
  font-size: 14px;
  font-weight: 500;
  color: #fff !important;
  white-space: nowrap;
}

.top-student {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: none; /* Allow clicks to pass through if needed, though usually not an issue */
}

.top-student * {
    pointer-events: auto;
}

.top-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #4c76b1 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff !important;
}

.top-info {
    display: flex;
    flex-direction: column;
    align-items: center; /* Center text inside the group */
}

.top-name {
  font-size: 15px;
  font-weight: 700;
  color: #fff !important;
  line-height: 1.1;
  white-space: nowrap;
}

.top-class {
  font-size: 10px;
  color: #B5D4F4 !important;
  margin-top: 1px;
}

.top-left-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timer-badge {
    font-size: 13px;
    font-weight: 500;
    color: #fff !important;
    opacity: 0.9;
}

.logout-btn {
  font-size: 13px;
  font-weight: 600;
  color: #fff !important;
  background: #346a9f !important; /* Exact logout button color */
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  cursor: pointer;
  transition: background .2s;
}

.logout-btn:hover {
  background: #4079b3 !important;
}

.lang-toggle {
  display: flex;
  gap: 6px;
}

.lt-btn {
  font-size: 12px;
  font-weight: 700;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  background: transparent !important;
  color: #fff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
}

.lt-btn.on {
  background: #346a9f !important;
  border-color: transparent !important;
}

/* ── CONTENT ── */
.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 20px 16px;
}

/* ── SECURITY PANEL ── */
.sec-panel {
  background: #fff !important;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.sec-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #546e7a !important;
}

.sec-row:last-child {
  margin-bottom: 0;
}

.sec-ok {
  color: #1D9E75 !important;
  font-weight: 700;
  font-size: 15px;
}

/* ── OVERVIEW CARDS ── */
.ov-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}

.ov-box {
  background: #fff !important;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 14px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}

.ov-val {
  font-size: 22px;
  font-weight: 700;
  color: var(--blue) !important;
}

.ov-lbl {
  font-size: 11px;
  color: #64748b !important;
  margin-top: 3px;
}

/* ── SUBJECT CARDS ── */
.subj-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subj-card {
  background: #fff !important;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 16px;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}

.subj-card:hover {
  border-color: #93C5FD !important;
  box-shadow: 0 4px 12px rgba(31, 78, 121, .1);
  transform: translateY(-1px);
}

.subj-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.subj-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f0f4f8 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.subj-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text) !important;
}

.subj-teacher {
  font-size: 11px;
  color: #64748b !important;
  margin-top: 2px;
}

.score-pill {
  font-size: 13px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
}

.pill-g { background: var(--green-light) !important; color: #085041 !important; }
.pill-b { background: var(--blue-light) !important; color: #0C447C !important; }
.pill-a { background: var(--amber-light) !important; color: #633806 !important; }
.pill-r { background: var(--red-light) !important; color: #791F1F !important; }

.bar-track {
  height: 6px;
  background: #e2e8f0 !important;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width .6s ease;
}

.fill-g { background: #10b981 !important; }
.fill-b { background: #3B82F6 !important; }
.fill-a { background: var(--amber) !important; }
.fill-r { background: var(--red) !important; }

.subj-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b !important;
}

.subj-ev-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  background: #f0f4f8 !important;
  color: #64748b !important;
}

/* ── DETAIL VIEW ── */
.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none !important;
  border: none;
  font-size: 13px;
  color: #64748b !important;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 0;
}

.prog-header {
  background: #fff !important;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 18px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}

.prog-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.prog-subj-name { font-size: 18px; font-weight: 700; color: var(--text) !important; }
.prog-teacher { font-size: 12px; color: #64748b !important; margin-top: 3px; }

.prog-pct-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.prog-pct-num { font-size: 22px; font-weight: 700; line-height: 1; }
.prog-pct-lbl { font-size: 10px; font-weight: 600; margin-top: 2px; }

.prog-bar-bg {
  height: 8px;
  background: #e2e8f0 !important;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 14px;
}

.prog-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width .6s ease;
}

.prog-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.prog-stat {
  background: #f8fafc !important;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  text-align: center;
  flex: 1;
}

.prog-stat-val { font-size: 18px; font-weight: 700; color: var(--blue) !important; }
.prog-stat-lbl { font-size: 10px; color: #64748b !important; margin-top: 2px; }

.eval-card {
  background: #fff !important;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}

.eval-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.eval-name { font-size: 14px; font-weight: 600; color: var(--text) !important; }
.eval-date { font-size: 11px; color: #64748b !important; margin-top: 2px; }

.type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.badge-exam { background: var(--blue-light) !important; color: #0C447C !important; }
.badge-task { background: var(--green-light) !important; color: #085041 !important; }
.badge-quiz { background: var(--amber-light) !important; color: #633806 !important; }
.badge-project { background: #F3E8FF !important; color: #5B21B6 !important; }
.badge-oral { background: #FEE2E2 !important; color: #991B1B !important; }

.scores-grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0;
  margin-bottom: 10px;
}

.score-col { padding: 0 12px; text-align: center; }
.score-div { background: #e2e8f0 !important; }
.score-lbl { font-size: 11px; color: #64748b !important; margin-bottom: 4px; }
.score-num { font-size: 20px; font-weight: 700; }
.score-den { font-size: 12px; color: #64748b !important; }

.eval-bar {
  height: 5px;
  background: #e2e8f0 !important;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
}

.pending-note {
  background: var(--amber-light) !important;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--text) !important;
}

.subj-teacher {
  font-size: 11px;
  color: #64748b !important;
  margin-top: 2px;
}

.score-pill {
  font-size: 13px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
}

.pill-g { background: var(--green-light) !important; color: #085041 !important; }
.pill-b { background: var(--blue-light) !important; color: #0C447C !important; }
.pill-a { background: var(--amber-light) !important; color: #633806 !important; }
.pill-r { background: var(--red-light) !important; color: #791F1F !important; }

.bar-track {
  height: 6px;
  background: #e2e8f0 !important;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width .6s ease;
}

.fill-g { background: #10b981 !important; }
.fill-b { background: #3B82F6 !important; }
.fill-a { background: var(--amber) !important; }
.fill-r { background: var(--red) !important; }

.subj-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b !important;
}

.subj-ev-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  background: #f0f4f8 !important;
  color: #64748b !important;
}

/* ── DETAIL VIEW ── */
.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none !important;
  border: none;
  font-size: 13px;
  color: #64748b !important;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 0;
}

.prog-header {
  background: #fff !important;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 18px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}

.prog-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.prog-subj-name { font-size: 18px; font-weight: 700; color: var(--text) !important; }
.prog-teacher { font-size: 12px; color: #64748b !important; margin-top: 3px; }

.prog-pct-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.prog-pct-num { font-size: 22px; font-weight: 700; line-height: 1; }
.prog-pct-lbl { font-size: 10px; font-weight: 600; margin-top: 2px; }

.prog-bar-bg {
  height: 8px;
  background: #e2e8f0 !important;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 14px;
}

.prog-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width .6s ease;
}

.prog-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.prog-stat {
  background: #f8fafc !important;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  text-align: center;
  flex: 1;
}

.prog-stat-val { font-size: 18px; font-weight: 700; color: var(--blue) !important; }
.prog-stat-lbl { font-size: 10px; color: #64748b !important; margin-top: 2px; }

.eval-card {
  background: #fff !important;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}

.eval-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.eval-name { font-size: 14px; font-weight: 600; color: var(--text) !important; }
.eval-date { font-size: 11px; color: #64748b !important; margin-top: 2px; }

.type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.badge-exam { background: var(--blue-light) !important; color: #0C447C !important; }
.badge-task { background: var(--green-light) !important; color: #085041 !important; }
.badge-quiz { background: var(--amber-light) !important; color: #633806 !important; }
.badge-project { background: #F3E8FF !important; color: #5B21B6 !important; }
.badge-oral { background: #FEE2E2 !important; color: #991B1B !important; }

.scores-grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0;
  margin-bottom: 10px;
}

.score-col { padding: 0 12px; text-align: center; }
.score-div { background: #e2e8f0 !important; }
.score-lbl { font-size: 11px; color: #64748b !important; margin-bottom: 4px; }
.score-num { font-size: 20px; font-weight: 700; }
.score-den { font-size: 12px; color: #64748b !important; }

.eval-bar {
  height: 5px;
  background: #e2e8f0 !important;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
}

.pending-note {
  background: var(--amber-light) !important;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #633806 !important;
  margin-top: 8px;
}

.pending-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--amber) !important;
  flex-shrink: 0;
}

/* ── SITE CODE & STAFF LOGIN ── */
.sitecode-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f3f4f6 !important;
}

.sitecode-card {
  background: #fff !important;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.sitecode-banner {
  background: #1c4c6e !important;
  padding: 30px 20px;
  text-align: center;
}

.sitecode-logo {
  font-size: 36px;
  margin-bottom: 15px;
}

.sitecode-school {
  font-size: 18px;
  font-weight: 800;
  color: #fff !important;
  line-height: 1.4;
}

.sitecode-body {
  padding: 30px;
}

.sitecode-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b !important;
  margin-bottom: 5px;
}

.sitecode-subtitle {
  font-size: 13px;
  color: #64748b !important;
  font-weight: 500;
}

.sitecode-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569 !important;
  margin-bottom: 8px;
}

.sitecode-input-wrap {
  position: relative;
  margin-bottom: 20px;
}

.sitecode-input {
  width: 100%;
  padding: 12px 15px;
  /* right padding for LTR but we will just add it inline */
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
  background: #f8fafc !important;
  font-family: monospace;
  letter-spacing: 2px;
}

html[dir="ltr"] .sitecode-input {
  padding-right: 45px;
}

html[dir="rtl"] .sitecode-input {
  padding-left: 45px;
}

.sitecode-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(28, 76, 110, 0.1);
  background: #fff !important;
}

.eye-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none !important;
  border: none;
  color: #94a3b8 !important;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

html[dir="ltr"] .eye-toggle { right: 12px; }
html[dir="rtl"] .eye-toggle { left: 12px; }

.eye-toggle:hover {
  color: #475569 !important;
}

.sitecode-btn {
  width: 100%;
  padding: 14px;
  background: #1c4c6e !important;
  color: #fff !important;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.sitecode-btn:hover {
  background: #27374D !important;
  transform: translateY(-1px);
}

.sitecode-err {
  background: #fef2f2 !important;
  color: #dc2626 !important;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #fecaca;
}

.sitecode-footer {
  text-align: center;
  font-size: 12px;
  color: #64748b !important;
}

.sitecode-footer-link {
  color: #1c4c6e !important;
  font-weight: 700;
  text-decoration: none;
}

.sitecode-footer-link:hover {
  text-decoration: underline;
}

.lang-switcher {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 15px;
}

/* STAFF LOGIN OVERRIDES */
.staff-portal-body .login-wrap {
  background: #f3f4f6 !important;
  flex-direction: column;
}

.school-banner {
  background: #1c4c6e !important;
  padding: 25px 20px;
  text-align: center;
}

.school-name {
  font-size: 16px;
  font-weight: 800;
  color: #fff !important;
  line-height: 1.4;
}

.school-year {
  font-size: 12px;
  color: #cbd5e1 !important;
  margin-top: 5px;
}

.role-tabs {
  display: flex;
  background: #f1f5f9 !important;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 25px;
}

.role-tab {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b !important;
  background: transparent !important;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.role-tab.active-t {
  background: #fff !important;
  color: #1c4c6e !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.role-tab.active-a {
  background: #fff !important;
  color: #4338ca !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.field-input-wrap {
  position: relative;
}

.field-input-wrap input {
  width: 100%;
  padding: 12px 15px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background: #fff !important;
}

html[dir="ltr"] .field-input-wrap input { padding-right: 45px; }
html[dir="rtl"] .field-input-wrap input { padding-left: 45px; }

.field-input-wrap input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(28, 76, 110, 0.1);
}

.field-eye {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none !important;
  border: none;
  color: #94a3b8 !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

html[dir="ltr"] .field-eye { right: 12px; }
html[dir="rtl"] .field-eye { left: 12px; }

.btn-t { background: #1c4c6e !important; }
.btn-t:hover { background: #153a5c !important; }

.btn-a { background: #4338ca !important; }
.btn-a:hover { background: #3730a3 !important; }

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: #10b981 !important;
  margin-top: 20px;
  font-weight: 600;
}

/* EXTENSIONS EXACTLY FOR LEGACY ADMIN DASHBOARD */
.admin-portal-body {
  background: #f8fafc !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: #1e293b;
}

.legacy-admin-bar {
  background: #27374D !important;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
  overflow: visible !important;
}

.admin-badge-new {
  background: #ef4444 !important;
  color: #fff !important;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 12px;
  letter-spacing: 1px;
}

.admin-title-new {
  color: #fff !important;
  font-size: 15px;
  font-weight: 700;
}

.leg-tab-btn {
  background: transparent !important;
  color: #94a3b8 !important;
  border: none;
  font-size: 14px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.leg-tab-btn.active {
  background: #394867 !important;
  color: #fff !important;
}

.leg-icon-btn {
  background: #394867 !important;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.leg-icon-btn:hover {
  background: #4a5c7f !important;
}

.leg-logout-btn {
  background: #394867 !important;
  color: #94a3b8 !important;
  border: none;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.leg-logout-btn:hover {
  background: #ef4444 !important;
  color: #fff !important;
}

.lang-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 15px;
    border-radius: 12px;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.lang-dropdown-trigger:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}
.lang-dropdown-trigger img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
}
.lang-dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    width: 180px;
    padding: 8px;
    z-index: 1000;
    animation: slideDown 0.3s ease-out;
}
[dir="rtl"] .lang-dropdown-menu {
    left: auto;
    right: 0;
}
.lang-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 15px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #1e293b;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}
.lang-item:hover {
    background: #f1f5f9;
}
.lang-item.active {
    background: #f1f5f9;
    color: #2563eb;
}
.lang-item img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.leg-kpi-container {
  background: #394867 !important;
  padding: 15px 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.leg-kpi-card {
  background: #27374D !important;
  border-radius: 8px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.leg-kpi-card .kval {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.1;
}

.leg-kpi-card .klbl {
  color: #94a3b8 !important;
  font-size: 11px;
  margin-top: 5px;
}

.leg-kpi-card .kicon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.leg-main-section {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.leg-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.sh-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a !important;
}

.sh-sub {
  font-size: 13px;
  color: #64748b !important;
  margin-top: 4px;
}

.leg-filters-row {
  display: flex;
  gap: 10px;
}

.leg-filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff !important;
  border: 1px solid #e2e8f0;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #64748b !important;
  transition: all 0.2s;
}

.leg-filter-label input {
  display: none;
}

.leg-filter-label.active-all { background: #0f172a !important; color: #fff !important; border-color: #0f172a !important;}
.leg-filter-label.active-done { border-color: #22c55e !important; color: #22c55e !important; background: #f0fdf4 !important; }
.leg-filter-label.active-partial { border-color: #f59e0b !important; color: #d97706 !important; background: #fffbeb !important; }
.leg-filter-label.active-not { border-color: #ef4444 !important; color: #b91c1c !important; background: #fef2f2 !important; }

.f-circle { width: 10px; height: 10px; border-radius: 50%; background: #fff !important; border: 2px solid #3b82f6 !important; }
.f-diamond { width: 10px; height: 10px; transform: rotate(45deg); background: #f59e0b !important; display: inline-block; }
.f-diamond-s { width: 10px; height: 10px; transform: rotate(45deg); background: #f59e0b !important; display: inline-block; margin-left: 4px; }

.leg-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.leg-teacher-card {
  background: #fff !important;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px 20px 10px 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.ltc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.ltc-name-col {
  display: flex;
  align-items: center;
}

.ltc-avatar {
  background: #fef08a !important;
  color: #854d0e !important;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
}

.ltc-name {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a !important;
}

.ltc-meta {
  font-size: 12px;
  color: #64748b !important;
  margin-top: 4px;
}

.ltc-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.ltc-reset-btn {
  background: #fef08a !important;
  color: #854d0e !important;
  border: 1px solid #fde047;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.ltc-reset-btn:hover { background: #fde047 !important; }

.ltc-pct-val {
  font-size: 24px;
  font-weight: 800;
  color: #f59e0b !important;
}

.ltc-badge {
  background: #fef3c7 !important;
  color: #b45309 !important;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 80px;
  justify-content: center;
}

.ltc-badge-done { background: #f0fdf4 !important; color: #15803d !important; }
.ltc-badge-empty { background: #fef2f2 !important; color: #b91c1c !important; }

.ltc-progress-track {
  height: 6px;
  background: #e2e8f0 !important;
  border-radius: 4px;
  margin-bottom: 15px;
  overflow: hidden;
}

.ltc-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.ltc-progress-fill.done { background: #22c55e !important; }
.ltc-progress-fill.partial { background: #f59e0b !important; }
.ltc-progress-fill.empty { background: transparent !important; }

.ltc-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
  padding-bottom: 5px;
}

.ltc-subj-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  color: #64748b !important;
}

.lsp-icon {
  font-size: 14px;
  opacity: 0.7;
}

/* RESET PASSWORD MODAL */
.reset-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.reset-modal {
  background: #fff !important;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.rm-header {
  background: #1c4c6e !important;
  color: #fff !important;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rm-title {
  font-size: 15px;
  font-weight: 800;
}

.rm-close {
  background: none !important;
  border: none;
  color: #fff !important;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
}

.rm-body {
  padding: 25px;
}

.rm-field {
  margin-bottom: 20px;
}

.rm-field label {
  display: block;
  font-size: 13px;
  color: #475569 !important;
  font-weight: 600;
  margin-bottom: 8px;
}

.rm-input-wrap {
  position: relative;
}

.rm-input-wrap input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

html[dir="rtl"] .rm-input-wrap input { padding-right: 14px; padding-left: 40px; }
html[dir="ltr"] .rm-input-wrap input { padding-left: 14px; padding-right: 40px; }

.rm-input-wrap input:focus {
  border-color: #3b82f6 !important;
}

.rm-eye {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none !important;
  border: none;
  cursor: pointer;
  opacity: 0.6;
}

html[dir="rtl"] .rm-eye { left: 10px; }
html[dir="ltr"] .rm-eye { right: 10px; }

.rm-eye:hover { opacity: 1; }

.rm-err {
  color: #ef4444 !important;
  font-size: 12px;
  margin-top: 5px;
}

.rm-footer {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.rm-btn-save {
  background: #1c4c6e !important;
  color: #fff !important;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.link-pill {
  cursor: pointer !important;
  transition: all 0.2s !important;
  text-decoration: none !important;
}
.link-pill:hover {
  background: #e0f2fe !important;
  border-color: #bae6fd !important;
}

/* SUBJECT GRADES VIEW */
.sg-page {
  background: #f8fafc !important;
  min-height: 100vh;
  margin: 0; padding: 0;
  font-family: inherit;
}

.sg-nav {
  background: #27374D !important;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff !important;
}

.sg-btn-monitor {
  background: #394867 !important;
  border: none;
  color: #fcd34d !important;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.sg-btn-monitor .dot {
  width: 8px; height: 8px;
  background: #f59e0b !important;
  border-radius: 50%;
  display: inline-block;
}

.sg-title {
  font-size: 16px;
  font-weight: 800;
}

.sg-subtitle {
  font-size: 11px;
  color: #94a3b8 !important;
  margin-top: 2px;
}

.sg-btn-back {
  background: #394867 !important;
  color: #94a3b8 !important;
  border: none;
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.sg-kpi-bar {
  background: #394867 !important;
  padding: 15px 20px;
  display: flex;
  gap: 15px;
}

.sg-kpi-card {
  flex: 1;
  background: #27374D !important;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
}

.sg-kval {
  color: #fff !important;
  font-size: 20px;
  font-weight: 800;
}

.sg-klbl {
  color: #94a3b8 !important;
  font-size: 11px;
  margin-top: 4px;
}

.sg-table-container {
  padding: 20px;
  overflow-x: auto;
}

.sg-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff !important;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.sg-table th {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  padding: 12px;
  text-align: center;
  font-weight: 700;
  color: #1e293b !important;
}

.th-sum { width: 120px; font-size: 14px; }
.th-student { text-align: right !important; padding-right: 20px !important; font-size: 13px; }

.th-ass {
  min-width: 150px;
}

.th-ass-title {
  font-size: 12px;
  font-weight: 800;
}

.th-ass-type {
  font-size: 11px;
  color: #3b82f6 !important;
  margin-top: 4px;
}

.th-ass-max {
  font-size: 10px;
  color: #64748b !important;
}

.sg-table td {
  border: 1px solid #e2e8f0;
  padding: 10px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}

.td-sum {
  color: #1c4c6e !important;
  background: #f0f9ff !important;
}

.td-student {
  text-align: right !important;
  padding-right: 20px !important;
  color: #334155 !important;
  font-weight: 600 !important;
}

.grade-green {
  background: #dcfce7 !important;
  color: #166534 !important;
}

.grade-red {
  background: #fee2e2 !important;
  color: #b91c1c !important;
}


/* GLOBAL SEARCH STYLES */
.search-container {
  position: relative;
  width: 350px;
  margin: 0 20px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 8px;
  padding: 8px 35px 8px 12px;
  color: #fff !important;
  font-size: 14px;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  width: 400px;
}

.search-icon {
  position: absolute;
  right: 10px;
  font-size: 14px;
  opacity: 0.6;
  pointer-events: none;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff !important;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  animation: slide-down 0.2s ease-out;
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.search-item:last-child {
  border-bottom: none;
}

.search-item:hover, .search-item.active {
  background: #f8fafc !important;
}

.si-info {
  display: flex;
  flex-direction: column;
}

.si-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.si-subtext {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.si-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.badge-teacher { background: #dcfce7 !important; color: #166534 !important; }
.badge-subject { background: #e0f2fe !important; color: #0369a1 !important; }
.badge-class { background: #fef9c3 !important; color: #854d0e !important; }

.search-no-results {
  padding: 20px;
  text-align: center;
  color: #64748b;
  font-size: 13px;
}

/* Custom Scrollbar for Search */
.search-results::-webkit-scrollbar { width: 6px; }
.search-results::-webkit-scrollbar-track { background: transparent; }
.search-results::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

.search-results::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

@keyframes highlight-flash {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); border-color: #3b82f6; }
  50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); border-color: #3b82f6; }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.highlight-flash {
  animation: highlight-flash 1s ease-out 2;
  border-width: 2px !important;
}

/* ── STUDENT MANAGEMENT ── */
.st-header-actions {
  background: #fff !important;
  border: 1px solid #e2e8f0;
}

.st-filter-select, .st-search-input {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 13px;
  color: #1e293b;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.2s;
}

.st-filter-select:focus, .st-search-input:focus {
  border-color: #3b82f6 !important;
  background: #fff !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.st-table th {
  background: #f8fafc;
  padding: 15px;
  text-transform: uppercase;
  font-size: 11px;
  color: #64748b;
  border-bottom: 2px solid #f1f5f9;
}

.st-table td {
  padding: 15px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.st-avatar-mini {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 800;
  font-size: 12px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(99,102,241,0.2);
}

.st-cell-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
}
.st-cell-badge.blue { background: #e0f2fe; color: #0369a1; }
.st-cell-badge.purple { background: #f3e8ff; color: #7e22ce; }

.st-action-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.st-action-circle:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
}

.st-action-circle.blue:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
.st-action-circle.orange:hover { border-color: #f59e0b; color: #f59e0b; background: #fffbeb; }
.st-action-circle.rose:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
.st-action-circle.emerald:hover { border-color: #10b981; color: #10b981; background: #ecfdf5; }

/* ── PREMIUM MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.premium-modal {
  background: #fff;
  border-radius: 20px;
  width: 600px;
  max-width: 95vw;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header-blue {
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  padding: 20px 30px;
  color: #fff;
  position: relative;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
}

.close-btn {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.15);
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(0,0,0,0.3);
}

.f-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 8px;
}

.f-input, .f-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.f-input:focus, .f-select:focus {
  background: #fff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.f-select:disabled {
  background: #e2e8f0 !important;
  color: #64748b !important;
  cursor: not-allowed;
}

.btn-add-confirm {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
  transition: all 0.2s;
}

.btn-add-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(16, 185, 129, 0.4);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.glass-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
}

/* ── ASSIGNMENTS STYLING ── */
.f-field-dark select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 15px center;
}

.f-field-dark select option {
  background: #ffffff;
  color: #1e293b;
  padding: 12px;
  font-weight: 600;
}

.as-pill {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.as-pill:hover {
  transform: scale(1.05);
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}


/* ── PREMIUM SUBJECT CARDS ── */
.subj-list-premium {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subj-card-premium {
  background: #fff !important;
  border: 1px solid #eef2f6 !important;
  border-radius: 24px !important;
  padding: 24px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
}

.subj-card-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06) !important;
}

.subj-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.subj-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #f8fafc !important;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-left: 16px;
}

.subj-info-text {
  flex: 1;
  text-align: right;
}

.subj-info-name {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b !important;
  margin: 0;
}

.subj-info-teacher {
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8 !important;
  margin-top: 4px;
}

.pct-badge {
  width: 70px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
}

.pct-badge.g { background: #EAF3DE !important; color: #1D9E75 !important; }
.pct-badge.b { background: #E6F1FB !important; color: #1F4E79 !important; }
.pct-badge.a { background: #FFF2CC !important; color: #EF9F27 !important; }
.pct-badge.r { background: #FCEBEB !important; color: #E24B4A !important; }

.bar-track-premium {
  height: 10px;
  background: #f1f5f9 !important;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 16px;
}

.bar-fill-premium {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.subj-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-display {
  font-size: 14px;
  font-weight: 700;
  color: #64748b !important;
}

.score-current {
  color: #1e293b !important;
  font-size: 16px;
}

.eval-count-pill {
  background: #f1f5f9 !important;
  color: #94a3b8 !important;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
}

/* ── OVERVIEW BOXES FIX ── */
.ov-box {
  background: #fff !important;
  border: 1px solid #eef2f6 !important;
  border-radius: 16px !important;
  padding: 18px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
}

.ov-val {
  font-size: 26px !important;
  color: #1F4E79 !important;
}

</style>

@routes
@viteReactRefresh
@vite(['resources/js/app.tsx'])
@inertiaHead
</head>
<body class='font-sans antialiased'>
@inertia
</body>
</html>
