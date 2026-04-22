<?php

use App\Models\User;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Encryption\DecryptException;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🚀 Starting Database Sanitization...\n";

DB::transaction(function() {
    $users = User::all();
    echo "Processing " . $users->count() . " users...\n";

    foreach ($users as $user) {
        $oldPassword = $user->password;
        $newPassword = null;
        
        // 1. Reset Passwords based on Role
        if ($user->role === 'teacher') {
            // Extract numeric part from login_id (e.g., T572703 -> 572703)
            $newPassword = preg_replace('/[^0-9]/', '', $user->login_id);
        } elseif ($user->role === 'admin') {
            $newPassword = 'Admin@2026';
        } elseif ($user->role === 'parent') {
            // For parents, use their login_id as password if it's numeric/phone
            $newPassword = $user->login_id;
        }

        if ($newPassword) {
            // Force save with Bcrypt (The 'hashed' cast handles this if we assign)
            // But we use Hash::make to be 100% explicit
            $user->password = Hash::make($newPassword);
        }

        // 2. Decrypt potentially encrypted columns in User table
        foreach (['name', 'email'] as $col) {
            if ($user->$col) {
                try {
                    $user->$col = Crypt::decryptString($user->$col);
                } catch (DecryptException $e) {
                    // Not encrypted, leave as is
                }
            }
        }

        $user->save();
    }

    // 3. Process Staff table
    $staffList = Staff::all();
    echo "Processing " . $staffList->count() . " staff records...\n";
    foreach ($staffList as $staff) {
        foreach (['name_ar', 'name_en'] as $col) {
            if ($staff->$col) {
                try {
                    $staff->$col = Crypt::decryptString($staff->$col);
                } catch (DecryptException $e) {
                    // Not encrypted, leave as is
                }
            }
        }
        $staff->save();
    }
});

echo "✅ Sanitization Complete!\n";
echo "Teachers: Numeric ID | Admins: Admin@2026 | Others: Login ID\n";
