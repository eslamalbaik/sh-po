import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
// Laravel يضع كوكي XSRF-TOKEN؛ axios (ومعه Inertia) يرسل X-XSRF-TOKEN تلقائياً.
// لا تستخدم meta csrf-token مع Inertia — يثبت رمزاً قديماً ويسبب 419 (انظر inertiajs.com docs/v2/security/csrf-protection).
Object.assign(window.axios.defaults, { withXSRFToken: true });
