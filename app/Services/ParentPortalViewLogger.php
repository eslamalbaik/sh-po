<?php

namespace App\Services;

use App\Models\ParentPortalView;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentPortalViewLogger
{
    public static function log(
        string $studentId,
        string $viewerType,
        string $action,
        ?Request $request = null
    ): void {
        $request = $request ?? request();

        $viewerUserId = null;
        $viewerStaffId = null;

        if ($viewerType === 'admin' && Auth::check()) {
            $viewerUserId = Auth::id();
            $staff = Staff::where('user_id', $viewerUserId)->first();
            $viewerStaffId = $staff?->id;
        }

        ParentPortalView::create([
            'student_id' => $studentId,
            'viewer_type' => $viewerType,
            'action' => $action,
            'viewer_user_id' => $viewerUserId,
            'viewer_staff_id' => $viewerStaffId,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 500),
        ]);
    }
}
