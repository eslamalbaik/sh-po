<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\StaffPortalController;
use Illuminate\Http\Request;

echo "🛰️ Simulating get-grades request for Section 47, Subject 2...\n";

$request = Request::create('/get-grades', 'POST', [
    'section_id' => 47,
    'subject_id' => 2
]);

$controller = new StaffPortalController();
$response = $controller->getGrades($request);

$data = json_decode($response->getContent(), true);

echo "Students returned: " . count($data['students']) . "\n";
echo "Assessments returned: " . count($data['assessments']) . "\n";
echo "Grades returned: " . count($data['grades']) . "\n";

if (count($data['grades']) > 0) {
    echo "Sample Grade:\n";
    print_r($data['grades'][0]);
}
