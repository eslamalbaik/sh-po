<?php

$id = 'T572703';
$num = '572703';
$target = '0c2a12af2f768608b3b7ef8b864db3045088e51e61aaf86005bd5527d9db53fa';

$combinations = [
    'PLAIN_ID' => $id,
    'PLAIN_NUM' => $num,
    'SHA256_ID' => hash('sha256', $id),
    'SHA256_NUM' => hash('sha256', $num),
    'SHA256_ID_NUM' => hash('sha256', $id . $num),
    'SHA256_NUM_ID' => hash('sha256', $num . $id),
    'SHA256_ID_LOWER' => hash('sha256', strtolower($id)),
    'SHA256_NUM_LOWER' => hash('sha256', strtolower($num)),
    'MD5_ID' => md5($id),
    'MD5_NUM' => md5($num),
    'SHA1_ID' => sha1($id),
    'SHA1_NUM' => sha1($num),
    'SHA256_ID_SALT_MZS' => hash('sha256', $id . 'MZS@Staff2026'),
    'SHA256_NUM_SALT_MZS' => hash('sha256', $num . 'MZS@Staff2026'),
    'SHA256_ID_SALT_2026' => hash('sha256', $id . '2026'),
    'SHA256_NUM_SALT_2026' => hash('sha256', $num . '2026'),
    'SHA256_ID_SALT_PRE' => hash('sha256', 'MZS@Staff2026' . $id),
    'SHA256_NUM_SALT_PRE' => hash('sha256', 'MZS@Staff2026' . $num),
];

echo "Target Hash: $target\n\n";

foreach ($combinations as $name => $val) {
    echo str_pad($name, 25) . ": " . $val;
    if ($val === $target) {
        echo "  [MATCH!!!]";
    }
    echo "\n";
}
