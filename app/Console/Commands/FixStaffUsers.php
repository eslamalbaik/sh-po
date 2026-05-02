<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FixStaffUsers extends Command
{
    protected $signature = 'fix:staff-users';
    protected $description = 'Create or link users for all staff records to ensure data integrity';

    public function handle()
    {
        $staffRecords = Staff::all();
        $this->info("Checking " . $staffRecords->count() . " staff records...");

        foreach ($staffRecords as $staff) {
            $user = null;
            
            // 1. Try to find user by login_id (staff_no)
            if ($staff->staff_no) {
                $user = User::where('login_id', $staff->staff_no)->first();
            }

            // 2. If not found, try to find by existing user_id
            if (!$user && $staff->user_id) {
                $user = User::find($staff->user_id);
            }

            // 3. If still not found, create new user
            if (!$user) {
                $user = User::create([
                    'login_id' => $staff->staff_no,
                    'name' => $staff->name_ar,
                    'email' => ($staff->staff_no ?: Str::random(8)) . '@school.com',
                    'password' => Hash::make('123456'), // Default password
                    'role' => 'teacher',
                ]);
                $this->warn("Created new user for staff: {$staff->staff_no}");
            }

            // 4. Link staff to user
            if ($staff->user_id !== $user->id) {
                $staff->user_id = $user->id;
                $staff->save();
                $this->info("Linked staff {$staff->staff_no} to user {$user->id}");
            }
        }

        $this->info("Data integrity fix complete.");
    }
}
