import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, router, Link } from '@inertiajs/react';

const BATCH = 100;

export default function ParentCredentialsPrint({ students = [], generated_at }) {
    const [renderUpTo, setRenderUpTo] = useState(0);
    const total = students.length;

    const displayed = useMemo(
        () => (total === 0 ? [] : students.slice(0, renderUpTo)),
        [students, renderUpTo, total]
    );

    const PER_PAGE = 6;
    const pages = useMemo(() => {
        const pgs = [];
        for (let i = 0; i < displayed.length; i += PER_PAGE) {
            pgs.push(displayed.slice(i, i + PER_PAGE));
        }
        return pgs;
    }, [displayed]);

    /** عرض تدريجي لتخفيف حجب الواجهة عند آلاف البطاقات */
    useEffect(() => {
        if (total === 0) {
            setRenderUpTo(0);
            return;
        }
        let cancelled = false;
        let cursor = 0;
        const step = () => {
            if (cancelled) return;
            cursor = Math.min(total, cursor + BATCH);
            setRenderUpTo(cursor);
            if (cursor < total) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
        return () => {
            cancelled = true;
        };
    }, [total]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const handleMarkDistributed = () => {
        const ok = window.confirm(
            'هل تأكدت من حفظ/طباعة الـ PDF؟\n\n' +
            'بعد التأكيد سيتم مسح كلمات المرور النصية من قاعدة البيانات نهائياً ' +
            '(يبقى الـ Hash فقط)، ولن تستطيع استرجاعها مرة أخرى.'
        );
        if (!ok) return;

        router.post('/admin/parent-passwords/mark-distributed');
    };

    const ready = total > 0 && renderUpTo >= total;

    return (
        <div className="ppc-root" dir="rtl">
            <Head title="بطاقات بوابة ولي الأمر" />

            <style>{`
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
                    padding: 8mm;
                    background: white;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    gap: 4mm;
                    page-break-after: always;
                }
                .ppc-page:last-child { page-break-after: auto; }

                .ppc-card {
                    border: 2px dashed #94a3b8;
                    border-radius: 6px;
                    padding: 5mm;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: white;
                    page-break-inside: avoid;
                    overflow: hidden;
                }
                .ppc-card-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    border-bottom: 1.5px solid #27374D;
                    padding-bottom: 4px;
                    margin-bottom: 5px;
                }
                .ppc-card-header .icon { font-size: 16px; }
                .ppc-card-header .school {
                    font-size: 9px; font-weight: 800; color: #27374D; line-height: 1.25;
                }
                .ppc-card-header .school small { color: #64748b; font-weight: 600; font-size: 8px; display: block; }

                .ppc-row { margin: 3px 0; }
                .ppc-row .lbl {
                    color: #64748b; font-size: 8px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.4px;
                    margin-bottom: 1px;
                }
                .ppc-row .val { color: #1e293b; font-size: 11px; font-weight: 700; }
                .ppc-row .val-name { font-size: 12px; }

                .ppc-credentials {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 4px 8px;
                    margin-top: 5px;
                }
                .ppc-credentials .pair { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; }
                .ppc-credentials .pair + .pair { border-top: 1px solid #e2e8f0; }
                .ppc-credentials .pair .k { font-size: 9px; color: #64748b; font-weight: 700; }
                .ppc-credentials .pair .v {
                    font-family: 'Courier New', monospace;
                    font-size: 13px; font-weight: 900; color: #0f172a;
                    letter-spacing: 0.8px;
                }

                .ppc-footer {
                    text-align: center;
                    border-top: 1px dashed #cbd5e1;
                    padding-top: 4px;
                    margin-top: 5px;
                    font-size: 8px;
                    color: #64748b;
                    line-height: 1.3;
                }
                .ppc-footer strong { color: #27374D; }
                .ppc-footer-url {
                    margin-top: 3px;
                    padding: 2px 4px;
                    background: #f1f5f9;
                    border-radius: 3px;
                    font-size: 9px;
                    direction: ltr;
                    letter-spacing: 0.2px;
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
            `}</style>

            <div className="ppc-toolbar">
                <div>
                    <h1>🎓 بطاقات بوابة ولي الأمر — للطباعة</h1>
                    <small>
                        {total} بطاقة • وُلِّدت في {new Date(generated_at).toLocaleString('ar-AE')}
                        {total > 0 && (
                            <> • {ready ? '✓ جاهز للطباعة' : `⏳ إعداد البطاقات ${renderUpTo}/${total}`}</>
                        )}
                    </small>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link href={route('admin.dashboard')} className="ppc-btn ppc-btn-back">← رجوع</Link>
                    <button
                        type="button"
                        className="ppc-btn ppc-btn-print"
                        disabled={!ready}
                        onClick={handlePrint}
                    >
                        🖨️ طباعة / حفظ PDF
                    </button>
                    <button type="button" className="ppc-btn ppc-btn-done" onClick={handleMarkDistributed}>
                        ✓ تم التوزيع (مسح المؤقت)
                    </button>
                </div>
            </div>

            <div className="ppc-warning">
                ⚠ <strong>مهم:</strong> انتظر حتى يكتمل «إعداد البطاقات» ثم اضغط «طباعة». المعاينة أسرع من الطباعة التلقائية لآلاف البطاقات.
                احفظ PDF ثم «تم التوزيع» لمسح النصوص من قاعدة البيانات.
            </div>

            {total === 0 ? (
                <div className="ppc-empty">
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                    <h2>لا توجد بطاقات للطباعة حالياً</h2>
                    <p>تم توزيع جميع كلمات المرور المُولَّدة سابقاً، أو لم يُولَّد شيء بعد.</p>
                </div>
            ) : (
                pages.map((pageCards, pageIdx) => (
                    <div className="ppc-page" key={pageIdx}>
                        {pageCards.map((s) => (
                            <div className="ppc-card" key={s.id}>
                                <div>
                                    <div className="ppc-card-header">
                                        <span className="icon">🏫</span>
                                        <div className="school">
                                            مدرسة مدينة زايد — بنين
                                            <small>بوابة أولياء الأمور — العام 2025/2026</small>
                                        </div>
                                    </div>

                                    <div className="ppc-row">
                                        <div className="lbl">اسم الطالب</div>
                                        <div className="val val-name">{s.name_ar}</div>
                                    </div>

                                    <div className="ppc-row">
                                        <div className="lbl">الصف / الشعبة</div>
                                        <div className="val">
                                            {s.grade_number} / {s.section_label || s.section_letter || '—'}
                                        </div>
                                    </div>

                                    <div className="ppc-credentials">
                                        <div className="pair">
                                            <span className="k">رقم الطالب</span>
                                            <span className="v">{s.student_no}</span>
                                        </div>
                                        <div className="pair">
                                            <span className="k">كلمة المرور</span>
                                            <span className="v">{s.password}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ppc-footer">
                                    ادخل عبر <strong>بوابة أولياء الأمور</strong> برقم الطالب وكلمة المرور أعلاه
                                    <div className="ppc-footer-url">
                                        🔗 <strong>mzschool-results.com/parent</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {Array.from({ length: PER_PAGE - pageCards.length }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}
