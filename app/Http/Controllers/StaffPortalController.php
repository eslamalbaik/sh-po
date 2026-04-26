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

class StaffPortalController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
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
            ->with(['section.grade', 'subject'])
            ->get();

        return Inertia::render('Staff/Dashboard', [
            'staff'       => $staff,
            'assignments' => $assignments,
        ]);
    }

    /**
     * جلب بيانات الطلاب والدرجات لشعبة ومادة معينة
     */
    public function getGrades(Request $request)
    {
        $request->validate([
            'section_id' => 'required',
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

        $studentQuery = Student::where('section_id', $request->section_id)
            ->where('is_active', true);

        if (!empty($electiveStudentIds)) {
            $studentQuery->whereIn('id', $electiveStudentIds);
        }

        $students = $studentQuery->orderBy('name_ar')->get();

        $assessments = Assessment::where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->where('staff_id', $staffId) // Only show assessments created by THIS teacher
            ->get();

        $grades = StudentGrade::whereIn('assessment_id', $assessments->pluck('id'))
            ->get();

        return response()->json([
            'students'    => $students,
            'assessments' => $assessments,
            'grades'      => $grades,
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
        ]);

        StudentGrade::updateOrInsert(
            [
                'assessment_id' => $request->assessment_id,
                'student_id'    => $request->student_id,
            ],
            [
                'score'      => $request->score,
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
            'section_id' => 'required',
            'subject_id' => 'required',
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
}
