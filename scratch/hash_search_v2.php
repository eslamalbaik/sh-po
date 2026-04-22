<?php

$id = 'T572703';
$num = '572703';
$target = '0c2a12af2f768608b3b7ef8b864db3045088e51e61aaf86005bd5527d9db53fa';

$salts = ['', 'MZS@2026', 'MZS@Staff2026', '2026', 'changeme', 'salt', 'secret'];

echo "Searching for pattern...\n";

foreach ([$num, $id] as $in) {
    echo "Trying input: $in\n";
    
    // Standard hashes
    $algos = ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'ripemd160', 'whirlpool'];
    foreach ($algos as $algo) {
        if (hash($algo, $in) === $target) echo "  MATCH: $algo($in)\n";
        
        foreach ($salts as $s) {
            if (hash($algo, $in . $s) === $target) echo "  MATCH: $algo($in . $s)\n";
            if (hash($algo, $s . $in) === $target) echo "  MATCH: $algo($s . $in)\n";
            
            // With salt and a colon/separator
            if (hash($algo, $in . ':' . $s) === $target) echo "  MATCH: $algo($in : $s)\n";
            if (hash($algo, $s . ':' . $in) === $target) echo "  MATCH: $algo($s : $in)\n";
        }
    }
    
    // HMAC
    foreach (['sha256', 'md5', 'sha1'] as $algo) {
        foreach ($salts as $s) {
            if (hash_hmac($algo, $in, $s) === $target) echo "  MATCH: HMAC_$algo($in, $s)\n";
        }
    }
}

// Special case: Double hashing
if (hash('sha256', md5($num)) === $target) echo "  MATCH: SHA256(MD5($num))\n";
if (md5(hash('sha256', $num)) === $target) echo "  MATCH: MD5(SHA256($num))\n";

echo "Search finished.\n";
