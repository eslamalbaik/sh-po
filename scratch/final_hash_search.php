<?php

$id = 'T572703';
$num = '572703';
$target = '0c2a12af2f768608b3b7ef8b864db3045088e51e61aaf86005bd5527d9db53fa';

$salts = ['', 'MZS@2026', 'MZS@Staff2026', '2026', 'pMYBNt0ymIADWEQ3p423bvmUULrn34Lwf231MwPhVuI='];

echo "Final Search...\n";

foreach ([$num, $id] as $in) {
    echo "Trying: $in\n";
    foreach ($salts as $s) {
        $c = [
            'sha256(in+id)' => hash('sha256', $in . $id),
            'sha256(id+in)' => hash('sha256', $id . $in),
            'sha256(md5(in))' => hash('sha256', md5($in)),
            'sha256(md5(in+s))' => hash('sha256', md5($in . $s)),
            'sha256(md5(s+in))' => hash('sha256', md5($s . $in)),
            'sha256(in+md5(s))' => hash('sha256', $in . md5($s)),
            'sha256(s+md5(in))' => hash('sha256', $s . md5($in)),
            'sha256(md5(in)+id)' => hash('sha256', md5($in) . $id),
            'sha256(id+md5(in))' => hash('sha256', $id . md5($in)),
        ];
        
        foreach ($c as $name => $val) {
            if ($val === $target) echo "  MATCH found: $name (Salt: $s)\n";
        }
    }
}

echo "Search finished.\n";
