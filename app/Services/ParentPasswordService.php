<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class ParentPasswordService
{
    /**
     * مجموعة الأحرف: بدون 0/O/o/1/l/I لمنع الالتباس عند القراءة
     */
    private const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    private const LENGTH = 8;

    /**
     * توليد كلمة مرور عشوائية سهلة القراءة (8 أحرف).
     */
    public static function generate(): string
    {
        $alphabet = self::ALPHABET;
        $max = strlen($alphabet) - 1;
        $password = '';

        for ($i = 0; $i < self::LENGTH; $i++) {
            $password .= $alphabet[random_int(0, $max)];
        }

        return $password;
    }

    /**
     * توليد كلمة لطالب: تُخزَّن مشفّرة + مؤقتاً بنص صريح للطباعة.
     * تعيد الكلمة بنص صريح (للعرض المرة الواحدة).
     */
    public static function assignTo(Student $student): string
    {
        $plain = self::generate();

        // جولات أقل من الإعداد الافتراضي لتسريع التوليد الجماعي (التحقق يبقى عبر Hash::check)
        $rounds = max(4, min(12, (int) env('PARENT_PASSWORD_BCRYPT_ROUNDS', 8)));

        $student->forceFill([
            'parent_password_hash'           => Hash::make($plain, ['rounds' => $rounds]),
            'parent_password_plain_temp'     => $plain,
            'parent_password_generated_at'   => now(),
            'parent_password_distributed_at' => null,
        ])->save();

        return $plain;
    }

    /**
     * التحقق من كلمة المرور.
     */
    public static function verify(Student $student, string $password): bool
    {
        if (empty($student->parent_password_hash)) {
            return false;
        }

        return Hash::check($password, $student->parent_password_hash);
    }

    /**
     * بعد التأكيد بأن البطاقات وُزِّعت: امسح النص الصريح المؤقت.
     */
    public static function markDistributed(Student $student): void
    {
        $student->forceFill([
            'parent_password_plain_temp'     => null,
            'parent_password_distributed_at' => now(),
        ])->save();
    }
}
