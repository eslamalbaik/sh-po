<?php

$id = 'T572703';
$num = '572703';
$target = '0c2a12af2f768608b3b7ef8b864db3045088e51e61aaf86005bd5527d9db53fa';

echo "Searching for DECRYPTION pattern...\n";

$keys = ['MZS@Staff2026', '2026', 'MZS@2026', 'pMYBNt0ymIADWEQ3p423bvmUULrn34Lwf231MwPhVuI='];

foreach ($keys as $key) {
    // Try AES decryption (if it's hex-encoded ciphertext)
    $bin = hex2bin($target);
    if ($bin) {
        $dec = @openssl_decrypt($bin, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, str_repeat("\0", 16));
        if ($dec && preg_match('/^[a-zA-Z0-9!@#%^&*()]+$/', $dec)) {
            echo "  AES MATCH with key $key: $dec\n";
        }
    }
}

// Try XOR / Simple ciphers
function xor_string($str, $key) {
    $out = '';
    for($i = 0; $i < strlen($str); $i++) {
        $out .= $str[$i] ^ $key[$i % strlen($key)];
    }
    return $out;
}

echo "Search finished.\n";
