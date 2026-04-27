<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use App\Models\StudentGrade;
use App\Models\TeacherAssignment;
use Illuminate\Http\Request;
use App\Models\Grade;
use App\Models\Section;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminPortalController extends Controller
{
    public function dashboard()
    {
        // 1. إحصائيات سريعة (KPIs)
        $stats = [
            'teachers_count' => Staff::count(),
            'students_count' => Student::where('is_active', true)->count(),
            'grades_count'   => StudentGrade::count(),
            'completion'     => $this->getTotalPerformanceRate(),
        ];

        // 2. تقرير أداء المعلمين
        $teachers_report = Staff::with(['assignments.section.grade', 'assignments.subject'])
            ->get()
            ->map(function($staff) {
                return [
                    'id'            => $staff->id,
                    'user_id'       => $staff->user_id,
                    'name_ar'       => $staff->name_ar,
                    'name_en'       => $staff->name_en,
                    'is_staff'      => $staff->staff_no,
                    'completion'    => $this->getStaffPerformance($staff->id),
                    'assignments'   => $staff->assignments->map(function($a) use ($staff) {
                        $actualCount = \App\Models\Assessment::where([
                            'staff_id'   => $staff->id,
                            'section_id' => $a->section_id,
                            'subject_id' => $a->subject_id
                        ])->count();
                        
                        $expected = $a->expected_assessments ?? 5;
                        $pct = $expected > 0 ? round(($actualCount / $expected) * 100) : 0;

                        return [
                            'section_id' => $a->section_id,
                            'subject_id' => $a->subject_id,
                            'section_name' => $a->section->label_ar ?? (($a->section->grade->number ?? '') . ($a->section->letter ?? '')),
                            'label' => ($a->subject->name_ar ?? ''),
                            'label_ar' => ($a->subject->name_ar ?? ''),
                            'label_en' => ($a->subject->name_en ?? $a->subject->name_ar ?? ''),
                            'completion_ratio' => "{$actualCount}/{$expected}",
                            'completion_pct' => "({$pct}%)",
                            'has_data' => $actualCount > 0
                        ];

                    })
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats'        => $stats,
            'reports'      => $teachers_report,
            'all_grades'   => Grade::orderBy('number')->get(),
            'all_sections' => Section::all(),
            'all_subjects' => Subject::orderBy('name_ar')->get(),
            'students_list' => Student::where('is_active', true)
                ->select('id', 'name_ar', 'student_no')
                ->get(),
        ]);
    }

    private function getTotalPerformanceRate()
    {
        $total_score = DB::table('student_grades')->sum('score');
        
        $total_possible = 0;
        $assessments = DB::table('assessments')->get(['section_id', 'full_mark']);
        
        // Cache student counts per section to avoid repeated queries
        $student_counts = DB::table('students')
            ->where('is_active', true)
            ->select('section_id', DB::raw('count(*) as count'))
            ->groupBy('section_id')
            ->pluck('count', 'section_id');

        foreach ($assessments as $ass) {
            $count = $student_counts[$ass->section_id] ?? 0;
            $total_possible += $ass->full_mark * $count;
        }

        return $total_possible > 0 ? round(($total_score / $total_possible) * 100) : 0;
    }

    private function getStaffPerformance($staffId)
    {
        $total_score = DB::table('student_grades')
            ->join('assessments', 'student_grades.assessment_id', '=', 'assessments.id')
            ->where('assessments.staff_id', $staffId)
            ->sum('student_grades.score');
        
        $total_possible = 0;
        $assessments = DB::table('assessments')
            ->where('staff_id', $staffId)
            ->get(['section_id', 'full_mark']);
            
        $student_counts = DB::table('students')
            ->where('is_active', true)
            ->select('section_id', DB::raw('count(*) as count'))
            ->groupBy('section_id')
            ->pluck('count', 'section_id');

        foreach ($assessments as $ass) {
            $count = $student_counts[$ass->section_id] ?? 0;
            $total_possible += $ass->full_mark * $count;
        }

        return $total_possible > 0 ? round(($total_score / $total_possible) * 100) : 0;
    }

    private function checkAssignmentData($sectionId, $subjectId)
    {
        return DB::table('assessments')
            ->where('section_id', $sectionId)
            ->where('subject_id', $subjectId)
            ->exists();
    }

    public function getStudentsAjax(Request $request)
    {
        $query = Student::with(['grade', 'section']);
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name_ar', 'like', "%{$request->search}%")
                  ->orWhere('student_no', 'like', "%{$request->search}%")
                  ->orWhere('name_en', 'like', "%{$request->search}%");
            });
        }
        
        if ($request->grade_id) {
            $query->where('grade_id', $request->grade_id);
        }
        
        if ($request->section_id) {
            $query->where('section_id', $request->section_id);
        }
        
        if ($request->is_active !== null) {
            $query->where('is_active', $request->is_active == 'true');
        }

        $students = $query->paginate(15);
        
        // Add performance % to each student (optional, but requested in design)
        $students->getCollection()->transform(function($student) {
            $student->performance = $this->getStudentPerformance($student->id);
            return $student;
        });

        return response()->json($students);
    }

    private function getStudentPerformance($studentId)
    {
        $student = Student::findOrFail($studentId);
        $assessments = \App\Models\Assessment::where('section_id', $student->section_id)->get();
        if ($assessments->isEmpty()) return 0;
        
        $total_possible = $assessments->sum('full_mark');
        $total_actual = StudentGrade::where('student_id', $studentId)
            ->whereIn('assessment_id', $assessments->pluck('id'))
            ->sum('score');
            
        return $total_possible > 0 ? round(($total_actual / $total_possible) * 100) : 0;
    }

    public function storeStudent(Request $request)
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'student_no' => 'required|string|unique:students,student_no',
            'student_id_no' => 'required|string',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'parent_mobile' => 'nullable|string',
        ]);

        Student::create([
            'id' => (string) Str::uuid(),
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
            'student_no' => $request->student_no,
            'student_id_no' => $request->student_id_no,
            'grade_id' => $request->grade_id,
            'section_id' => $request->section_id,
            'parent_mobile' => $request->parent_mobile,
            'is_active' => true,
        ]);

        return back();
    }

    public function transferStudent(Request $request, $id)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        $student = Student::findOrFail($id);
        $student->update([
            'grade_id' => $request->grade_id,
            'section_id' => $request->section_id,
        ]);

        return back();
    }

    public function archiveStudent($id)
    {
        $student = Student::findOrFail($id);
        $student->update(['is_active' => !$student->is_active]); // Toggle archive
        return back();
    }

    public function getStaffAssignmentsAjax($staffId)
    {
        $assignments = TeacherAssignment::where('staff_id', $staffId)
            ->with(['section.grade', 'subject'])
            ->get();
        return response()->json($assignments);
    }

    public function storeStaff(Request $request)
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'staff_no' => 'required|string|unique:staff,staff_no',
            'password' => 'required|string|min:4',
        ]);

        return DB::transaction(function() use ($request) {
            $user = User::create([
                'name' => $request->name_ar,
                'email' => $request->staff_no . '@school.com', // Placeholder email
                'password' => Hash::make($request->password),
                'role' => 'teacher',
                'login_id' => $request->staff_no,
            ]);

            Staff::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'name_ar' => $request->name_ar,
                'name_en' => $request->name_en,
                'staff_no' => $request->staff_no,
                'is_active' => true,
            ]);

            return back();
        });
    }

    public function updateStaff(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);
        $user = User::findOrFail($staff->user_id);

        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'staff_no' => 'required|string|unique:staff,staff_no,' . $staff->id,
            'password' => 'nullable|string|min:4',
        ]);

        return DB::transaction(function() use ($request, $staff, $user) {
            $staff->update([
                'name_ar' => $request->name_ar,
                'name_en' => $request->name_en,
                'staff_no' => $request->staff_no,
            ]);

            $userData = [
                'name' => $request->name_ar,
                'email' => $request->staff_no . '@school.com',
                'login_id' => $request->staff_no,
            ];

            if ($request->password) {
                $userData['password'] = Hash::make($request->password);
            }

            $user->update($userData);

            return back();
        });
    }


    public function deleteStaff($id)
    {
        $staff = Staff::findOrFail($id);
        $user = User::find($staff->user_id);

        return DB::transaction(function() use ($staff, $user) {
            $staff->delete();
            if ($user) {
                $user->delete();
            }
            return back();
        });
    }

    public function storeSubject(Request $request)
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
        ]);

        Subject::create([
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
        ]);

        return back();
    }

    public function updateSubject(Request $request, $id)
    {
        $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
        ]);

        $subject = Subject::findOrFail($id);
        $subject->update([
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
        ]);

        return back();
    }

    public function deleteSubject($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
        return back();
    }

    public function storeAssignment(Request $request)
    {
        $request->validate([
            'staff_id'   => 'required|exists:staff,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'student_ids' => 'nullable|array', // For elective assignments
        ]);

        // Prevent duplicates
        $exists = TeacherAssignment::where([
            'staff_id'   => $request->staff_id,
            'section_id' => $request->section_id,
            'subject_id' => $request->subject_id
        ])->exists();

        if ($exists) {
            return back()->withErrors(['error' => 'هذا التكليف (المادة والصف) مسند بالفعل لهذا المعلم مسبقاً.']);
        }

        return DB::transaction(function() use ($request) {
            $assignment = TeacherAssignment::create([
                'staff_id'   => $request->staff_id,
                'section_id' => $request->section_id,
                'subject_id' => $request->subject_id,
                'semester_id' => 3,
                'expected_assessments' => 5,
            ]);

            // If specific students are selected, save them
            if ($request->has('student_ids') && !empty($request->student_ids)) {
                foreach ($request->student_ids as $sid) {
                    DB::table('elective_students')->insert([
                        'assignment_id' => $assignment->id,
                        'student_id'    => $sid,
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ]);
                }
            }

            return back();
        });
    }

    public function deleteAssignment($id)
    {
        $assignment = TeacherAssignment::findOrFail($id);
        $assignment->delete();
        return back();
    }

    public function viewSubjectGrades($staffId, $sectionId, $subjectId)
    {
        $staff = Staff::findOrFail($staffId);
        $section = \App\Models\Section::with('grade')->findOrFail($sectionId);
        $subject = \App\Models\Subject::findOrFail($subjectId);

        $assessments = \App\Models\Assessment::where('staff_id', $staffId)
            ->where('section_id', $sectionId)
            ->where('subject_id', $subjectId)
            ->get();

        $assignment = TeacherAssignment::where([
            'staff_id'   => $staffId,
            'section_id' => $sectionId,
            'subject_id' => $subjectId
        ])->first();

        $electiveStudentIds = [];
        if ($assignment) {
            $electiveStudentIds = DB::table('elective_students')
                ->where('assignment_id', $assignment->id)
                ->pluck('student_id')
                ->toArray();
        }

        $studentQuery = Student::where('section_id', $sectionId)
            ->where('is_active', true);

        if (!empty($electiveStudentIds)) {
            $studentQuery->whereIn('id', $electiveStudentIds);
        }

        $students = $studentQuery->orderBy('name_ar')->get();

        $grades = StudentGrade::whereIn('assessment_id', $assessments->pluck('id'))->get();

        return Inertia::render('Admin/SubjectGrades', [
            'staff' => $staff,
            'section' => $section,
            'subject' => $subject,
            'assessments' => $assessments,
            'students' => $students,
            'grades' => $grades,
        ]);
    }

    public function resetTeacherPassword(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'password' => 'required|string|min:4|confirmed',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return back();
    }

    public function resetMyPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:4|confirmed',
        ]);

        Auth::user()->update([
            'password' => Hash::make($request->password)
        ]);

        return back();
    }

    public function viewTeacherProfile($id)
    {
        $staff = Staff::findOrFail($id);
        
        $assignments = TeacherAssignment::where('staff_id', $id)
            ->with(['section.grade', 'subject'])
            ->get();

        $reportData = $assignments->map(function($a) use ($id) {
            $assessments = \App\Models\Assessment::where([
                'staff_id'   => $id,
                'section_id' => $a->section_id,
                'subject_id' => $a->subject_id
            ])->get();

            $electiveStudentIds = DB::table('elective_students')
                ->where('assignment_id', $a->id)
                ->pluck('student_id')
                ->toArray();

            $studentQuery = Student::where('section_id', $a->section_id)
                ->where('is_active', true);

            if (!empty($electiveStudentIds)) {
                $studentQuery->whereIn('id', $electiveStudentIds);
            }

            $students = $studentQuery->orderBy('name_ar')->get();
            $grades = StudentGrade::whereIn('assessment_id', $assessments->pluck('id'))->get();

            // Calculate Success Rate
            $totalStudents = $students->count();
            $passedCount = 0;
            
            if ($totalStudents > 0 && $assessments->count() > 0) {
                foreach ($students as $student) {
                    $studentTotal = $grades->where('student_id', $student->id)->sum('score');
                    $fullTotal = $assessments->sum('full_mark');
                    if ($fullTotal > 0 && ($studentTotal / $fullTotal) >= 0.5) {
                        $passedCount++;
                    }
                }
            }

            $successRate = $totalStudents > 0 ? round(($passedCount / $totalStudents) * 100) : 0;
            $avgScore = 0;
            if ($totalStudents > 0 && $assessments->count() > 0) {
                $actualSum = $grades->sum('score');
                $possibleSum = $totalStudents * $assessments->sum('full_mark');
                $avgScore = $possibleSum > 0 ? round(($actualSum / $possibleSum) * 100) : 0;
            }

            return [
                'id' => $a->id,
                'section_id' => $a->section_id,
                'subject_id' => $a->subject_id,
                'section_name' => $a->section->label_ar ?? ($a->section->grade->number . $a->section->letter),
                'subject_name' => (string)$a->subject->name_ar,
                'subject_name_ar' => (string)$a->subject->name_ar,
                'subject_name_en' => !empty($a->subject->name_en) ? (string)$a->subject->name_en : (string)$a->subject->name_ar,
                'subject' => $a->subject,
                'assessments' => $assessments,
                'students' => $students,
                'grades' => $grades,
                'success_rate' => $successRate,
                'avg_score' => $avgScore,
                'total_students' => $totalStudents,
                'passed_count' => $passedCount
            ];
        });

        return Inertia::render('Admin/TeacherProfile', [
            'staff' => $staff,
            'reportData' => $reportData,
        ]);
    }
}
