<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement("
            CREATE OR REPLACE VIEW v_student_results AS
            SELECT
                sg.student_id,
                su.name_ar   AS subject_ar,
                su.name_en   AS subject_en,
                st.name_ar   AS teacher_ar,
                st.name_en   AS teacher_en,
                a.note_ar    AS assessment_ar,
                a.note_en    AS assessment_en,
                a.type       AS assessment_type,
                sg.score,
                a.full_mark,
                sg.is_absent,
                NULL         AS feedback_ar,
                NULL         AS feedback_en,
                a.published_at,
                a.id         AS display_order,
                a.group_id,
                g.name_ar    AS group_name_ar
            FROM student_grades sg
            JOIN assessments a  ON a.id  = sg.assessment_id
            JOIN subjects    su ON su.id = a.subject_id
            LEFT JOIN staff  st ON st.id = a.staff_id
            LEFT JOIN groups g  ON g.id  = a.group_id
            WHERE a.status = 'published'
        ");
    }

    public function down(): void
    {
        // Keep the original view structure if rolled back
        DB::statement("
            CREATE OR REPLACE VIEW v_student_results AS
            SELECT
                sg.student_id,
                su.name_ar   AS subject_ar,
                su.name_en   AS subject_en,
                st.name_ar   AS teacher_ar,
                st.name_en   AS teacher_en,
                a.note_ar    AS assessment_ar,
                a.note_en    AS assessment_en,
                a.type       AS assessment_type,
                sg.score,
                a.full_mark,
                sg.is_absent,
                NULL         AS feedback_ar,
                NULL         AS feedback_en,
                a.published_at,
                a.id         AS display_order
            FROM student_grades sg
            JOIN assessments a  ON a.id  = sg.assessment_id
            JOIN subjects    su ON su.id = a.subject_id
            LEFT JOIN staff  st ON st.id = a.staff_id
            WHERE a.status = 'published'
        ");
    }
};
