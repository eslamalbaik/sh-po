<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\TeacherAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Resources\SubjectGroupResource;

class StaffPortalController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        if ($user && strtolower(trim($user->role)) === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // جلب المعلم المرتبط بالمستخدم
        $staff = $user->staff;
        
        if (!$staff) {
            return Inertia::render('Staff/Dashboard', [
                'staff'       => null,
                'assignments' => [],
                'error'       => 'لم يتم العثور على سجل الموظف الخاص بك. يرجى مراجعة الإدارة.'
            ]);
        }
        
        // جلب التكليفات (الصفوف والمواد المسندة للمعلم)
        $assignments = TeacherAssignment::where('staff_id', $staff->id)
            ->with(['section.grade', 'subject', 'staff'])
            ->get();

        // جلب المجموعات المسندة للمعلم
        $groups = \App\Models\Group::where('staff_id', $staff->id)
            ->with(['grade', 'subject', 'students', 'teacher'])
            ->get();
            
        $subjects = collect();
        
        // تحويل التكليفات العادية
        foreach ($assignments as $a) {
            $subjects->push([
                'id' => $a->id,
                'type' => 'section',
                'name_ar' => $a->section->label_ar ?? (($a->section->grade->number ?? '') . ($a->section->letter ?? '')),
                'name_en' => $a->section->label_en ?? $a->section->label_ar ?? '',
                'subject_id' => $a->subject_id,
                'subject_name_ar' => $a->subject->name_ar ?? '',
                'subject_name_en' => $a->subject->name_en ?? $a->subject->name_ar ?? '',
                'teacher_name_ar' => $a->staff->name_ar ?? '',
                'teacher_name_en' => $a->staff->name_en ?? $a->staff->name_ar ?? '',
                'students_count' => \App\Models\Student::where('section_id', $a->section_id)->where('is_active', true)->count(),
                'grade_name' => $a->section->grade->number ?? '',
                'subject' => $a->subject,
                'section_id' => $a->section_id,
                'section' => $a->section,
                'staff' => $a->staff,
            ]);
        }
        
        // تحويل المجموعات
        foreach ($groups as $g) {
            $subjects->push([
                'id' => $g->id,
                'type' => 'group',
                'name_ar' => $g->name_ar,
                'name_en' => $g->name_en ?? $g->name_ar,
                'description' => $g->description,
                'subject_id' => $g->subject_id,
                'subject_name_ar' => $g->subject->name_ar ?? '',
                'subject_name_en' => $g->subject->name_en ?? $g->subject->name_ar ?? '',
                'teacher_name_ar' => $g->teacher->name_ar ?? '',
                'teacher_name_en' => $g->teacher->name_en ?? $g->teacher->name_ar ?? '',
                'students_count' => $g->students->count(),
                'grade_name' => $g->grade->number ?? '',
                'subject' => $g->subject,
                'grade' => $g->grade,
                'teacher' => $g->teacher,
                'students' => $g->students,
            ]);
        }
            
        return Inertia::render('Staff/Dashboard', [
            'staff'       => $staff,
            'user'        => $user,
            'subjects'    => $subjects->values()->all(),
            'assignments' => $assignments,
            'groups'      => $groups,
            'allSubjects' => \App\Models\Subject::all(),
            'allStudents' => \App\Models\Student::where('is_active', true)->get(),
        ]);
    }

    /**
     * جلب بيانات الطلاب والدرجات لشعبة ومادة معينة
     */
    public function getGrades(Request $request)
    {
        $request->validate([
            'section_id' => 'nullable',
            'group_id'   => 'nullable',
            'subject_id' => 'required',
        ]);

        // Check if this is an elective assignment (has specific students)
        $staffId = Auth::user()->staff->id;
        $assignment = TeacherAssignment::where([
            'staff_id'   => $staffId,
            'section_id' => $request->section_id,
            'subject_id' => $request->subject_id
        ])->first();

        $electiveStudentIds = [];
        if ($assignment) {
            $electiveStudentIds = DB::table('elective_students')
                ->where('assignment_id', $assignment->id)
                ->pluck('student_id')
                ->toArray();
        }

        $studentQuery = Student::where('is_active', true);

        if ($request->group_id) {
            $group = \App\Models\Group::findOrFail($request->group_id);
            $studentQuery->whereIn('id', $group->students()->pluck('students.id'));
        } else {
            $studentQuery->where('section_id', $request->section_id);
            if (!empty($electiveStudentIds)) {
                $studentQuery->whereIn('id', $electiveStudentIds);
            }
        }

        $students = $studentQuery->orderBy('name_ar')->get();

        $assessmentQuery = Assessment::where('subject_id', $request->subject_id)
            ->where('staff_id', $staffId);

        if ($request->group_id) {
            $assessmentQuery->where('group_id', $request->group_id);
        } else {
            $assessmentQuery->where('section_id', $request->section_id);
        }

        $assessments = $assessmentQuery->get();

        $grades = StudentGrade::whereIn('assessment_id', $assessments->pluck('id'))
            ->get();

        return response()->json([
            'students'    => $students,
            'assessments' => $assessments,
            'grades'      => $grades, // This now includes is_absent
        ]);
    }

    /**
     * حفظ درجة طالب
     */
    public function saveGrade(Request $request)
    {
        $request->validate([
            'assessment_id' => 'required',
            'student_id'    => 'required',
            'score'         => 'nullable|numeric',
            'is_absent'     => 'nullable|boolean',
        ]);

        StudentGrade::updateOrInsert(
            [
                'assessment_id' => $request->assessment_id,
                'student_id'    => $request->student_id,
            ],
            [
                'score'      => $request->score,
                'is_absent'  => $request->is_absent ?? 0,
                'updated_at' => now(),
            ]
        );

        return response()->json(['status' => 'success']);
    }

    /**
     * إضافة تقييم جديد
     */
    public function storeAssessment(Request $request)
    {
        $request->validate([
            'section_id' => 'nullable|exists:sections,id',
            'group_id'   => 'nullable|exists:groups,id',
            'subject_id' => 'required|exists:subjects,id',
            'note_ar'    => 'required|string',
            'full_mark'  => 'required|numeric',
            'type'       => 'nullable|string',
        ]);

        $staff = Auth::user()->staff;
        if (!$staff) {
            return response()->json(['status' => 'error', 'message' => 'لم يتم العثور على ملف الموظف الخاص بك في النظام. يرجى مراجعة الإدارة.'], 403);
        }

        // Use direct type if valid, otherwise fallback
        $allowedTypes = ['exam', 'task', 'quiz', 'project', 'oral', 'formative', 'homework'];
        $dbType = in_array($request->type, $allowedTypes) ? $request->type : 'exam';


        Assessment::create([
            'section_id' => $request->section_id,
            'group_id'   => $request->group_id,
            'subject_id' => $request->subject_id,
            'staff_id'   => $staff->id,
            'note_ar'    => $request->note_ar,
            'full_mark'  => $request->full_mark,
            'type'       => $dbType,
            'status'     => 'published',
            'published_at' => now(),
        ]);

        return response()->json(['status' => 'success']);
    }

    /**
     * حذف تقييم
     */
    public function deleteAssessment($id)
    {
        $assessment = Assessment::findOrFail($id);
        
        if ($assessment->staff_id !== Auth::user()->staff->id) {
            return response()->json(['status' => 'error', 'message' => 'عذراً، ليس لديك الصلاحية للقيام بهذا الإجراء.'], 403);
        }

        $assessment->delete();

        return response()->json(['status' => 'success']);
    }

    /**
     * تحديث كلمة سر المعلم
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:4|confirmed',
        ]);

        $user = Auth::user();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json(['status' => 'success']);
    }

    /**
     * تحديث طلاب المجموعة
     */
    public function updateGroupStudents(Request $request, $id)
    {
        $request->validate([
            'student_ids' => 'present|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $group = \App\Models\Group::findOrFail($id);
        
        $staff = Auth::user()->staff;
        if (!$staff || $group->staff_id !== $staff->id) {
            return response()->json(['status' => 'error', 'message' => 'عذراً، ليس لديك الصلاحية لتعديل هذه المجموعة.'], 403);
        }

        $group->students()->sync($request->student_ids);

        return response()->json(['status' => 'success', 'message' => 'تم تحديث طلاب المجموعة بنجاح']);
    }

    /**
     * حذف مجموعة
     */
    public function deleteGroup($id)
    {
        $group = \App\Models\Group::findOrFail($id);
        
        $staff = Auth::user()->staff;
        if (!$staff || $group->staff_id !== $staff->id) {
            return response()->json(['status' => 'error', 'message' => 'عذراً، ليس لديك الصلاحية لحذف هذه المجموعة.'], 403);
        }

        $group->delete();

        return response()->json(['status' => 'success', 'message' => 'تم حذف المجموعة بنجاح']);
    }
}
