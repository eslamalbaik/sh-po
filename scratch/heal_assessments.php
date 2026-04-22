<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Staff;
use App\Models\Assessment;
use Illuminate\Support\Facades\DB;

echo "🚀 Healing Assessment Links...\n";

// Map old staff IDs to New staff IDs
// We know from find_assessment.php that old IDs were UUIDs like '4bb995f2...'
// If they were migrated into the 'staff_id' column of assessments, we need to update them.

$assessments = DB::table('assessments')->get();
echo "Checking " . $assessments->count() . " assessments...\n";

$updatedCount = 0;

foreach ($assessments as $a) {
    // Check if the current staff_id exists in our new staff table
    $staffExists = Staff::where('id', $a->staff_id)->exists();
    
    if (!$staffExists) {
        // Find the staff member who SHOULD own this. 
        // In the migration, we might have mapping issues.
        // Let's look for a staff member using the staff_id as a hint (maybe it matches a user_id?)
        $correctStaff = Staff::where('user_id', $a->staff_id)->first();
        
        if ($correctStaff) {
            DB::table('assessments')->where('id', $a->id)->update(['staff_id' => $correctStaff->id]);
            $updatedCount++;
        }
    }
}

echo "✅ Linked $updatedCount assessments to correct staff members.\n";
