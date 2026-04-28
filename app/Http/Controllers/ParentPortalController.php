<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentResultView;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentPortalController extends Controller
{
    /**
     * عرض الصفحة الرئيسية لبوابة ولي الأمر (index.html سابقاً)
     */
    public function index()
    {
        return Inertia::render('Parent/Index');
    }

    /**
     * عملية تسجيل الدخول لولي الأمر (تعتمد على رقم الطالب ورقم الهوية)
     */
    public function login(Request $request)
    {
        $request->validate([
            'student_no' => 'required|string',
            'id_no'      => 'required|string',
        ]);

        $id_no = str_replace('-', '', $request->id_no);

        $student = Student::where('student_no', $request->student_no)
            ->whereRaw("REPLACE(student_id_no, '-', '') = ?", [$id_no])
            ->first();

        if (!$student) {
            return back()->withErrors(['login' => 'بيانات الدخول غير صحيحة. يرجى التأكد من رقم الطالب ورقم الهوية والمحاولة مرة أخرى.']);
        }

        // تخزين رقم الطالب في الجلسة (نفس منطق Supabase السابق الذي يعتمد على localStorage في المتصفح)
        session(['parent_student_id' => $student->id]);

        return redirect()->route('parent.results');
    }

    /**
     * جلب النتائج وعرضها (مكافئ لـ loadParentResults في index.html)
     */
    public function results()
    {
        $studentId = session('parent_student_id');

        if (!$studentId) {
            return redirect()->route('parent.index');
        }

        $student = Student::with(['grade', 'section'])->findOrFail($studentId);
        
        // 1. جلب كافة التقييمات المنشورة للشعبة أو المجموعات
        $assessments = Assessment::where(function($q) use ($student) {
                $q->where('section_id', $student->section_id)
                  ->orWhereIn('group_id', $student->groups()->pluck('groups.id'));
            })
            ->where('status', 'published')
            ->whereExists(function($q) {
                // التأكد من وجود درجة واحدة على الأقل في هذا التقييم لأي طالب
                $q->select(DB::raw(1))
                  ->from('student_grades')
                  ->whereRaw('student_grades.assessment_id = assessments.id');
            })
            ->with(['subject', 'staff', 'group'])
            ->get();

        // 2. دمج التقييمات مع درجات هذا الطالب تحديداً
        $results = $assessments->map(function($a) use ($studentId) {
            $grade = StudentGrade::where('assessment_id', $a->id)
                ->where('student_id', $studentId)
                ->first();
            
            return [
                'assessment_id' => $a->id,
                'assessment_ar' => $a->note_ar,
                'assessment_en' => $a->note_en ?? $a->note_ar,
                'assessment_type' => $a->type,
                'subject_id' => $a->subject_id,
                'subject_ar' => $a->subject->name_ar ?? '',
                'subject_en' => $a->subject->name_en ?? $a->subject->name_ar ?? '',
                'teacher_ar' => $a->staff->name_ar ?? '',
                'teacher_en' => $a->staff->name_en ?? $a->staff->name_ar ?? '',
                'score' => $grade ? $grade->score : null,
                'is_absent' => $grade ? $grade->is_absent : false,
                'full_mark' => $a->full_mark,
                'published_at' => $a->published_at,
                'group_id' => $a->group_id,
                'group_name_ar' => $a->group->name_ar ?? null,
                'display_order' => $a->id,
            ];
        });

        // جلب المجموعات المسجل فيها الطالب (تظهر كمواد حتى لو لا تقييمات بعد)
        $groups = \App\Models\Group::whereHas('students', function($q) use ($studentId) {
                $q->where('students.id', $studentId);
            })
            ->with(['subject', 'teacher', 'grade'])
            ->get()
            ->map(function($g) {
                return [
                    'id'              => $g->id,
                    'type'            => 'group',
                    'name_ar'         => $g->name_ar,
                    'name_en'         => $g->name_en ?? $g->name_ar,
                    'subject_name_ar' => $g->subject->name_ar ?? '',
                    'subject_name_en' => $g->subject->name_en ?? $g->subject->name_ar ?? '',
                    'teacher_name_ar' => $g->teacher->name_ar ?? '',
                    'teacher_name_en' => $g->teacher->name_en ?? $g->teacher->name_ar ?? '',
                    'grade_name'      => $g->grade->number ?? '',
                    'students_count'  => 0,
                    'subject_id'      => $g->subject_id,
                ];
            })->values()->all();

        return Inertia::render('Parent/Results', [
            'student' => $student,
            'results' => $results,
            'groups'  => $groups,
        ]);
    }

    /**
     * عرض النتائج مباشرة عبر المعرف (تستخدم من قبل الإدارة)
     */
    public function resultsDirect(Request $request)
    {
        $studentId = $request->query('sid');

        if (!$studentId) {
            return redirect()->route('parent.index');
        }

        $student = Student::with(['grade', 'section'])->findOrFail($studentId);
        
        $assessments = Assessment::where(function($q) use ($student) {
                $q->where('section_id', $student->section_id)
                  ->orWhereIn('group_id', $student->groups()->pluck('groups.id'));
            })
            ->where('status', 'published')
            ->whereExists(function($q) {
                $q->select(DB::raw(1))
                  ->from('student_grades')
                  ->whereRaw('student_grades.assessment_id = assessments.id');
            })
            ->with(['subject', 'staff', 'group'])
            ->get();

        $results = $assessments->map(function($a) use ($studentId) {
            $grade = StudentGrade::where('assessment_id', $a->id)
                ->where('student_id', $studentId)
                ->first();
            
            return [
                'assessment_id' => $a->id,
                'assessment_ar' => $a->note_ar,
                'assessment_en' => $a->note_en ?? $a->note_ar,
                'assessment_type' => $a->type,
                'subject_id' => $a->subject_id,
                'subject_ar' => $a->subject->name_ar ?? '',
                'subject_en' => $a->subject->name_en ?? $a->subject->name_ar ?? '',
                'teacher_ar' => $a->staff->name_ar ?? '',
                'teacher_en' => $a->staff->name_en ?? $a->staff->name_ar ?? '',
                'score' => $grade ? $grade->score : null,
                'is_absent' => $grade ? $grade->is_absent : false,
                'full_mark' => $a->full_mark,
                'published_at' => $a->published_at,
                'group_id' => $a->group_id,
                'group_name_ar' => $a->group->name_ar ?? null,
                'display_order' => $a->id,
            ];
        });

        // جلب المجموعات المسجل فيها الطالب
        $groups = \App\Models\Group::whereHas('students', function($q) use ($studentId) {
                $q->where('students.id', $studentId);
            })
            ->with(['subject', 'teacher', 'grade'])
            ->get()
            ->map(function($g) {
                return [
                    'id'              => $g->id,
                    'type'            => 'group',
                    'name_ar'         => $g->name_ar,
                    'name_en'         => $g->name_en ?? $g->name_ar,
                    'subject_name_ar' => $g->subject->name_ar ?? '',
                    'subject_name_en' => $g->subject->name_en ?? $g->subject->name_ar ?? '',
                    'teacher_name_ar' => $g->teacher->name_ar ?? '',
                    'teacher_name_en' => $g->teacher->name_en ?? $g->teacher->name_ar ?? '',
                    'grade_name'      => $g->grade->number ?? '',
                    'students_count'  => 0,
                    'subject_id'      => $g->subject_id,
                ];
            })->values()->all();

        return Inertia::render('Parent/Results', [
            'student' => $student,
            'results' => $results,
            'groups'  => $groups,
            'isAdminView' => true
        ]);
    }

    public function logout()
    {
        session()->forget('parent_student_id');
        return redirect()->route('parent.index');
    }
}
