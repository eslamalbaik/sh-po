import{r as o,j as e,H as f,L as u,b as j}from"./app-C11KeGr0.js";const l=100;function y({students:p=[],generated_at:x}){const[r,c]=o.useState(0),t=p.length,i=o.useMemo(()=>t===0?[]:p.slice(0,r),[p,r,t]),m=o.useMemo(()=>{const s=[];for(let a=0;a<i.length;a+=4)s.push(i.slice(a,a+4));return s},[i]);o.useEffect(()=>{if(t===0){c(0);return}let n=!1,s=0;const a=()=>{n||(s=Math.min(t,s+l),c(s),s<t?requestAnimationFrame(a):fetch("http://127.0.0.1:7433/ingest/b61bd549-63bb-48e5-ba4d-27b462255a51",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"d984c6"},body:JSON.stringify({sessionId:"d984c6",location:"ParentCredentialsPrint.jsx:renderComplete",message:"all cards mounted in DOM",hypothesisId:"H5",data:{students_count:t,batch_size:l},timestamp:Date.now()})}).catch(()=>{}))};return requestAnimationFrame(a),()=>{n=!0}},[t]);const h=o.useCallback(()=>{fetch("http://127.0.0.1:7433/ingest/b61bd549-63bb-48e5-ba4d-27b462255a51",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"d984c6"},body:JSON.stringify({sessionId:"d984c6",location:"ParentCredentialsPrint.jsx:handlePrint",message:"user invoked window.print",hypothesisId:"H5",data:{students_count:t,rendered:r},timestamp:Date.now()})}).catch(()=>{}),window.print()},[t,r]),b=()=>{window.confirm(`هل تأكدت من حفظ/طباعة الـ PDF؟

بعد التأكيد سيتم مسح كلمات المرور النصية من قاعدة البيانات نهائياً (يبقى الـ Hash فقط)، ولن تستطيع استرجاعها مرة أخرى.`)&&j.post("/admin/parent-passwords/mark-distributed")},d=t>0&&r>=t;return e.jsxs("div",{className:"ppc-root",dir:"rtl",children:[e.jsx(f,{title:"بطاقات بوابة ولي الأمر"}),e.jsx("style",{children:`
                @page { size: A4; margin: 10mm; }
                body { background: #f1f5f9; }
                .ppc-root { font-family: 'Tajawal', 'Cairo', 'Segoe UI', sans-serif; }

                .ppc-toolbar {
                    position: sticky; top: 0; z-index: 100;
                    background: #27374D; color: white;
                    padding: 14px 24px; display: flex; gap: 12px;
                    align-items: center; justify-content: space-between;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .ppc-toolbar h1 { font-size: 16px; font-weight: 800; margin: 0; }
                .ppc-toolbar small { color: #cbd5e1; font-size: 11px; }
                .ppc-btn {
                    background: #fff; color: #27374D;
                    border: none; padding: 8px 18px;
                    border-radius: 8px; font-weight: 800;
                    cursor: pointer; font-size: 13px;
                }
                .ppc-btn-print { background: #fbbf24; color: #1c1917; }
                .ppc-btn-done  { background: #10b981; color: #fff; }
                .ppc-btn-back  { background: transparent; color: #fff; border: 1px solid #475569; }
                .ppc-btn:disabled { opacity: 0.45; cursor: not-allowed; }

                .ppc-warning {
                    background: #fef3c7; color: #92400e;
                    padding: 12px 24px; font-size: 13px; font-weight: 700;
                    border-bottom: 1px solid #fcd34d;
                }

                .ppc-page {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 20px auto;
                    padding: 10mm;
                    background: white;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    gap: 6mm;
                    page-break-after: always;
                }
                .ppc-page:last-child { page-break-after: auto; }

                .ppc-card {
                    border: 2px dashed #94a3b8;
                    border-radius: 8px;
                    padding: 8mm;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: white;
                    page-break-inside: avoid;
                }
                .ppc-card-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-bottom: 2px solid #27374D;
                    padding-bottom: 6px;
                    margin-bottom: 8px;
                }
                .ppc-card-header .icon { font-size: 22px; }
                .ppc-card-header .school {
                    font-size: 11px; font-weight: 800; color: #27374D; line-height: 1.3;
                }
                .ppc-card-header .school small { color: #64748b; font-weight: 600; font-size: 9px; display: block; }

                .ppc-row { margin: 5px 0; }
                .ppc-row .lbl {
                    color: #64748b; font-size: 10px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    margin-bottom: 2px;
                }
                .ppc-row .val { color: #1e293b; font-size: 13px; font-weight: 700; }
                .ppc-row .val-name { font-size: 14px; }

                .ppc-credentials {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 8px 12px;
                    margin-top: 8px;
                }
                .ppc-credentials .pair { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
                .ppc-credentials .pair + .pair { border-top: 1px solid #e2e8f0; }
                .ppc-credentials .pair .k { font-size: 10px; color: #64748b; font-weight: 700; }
                .ppc-credentials .pair .v {
                    font-family: 'Courier New', monospace;
                    font-size: 16px; font-weight: 900; color: #0f172a;
                    letter-spacing: 1px;
                }

                .ppc-footer {
                    text-align: center;
                    border-top: 1px dashed #cbd5e1;
                    padding-top: 6px;
                    margin-top: 8px;
                    font-size: 9px;
                    color: #64748b;
                }
                .ppc-footer strong { color: #27374D; }
                .ppc-footer-url {
                    margin-top: 4px;
                    padding: 4px 6px;
                    background: #f1f5f9;
                    border-radius: 4px;
                    font-size: 10px;
                    direction: ltr;
                    letter-spacing: 0.3px;
                }
                .ppc-footer-url strong { color: #0369a1; font-weight: 800; }

                .ppc-empty {
                    text-align: center; padding: 80px 20px; color: #94a3b8;
                }

                @media print {
                    body { background: white; }
                    .ppc-toolbar, .ppc-warning { display: none !important; }
                    .ppc-page {
                        margin: 0;
                        box-shadow: none;
                        width: auto;
                        min-height: auto;
                    }
                }
            `}),e.jsxs("div",{className:"ppc-toolbar",children:[e.jsxs("div",{children:[e.jsx("h1",{children:"🎓 بطاقات بوابة ولي الأمر — للطباعة"}),e.jsxs("small",{children:[t," بطاقة • وُلِّدت في ",new Date(x).toLocaleString("ar-AE"),t>0&&e.jsxs(e.Fragment,{children:[" • ",d?"✓ جاهز للطباعة":`⏳ إعداد البطاقات ${r}/${t}`]})]})]}),e.jsxs("div",{style:{display:"flex",gap:"10px"},children:[e.jsx(u,{href:route("admin.dashboard"),className:"ppc-btn ppc-btn-back",children:"← رجوع"}),e.jsx("button",{type:"button",className:"ppc-btn ppc-btn-print",disabled:!d,onClick:h,children:"🖨️ طباعة / حفظ PDF"}),e.jsx("button",{type:"button",className:"ppc-btn ppc-btn-done",onClick:b,children:"✓ تم التوزيع (مسح المؤقت)"})]})]}),e.jsxs("div",{className:"ppc-warning",children:["⚠ ",e.jsx("strong",{children:"مهم:"})," انتظر حتى يكتمل «إعداد البطاقات» ثم اضغط «طباعة». المعاينة أسرع من الطباعة التلقائية لآلاف البطاقات. احفظ PDF ثم «تم التوزيع» لمسح النصوص من قاعدة البيانات."]}),t===0?e.jsxs("div",{className:"ppc-empty",children:[e.jsx("div",{style:{fontSize:"48px",marginBottom:"12px"},children:"📭"}),e.jsx("h2",{children:"لا توجد بطاقات للطباعة حالياً"}),e.jsx("p",{children:"تم توزيع جميع كلمات المرور المُولَّدة سابقاً، أو لم يُولَّد شيء بعد."})]}):m.map((n,s)=>e.jsxs("div",{className:"ppc-page",children:[n.map(a=>e.jsxs("div",{className:"ppc-card",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"ppc-card-header",children:[e.jsx("span",{className:"icon",children:"🏫"}),e.jsxs("div",{className:"school",children:["مدرسة مدينة زايد — بنين",e.jsx("small",{children:"بوابة أولياء الأمور — العام 2025/2026"})]})]}),e.jsxs("div",{className:"ppc-row",children:[e.jsx("div",{className:"lbl",children:"اسم الطالب"}),e.jsx("div",{className:"val val-name",children:a.name_ar})]}),e.jsxs("div",{className:"ppc-row",children:[e.jsx("div",{className:"lbl",children:"الصف / الشعبة"}),e.jsxs("div",{className:"val",children:[a.grade_number," / ",a.section_label||a.section_letter||"—"]})]}),e.jsxs("div",{className:"ppc-credentials",children:[e.jsxs("div",{className:"pair",children:[e.jsx("span",{className:"k",children:"رقم الطالب"}),e.jsx("span",{className:"v",children:a.student_no})]}),e.jsxs("div",{className:"pair",children:[e.jsx("span",{className:"k",children:"كلمة المرور"}),e.jsx("span",{className:"v",children:a.password})]})]})]}),e.jsxs("div",{className:"ppc-footer",children:["ادخل عبر ",e.jsx("strong",{children:"بوابة أولياء الأمور"})," برقم الطالب وكلمة المرور أعلاه",e.jsxs("div",{className:"ppc-footer-url",children:["🔗 ",e.jsx("strong",{children:"mzschool-results.com/parent"})]})]})]},a.id)),Array.from({length:4-n.length}).map((a,g)=>e.jsx("div",{},`empty-${g}`))]},s))]})}export{y as default};
