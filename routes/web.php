<?php

use App\Http\Controllers\ParentPortalController;
use App\Http\Controllers\StaffPortalController;
use App\Http\Controllers\AdminPortalController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// بوابة ولي الأمر (Parent Portal)
Route::prefix('parent')->name('parent.')->group(function () {
    Route::get('/', [ParentPortalController::class, 'index'])->name('index');
    Route::post('/login', [ParentPortalController::class, 'login'])->name('login');
    Route::get('/results', [ParentPortalController::class, 'results'])->name('results');
    Route::get('/results-direct', [ParentPortalController::class, 'resultsDirect'])->name('results-direct');
    Route::post('/logout', [ParentPortalController::class, 'logout'])->name('logout');
});

// بوابة المعلم والإدارة (Staff Portal)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [StaffPortalController::class, 'dashboard'])->name('dashboard');
    Route::get('/admin/dashboard', [AdminPortalController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/get-grades', [StaffPortalController::class, 'getGrades'])->name('staff.get-grades');
    Route::post('/save-grade', [StaffPortalController::class, 'saveGrade'])->name('staff.save-grade');
    Route::post('/store-assessment', [StaffPortalController::class, 'storeAssessment'])->name('staff.store-assessment');
    Route::delete('/delete-assessment/{id}', [StaffPortalController::class, 'deleteAssessment'])->name('staff.delete-assessment');
    Route::post('/staff/change-password', [StaffPortalController::class, 'updatePassword'])->name('staff.change-password');
    Route::post('/staff/groups/{id}/students', [StaffPortalController::class, 'updateGroupStudents'])->name('staff.groups.update-students');
    Route::delete('/staff/groups/{id}', [StaffPortalController::class, 'deleteGroup'])->name('staff.groups.destroy');
    
    // Admin: Staff & Subject Management
    Route::post('/admin/staff', [AdminPortalController::class, 'storeStaff'])->name('admin.staff.store');
    Route::put('/admin/staff/{id}', [AdminPortalController::class, 'updateStaff'])->name('admin.staff.update');
    Route::delete('/admin/staff/{id}', [AdminPortalController::class, 'deleteStaff'])->name('admin.staff.destroy');
    
    Route::post('/admin/subjects', [AdminPortalController::class, 'storeSubject'])->name('admin.subjects.store');
    Route::put('/admin/subjects/{id}', [AdminPortalController::class, 'updateSubject'])->name('admin.subjects.update');
    Route::delete('/admin/subjects/{id}', [AdminPortalController::class, 'deleteSubject'])->name('admin.subjects.destroy');
    Route::post('/admin/reset-teacher-password', [AdminPortalController::class, 'resetTeacherPassword'])->name('admin.reset-password');
    Route::post('/admin/reset-my-password', [AdminPortalController::class, 'resetMyPassword'])->name('admin.reset-my-password');
    
    // View Subject Grades
    Route::get('/admin/subject/{staffId}/{sectionId}/{subjectId}', [AdminPortalController::class, 'viewSubjectGrades'])->name('admin.subject-grades');
    Route::get('/admin/teacher/{id}', [AdminPortalController::class, 'viewTeacherProfile'])->name('admin.teacher-profile');

    // Student Management
    Route::post('/admin/students', [AdminPortalController::class, 'storeStudent'])->name('admin.students.store');
    Route::post('/admin/students/{id}/transfer', [AdminPortalController::class, 'transferStudent'])->name('admin.students.transfer');
    Route::post('/admin/students/{id}/archive', [AdminPortalController::class, 'archiveStudent'])->name('admin.students.archive');
    Route::get('/admin/student/{id}/results', [AdminPortalController::class, 'viewStudentResults'])->name('admin.student-results');
    Route::get('/api/admin/students', [AdminPortalController::class, 'getStudentsAjax'])->name('api.admin.students');

    // Assignment Management
    Route::get('/api/admin/staff-assignments/{staffId}', [AdminPortalController::class, 'getStaffAssignmentsAjax'])->name('api.admin.staff-assignments');
    Route::post('/admin/assignments', [AdminPortalController::class, 'storeAssignment'])->name('admin.assignments.store');
    // Group Management
    Route::post('/admin/groups', [AdminPortalController::class, 'storeGroup'])->name('admin.groups.store');
    Route::put('/admin/groups/{id}', [AdminPortalController::class, 'updateGroup'])->name('admin.groups.update');
    Route::delete('/admin/groups/{id}', [AdminPortalController::class, 'deleteGroup'])->name('admin.groups.destroy');
});

Route::get('/staff', function () {
    return redirect()->route('login');
});

Route::get('/', function () {
    return redirect()->route('parent.index');
});

require __DIR__.'/auth.php';
