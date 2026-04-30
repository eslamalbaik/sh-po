<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('query');
        if (!$query || strlen($query) < 2) {
            return response()->json([
                'teachers' => [],
                'students' => [],
                'subjects' => []
            ]);
        }

        // Search Teachers
        $teachers = Staff::where(function($q) use ($query) {
            $q->where('name_ar', 'LIKE', "%{$query}%")
              ->orWhere('name_en', 'LIKE', "%{$query}%")
              ->orWhere('staff_no', 'LIKE', "%{$query}%")
              ->orWhereHas('user', function($uq) use ($query) {
                  $uq->where('email', 'LIKE', "%{$query}%");
              });
        })->with('user')->limit(10)->get();

        // Search Students
        $students = Student::where(function($q) use ($query) {
            $q->where('name_ar', 'LIKE', "%{$query}%")
              ->orWhere('name_en', 'LIKE', "%{$query}%")
              ->orWhere('student_no', 'LIKE', "%{$query}%");
        })->limit(10)->get();

        // Search Subjects
        $subjects = Subject::where(function($q) use ($query) {
            $q->where('name_ar', 'LIKE', "%{$query}%")
              ->orWhere('name_en', 'LIKE', "%{$query}%");
        })->limit(10)->get();

        return response()->json([
            'teachers' => $teachers,
            'students' => $students,
            'subjects' => $subjects
        ]);
    }
}
