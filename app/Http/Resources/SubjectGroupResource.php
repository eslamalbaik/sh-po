<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Check if the underlying resource is a Group
        if ($this->resource instanceof \App\Models\Group) {
            return [
                'id' => $this->id,
                'type' => 'group',
                'name_ar' => $this->name_ar,
                'name_en' => $this->name_en ?? $this->name_ar,
                'description' => $this->description,
                'teacher_name_ar' => $this->teacher->name_ar ?? '',
                'teacher_name_en' => $this->teacher->name_en ?? $this->teacher->name_ar ?? '',
                'subject_id' => $this->subject_id,
                'subject_name_ar' => $this->subject->name_ar ?? '',
                'subject_name_en' => $this->subject->name_en ?? $this->subject->name_ar ?? '',
                'section_id' => null,
                'grade_id' => $this->grade_id,
                'grade_name' => $this->grade->number ?? '',
                'students_count' => $this->students ? $this->students->count() : 0,
                // Include full objects for frontend compatibility
                'subject' => $this->subject,
                'grade' => $this->grade,
                'teacher' => $this->teacher,
                'students' => $this->students,
            ];
        }

        // Check if the underlying resource is a TeacherAssignment
        if ($this->resource instanceof \App\Models\TeacherAssignment) {
            // Count students in this section who are active
            $studentsCount = \App\Models\Student::where('section_id', $this->section_id)
                ->where('is_active', true)
                ->count();

            // Check if there are elective students for this assignment
            $electiveStudentIds = \Illuminate\Support\Facades\DB::table('elective_students')
                ->where('assignment_id', $this->id)
                ->pluck('student_id')
                ->toArray();
                
            if (!empty($electiveStudentIds)) {
                $studentsCount = \App\Models\Student::whereIn('id', $electiveStudentIds)
                    ->where('is_active', true)
                    ->count();
            }

            return [
                'id' => $this->id,
                'type' => 'section',
                'name_ar' => $this->section->label_ar ?? (($this->section->grade->number ?? '') . ($this->section->letter ?? '')),
                'name_en' => $this->section->label_en ?? $this->section->label_ar ?? (($this->section->grade->number ?? '') . ($this->section->letter ?? '')),
                'description' => null,
                'teacher_name_ar' => $this->staff->name_ar ?? '',
                'teacher_name_en' => $this->staff->name_en ?? $this->staff->name_ar ?? '',
                'subject_id' => $this->subject_id,
                'subject_name_ar' => $this->subject->name_ar ?? '',
                'subject_name_en' => $this->subject->name_en ?? $this->subject->name_ar ?? '',
                'section_id' => $this->section_id,
                'grade_id' => $this->section->grade_id ?? null,
                'grade_name' => $this->section->grade->number ?? '',
                'students_count' => $studentsCount,
                // Include full objects for frontend compatibility
                'subject' => $this->subject,
                'section' => $this->section,
                'staff' => $this->staff,
            ];
        }

        return parent::toArray($request);
    }
}
