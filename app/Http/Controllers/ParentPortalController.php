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
        
        $results = StudentResultView::forStudent($studentId)
            ->orderBy('display_order')
            ->get();

        return Inertia::render('Parent/Results', [
            'student' => $student,
            'results' => $results
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
        
        $results = StudentResultView::forStudent($studentId)
            ->orderBy('display_order')
            ->get();

        return Inertia::render('Parent/Results', [
            'student' => $student,
            'results' => $results
        ]);
    }

    public function logout()
    {
        session()->forget('parent_student_id');
        return redirect()->route('parent.index');
    }
}
