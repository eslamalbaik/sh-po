<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use App\Models\StudentGrade;
use App\Models\TeacherAssignment;
use Illuminate\Http\Request;
use App\Models\Group;
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

        // 2. تقرير أداء المعلمين (مع الترقيم)
        $teachers_report = Staff::with(['assignments.section.grade', 'assignments.subject', 'groups.subject'])
            ->paginate(12); // 12 معلمين في الصفحة

        $teachers_report->getCollection()->transform(function($staff) {
            return [
                'id'            => $staff->id,
                'user_id'       => $staff->user_id,
                'name_ar'       => $staff->name_ar,
                'name_en'       => $staff->name_en,
                'is_staff'      => $staff->staff_no,
                'completion'    => $this->getStaffPerformance($staff->id),
                'assignments'   => (function() use ($staff) {
                    $all = collect();
                    foreach ($staff->assignments as $a) {
                        $actualCount = \App\Models\Assessment::where([
                            'staff_id'   => $staff->id,
                            'section_id' => $a->section_id,
                            'subject_id' => $a->subject_id
                        ])->has('studentGrades')->count();
                        
                        $expected = $a->expected_assessments ?? 5;
                        $pct = $expected > 0 ? min(round(($actualCount / $expected) * 100), 100) : 0;

                        $all->push([
                            'section_id' => $a->section_id,
                            'subject_id' => $a->subject_id,
                            'section_name' => $a->section->label_ar ?? (($a->section->grade->number ?? '') . ($a->section->letter ?? '')),
                            'label' => ($a->subject->name_ar ?? ''),
                            'label_ar' => ($a->subject->name_ar ?? ''),
                            'label_en' => ($a->subject->name_en ?? $a->subject->name_ar ?? ''),
                            'completion_ratio' => "{$actualCount}/{$expected}",
                            'completion_pct' => "({$pct}%)",
                            'has_data' => $actualCount > 0
                        ]);
                    }
                    foreach ($staff->groups as $g) {
                        $actualCount = \App\Models\Assessment::where('group_id', $g->id)
                            ->has('studentGrades')
                            ->count();
                        $expected = 5;
                        $pct = $expected > 0 ? min(round(($actualCount / $expected) * 100), 100) : 0;
                        $all->push([
                            'group_id' => $g->id,
                            'type' => 'group',
                            'section_id' => null,
                            'subject_id' => $g->subject_id,
                            'section_name' => $g->name_ar . ' (مجموعة)',
                            'label' => ($g->subject->name_ar ?? ''),
                            'label_ar' => ($g->subject->name_ar ?? ''),
                            'label_en' => ($g->subject->name_en ?? $g->subject->name_ar ?? ''),
                            'completion_ratio' => "{$actualCount}/{$expected}",
                            'completion_pct' => "({$pct}%)",
                            'has_data' => $actualCount > 0
                        ]);
                    }
                    return $all;
                })()
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats'        => $stats,
            'reports'      => $teachers_report,
            'all_teachers_list' => Staff::select('id', 'name_ar', 'name_en')->get(),
            'all_grades'   => Grade::orderBy('number')->get(),
            'all_sections' => Section::all(),
            'all_subjects' => Subject::orderBy('name_ar')->get(),
            'all_groups'   => Group::with(['teacher', 'subject', 'grade', 'students'])->get(),
            'students_list' => Student::where('is_active', true)
                ->select('id', 'name_ar', 'student_no')
                ->get(),
        ]);
    }

    private function getTotalPerformanceRate()
    {
        // حساب إجمالي التكليفات المسندة (الأقسام + المجموعات)
        $assignmentCount = DB::table('teacher_assignments')->count();
        $groupCount = DB::table('groups')->count();
        
        $totalExpected = ($assignmentCount + $groupCount) * 5;
        
        // حساب التكليفات التي تم رصد درجاتها بالفعل
        $totalActual = \App\Models\Assessment::has('studentGrades')->count();

        return $totalExpected > 0 ? min(round(($totalActual / $totalExpected) * 100), 100) : 0;
    }

    private function getStaffPerformance($staffId)
    {
        // حساب عدد المهام المسندة للمعلم (أقسام + مجموعات)
        $assignmentCount = DB::table('teacher_assignments')
            ->where('staff_id', $staffId)
            ->count();
            
        $groupCount = DB::table('groups')
            ->where('staff_id', $staffId)
            ->count();
            
        $totalExpected = ($assignmentCount + $groupCount) * 5;
        
        // حساب عدد التقييمات التي رصد المعلم درجاتها بالفعل
        $totalActual = \App\Models\Assessment::where('staff_id', $staffId)
            ->has('studentGrades')
            ->count();

        return $totalExpected > 0 ? min(round(($totalActual / $totalExpected) * 100), 100) : 0;
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
                $q->search($request->search);
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
        
        // 1. التقييمات العادية للشعبة
        $sectionAssessments = \App\Models\Assessment::where('section_id', $student->section_id)->get();
        
        // 2. تقييمات المجموعات المشترك فيها الطالب
        $groupAssessments = \App\Models\Assessment::whereHas('group.students', function($q) use ($studentId) {
            $q->where('students.id', $studentId);
        })->get();

        $allAssessments = $sectionAssessments->merge($groupAssessments);
        
        if ($allAssessments->count() === 0) return 0;

        $totalScore = StudentGrade::where('student_id', $studentId)
            ->whereIn('assessment_id', $allAssessments->pluck('id'))
            ->sum('score');
            
        $totalPossible = $allAssessments->sum('full_mark');

        return $totalPossible > 0 ? min(round(($totalScore / $totalPossible) * 100), 100) : 0;
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

    public function viewSubjectGrades($staffId, $sectionId, $subjectId, \Illuminate\Http\Request $request)
    {
        $groupId = $request->query('group_id');
        $staff = Staff::findOrFail($staffId);
        $subject = \App\Models\Subject::findOrFail($subjectId);

        // --- Group mode ---
        if ($groupId) {
            $group = Group::with(['grade', 'students', 'teacher'])->findOrFail($groupId);

            $assessments = \App\Models\Assessment::where('group_id', $groupId)
                ->where('subject_id', $subjectId)
                ->get();

            $students = $group->students()->where('is_active', true)->orderBy('name_ar')->get();
            $section = (object) ['grade' => $group->grade, 'letter' => '(مجموعة)', 'label_ar' => $group->name_ar];

        // --- Normal section mode ---
        } else {
            $section = \App\Models\Section::with('grade')->findOrFail($sectionId);

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

            $studentQuery = Student::where('section_id', $sectionId)->where('is_active', true);
            if (!empty($electiveStudentIds)) {
                $studentQuery->whereIn('id', $electiveStudentIds);
            }
            $students = $studentQuery->orderBy('name_ar')->get();
        }

        $grades = StudentGrade::whereIn('assessment_id', $assessments->pluck('id'))->get();

        return Inertia::render('Admin/SubjectGrades', [
            'staff'       => $staff,
            'section'     => $section,
            'subject'     => $subject,
            'assessments' => $assessments,
            'students'    => $students,
            'grades'      => $grades,
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

        $groups = Group::where('staff_id', $id)
            ->with(['grade', 'subject', 'students'])
            ->get();

        $mergedItems = collect();

        // Add Assignments
        foreach ($assignments as $a) {
            $mergedItems->push([
                'id' => $a->id,
                'type' => 'section',
                'section_id' => $a->section_id,
                'subject_id' => $a->subject_id,
                'section_name' => $a->section->label_ar ?? ($a->section->grade->number . $a->section->letter),
                'subject_name' => (string)$a->subject->name_ar,
                'subject_name_ar' => (string)$a->subject->name_ar,
                'subject_name_en' => !empty($a->subject->name_en) ? (string)$a->subject->name_en : (string)$a->subject->name_ar,
                'subject' => $a->subject,
                'section' => $a->section,
            ]);
        }

        // Add Groups
        foreach ($groups as $g) {
            $mergedItems->push([
                'id' => $g->id,
                'type' => 'group',
                'section_id' => null,
                'group_id' => $g->id,
                'subject_id' => $g->subject_id,
                'section_name' => $g->name_ar . ' (مجموعة)',
                'subject_name' => (string)$g->subject->name_ar,
                'subject_name_ar' => (string)$g->subject->name_ar,
                'subject_name_en' => !empty($g->subject->name_en) ? (string)$g->subject->name_en : (string)$g->subject->name_ar,
                'subject' => $g->subject,
                'group' => $g,
            ]);
        }

        $reportData = $mergedItems->map(function($item) use ($id) {
            $assessments = \App\Models\Assessment::where('subject_id', $item['subject_id']);
            
            if ($item['type'] === 'group') {
                $assessments->where('group_id', $item['group_id']);
                $students = $item['group']->students()->where('is_active', true)->get();
            } else {
                $assessments->where('staff_id', $id)->where('section_id', $item['section_id']);
                
                $electiveStudentIds = DB::table('elective_students')
                    ->where('assignment_id', $item['id'])
                    ->pluck('student_id')
                    ->toArray();

                $studentQuery = Student::where('section_id', $item['section_id'])
                    ->where('is_active', true);

                if (!empty($electiveStudentIds)) {
                    $studentQuery->whereIn('id', $electiveStudentIds);
                }
                $students = $studentQuery->orderBy('name_ar')->get();
            }

            $assessmentsList = $assessments->get();
            $grades = StudentGrade::whereIn('assessment_id', $assessmentsList->pluck('id'))->get();

            // Calculate Success Rate
            $totalStudents = $students->count();
            $passedCount = 0;
            
            if ($totalStudents > 0 && $assessmentsList->count() > 0) {
                foreach ($students as $student) {
                    $studentTotal = $grades->where('student_id', $student->id)->sum('score');
                    $fullTotal = $assessmentsList->sum('full_mark');
                    if ($fullTotal > 0 && ($studentTotal / $fullTotal) >= 0.5) {
                        $passedCount++;
                    }
                }
            }

            $successRate = $totalStudents > 0 ? min(round(($passedCount / $totalStudents) * 100), 100) : 0;
            $avgScore = 0;
            if ($totalStudents > 0 && $assessmentsList->count() > 0) {
                $actualSum = $grades->sum('score');
                $possibleSum = $totalStudents * $assessmentsList->sum('full_mark');
                $avgScore = $possibleSum > 0 ? min(round(($actualSum / $possibleSum) * 100), 100) : 0;
            }

            return [
                'id' => $item['id'],
                'type' => $item['type'],
                'section_id' => $item['section_id'],
                'group_id' => $item['group_id'] ?? null,
                'subject_id' => $item['subject_id'],
                'section_name' => $item['section_name'],
                'subject_name' => $item['subject_name'],
                'subject_name_ar' => $item['subject_name_ar'],
                'subject_name_en' => $item['subject_name_en'],
                'subject' => $item['subject'],
                'assessments' => $assessmentsList,
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

    public function viewStudentResults($id)
    {
        $student = Student::with(['grade', 'section'])->findOrFail($id);
        
        $results = \App\Models\StudentResultView::forStudent($id)
            ->orderBy('display_order')
            ->get();

        // جلب المجموعات المسجل فيها الطالب
        $groups = \App\Models\Group::whereHas('students', function($q) use ($id) {
                $q->where('students.id', $id);
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

        session(['parent_student_id' => $id]);

        return Inertia::render('Parent/Results', [
            'student' => $student,
            'results' => $results,
            'groups'  => $groups,
            'isAdminView' => true
        ]);
    }

    /**
     * إضافة مجموعة جديدة
     */
    public function storeGroup(Request $request)
    {
        $request->validate([
            'name_ar'     => 'required|string|max:100',
            'name_en'     => 'nullable|string|max:100',
            'staff_id'    => 'required|exists:staff,id',
            'subject_id'  => 'required|exists:subjects,id',
            'grade_id'    => 'required|exists:grades,id',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $group = Group::create([
            'id'         => (string) Str::uuid(),
            'name_ar'    => $request->name_ar,
            'name_en'    => $request->name_en ?? $request->name_ar,
            'staff_id'   => $request->staff_id,
            'subject_id' => $request->subject_id,
            'grade_id'   => $request->grade_id,
        ]);

        if ($request->student_ids && count($request->student_ids) > 0) {
            $group->students()->sync($request->student_ids);
        }

        return redirect()->back();
    }

    /**
     * تعديل مجموعة
     */
    public function updateGroup(Request $request, $id)
    {
        $request->validate([
            'name_ar'     => 'required|string|max:100',
            'name_en'     => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'staff_id'    => 'required|exists:staff,id',
            'subject_id'  => 'required|exists:subjects,id',
            'grade_id'    => 'required|exists:grades,id',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $group = Group::findOrFail($id);
        $group->update([
            'name_ar'     => $request->name_ar,
            'name_en'     => $request->name_en ?? $request->name_ar,
            'description' => $request->description,
            'staff_id'    => $request->staff_id,
            'subject_id'  => $request->subject_id,
            'grade_id'    => $request->grade_id,
        ]);

        if ($request->has('student_ids')) {
            $group->students()->sync($request->student_ids ?? []);
        }

        return redirect()->back();
    }

    /**
     * حذف مجموعة
     */
    public function deleteGroup($id)
    {
        $group = Group::findOrFail($id);
        $group->students()->detach();
        $group->delete();

        return redirect()->back();
    }
}
