<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'يجب قبول الحقل :attribute.',
    'active_url' => 'الحقل :attribute لا يمثل رابطًا صحيحًا.',
    'after' => 'يجب أن يكون الحقل :attribute تاريخًا لاحقًا للتاريخ :date.',
    'after_or_equal' => 'يجب أن يكون الحقل :attribute تاريخًا لاحقًا أو مطابقًا للتاريخ :date.',
    'alpha' => 'يجب أن يحتوي الحقل :attribute على أحرف فقط.',
    'alpha_dash' => 'يجب أن يحتوي الحقل :attribute على أحرف وأرقام وشرطات فقط.',
    'alpha_num' => 'يجب أن يحتوي الحقل :attribute على أحرف وأرقام فقط.',
    'array' => 'يجب أن يكون الحقل :attribute مصفوفة.',
    'before' => 'يجب أن يكون الحقل :attribute تاريخًا سابقًا للتاريخ :date.',
    'before_or_equal' => 'يجب أن يكون الحقل :attribute تاريخًا سابقًا أو مطابقًا للتاريخ :date.',
    'between' => [
        'numeric' => 'يجب أن تكون قيمة الحقل :attribute بين :min و :max.',
        'file' => 'يجب أن يكون حجم الملف :attribute بين :min و :max كيلوبايت.',
        'string' => 'يجب أن يكون عدد حروف الحقل :attribute بين :min و :max.',
        'array' => 'يجب أن يحتوي الحقل :attribute على عدد من العناصر بين :min و :max.',
    ],
    'boolean' => 'يجب أن تكون قيمة الحقل :attribute إما true أو false.',
    'confirmed' => 'حقل التأكيد غير مطابق للحقل :attribute.',
    'date' => 'الحقل :attribute ليس تاريخًا صحيحًا.',
    'date_equals' => 'يجب أن يكون الحقل :attribute تاريخًا مطابقًا للتاريخ :date.',
    'date_format' => 'الحقل :attribute لا يتوافق مع الشكل :format.',
    'different' => 'يجب أن يكون الحقلان :attribute و :other مختلفين.',
    'digits' => 'يجب أن يحتوي الحقل :attribute على :digits رقمًا.',
    'digits_between' => 'يجب أن يكون عدد أرقام الحقل :attribute بين :min و :max.',
    'dimensions' => 'الحقل :attribute يحتوي على أبعاد صورة غير صحيحة.',
    'distinct' => 'الحقل :attribute يحتوي على قيمة مكررة.',
    'email' => 'يجب أن يكون الحقل :attribute عنوان بريد إلكتروني صحيحًا.',
    'ends_with' => 'يجب أن ينتهي الحقل :attribute بأحد القيم التالية: :values.',
    'exists' => 'القيمة المختارة للحقل :attribute غير موجودة.',
    'file' => 'الحقل :attribute يجب أن يكون ملفًا.',
    'filled' => 'الحقل :attribute إلزامي.',
    'gt' => [
        'numeric' => 'يجب أن تكون قيمة الحقل :attribute أكبر من :value.',
        'file' => 'يجب أن يكون حجم الملف :attribute أكبر من :value كيلوبايت.',
        'string' => 'يجب أن يكون عدد حروف الحقل :attribute أكثر من :value.',
        'array' => 'يجب أن يحتوي الحقل :attribute على أكثر من :value عنصرًا.',
    ],
    'gte' => [
        'numeric' => 'يجب أن تكون قيمة الحقل :attribute أكبر من أو مساوية لـ :value.',
        'file' => 'يجب أن يكون حجم الملف :attribute أكبر من أو مساويًا لـ :value كيلوبايت.',
        'string' => 'يجب أن يكون عدد حروف الحقل :attribute أكثر من أو مساويًا لـ :value.',
        'array' => 'يجب أن يحتوي الحقل :attribute على :value عنصرًا أو أكثر.',
    ],
    'image' => 'يجب أن يكون الحقل :attribute صورة.',
    'in' => 'القيمة المختارة للحقل :attribute غير صحيحة.',
    'in_array' => 'الحقل :attribute غير موجود في :other.',
    'integer' => 'يجب أن يكون الحقل :attribute رقمًا صحيحًا.',
    'ip' => 'يجب أن يكون الحقل :attribute عنوان IP صحيحًا.',
    'ipv4' => 'يجب أن يكون الحقل :attribute عنوان IPv4 صحيحًا.',
    'ipv6' => 'يجب أن يكون الحقل :attribute عنوان IPv6 صحيحًا.',
    'json' => 'يجب أن يكون الحقل :attribute نصًا من نوع JSON صحيحًا.',
    'lt' => [
        'numeric' => 'يجب أن تكون قيمة الحقل :attribute أصغر من :value.',
        'file' => 'يجب أن يكون حجم الملف :attribute أصغر من :value كيلوبايت.',
        'string' => 'يجب أن يكون عدد حروف الحقل :attribute أقل من :value.',
        'array' => 'يجب أن يحتوي الحقل :attribute على أقل من :value عنصرًا.',
    ],
    'lte' => [
        'numeric' => 'يجب أن تكون قيمة الحقل :attribute أصغر من أو مساوية لـ :value.',
        'file' => 'يجب أن يكون حجم الملف :attribute أصغر من أو مساويًا لـ :value كيلوبايت.',
        'string' => 'يجب أن يكون عدد حروف الحقل :attribute أقل من أو مساويًا لـ :value.',
        'array' => 'يجب أن لا يحتوي الحقل :attribute على أكثر من :value عنصرًا.',
    ],
    'max' => [
        'numeric' => 'يجب أن لا تكون قيمة الحقل :attribute أكبر من :max.',
        'file' => 'يجب أن لا يكون حجم الملف :attribute أكبر من :max كيلوبايت.',
        'string' => 'يجب أن لا يتجاوز عدد حروف الحقل :attribute :max حرفًا.',
        'array' => 'يجب أن لا يحتوي الحقل :attribute على أكثر من :max عنصرًا.',
    ],
    'mimes' => 'يجب أن يكون الحقل :attribute ملفًا من نوع: :values.',
    'mimetypes' => 'يجب أن يكون الحقل :attribute ملفًا من نوع: :values.',
    'min' => [
        'numeric' => 'يجب أن تكون قيمة الحقل :attribute على الأقل :min.',
        'file' => 'يجب أن يكون حجم الملف :attribute على الأقل :min كيلوبايت.',
        'string' => 'يجب أن يحتوي الحقل :attribute على الأقل :min حرفًا.',
        'array' => 'يجب أن يحتوي الحقل :attribute على الأقل :min عنصرًا.',
    ],
    'not_in' => 'القيمة المختارة للحقل :attribute غير صحيحة.',
    'not_regex' => 'صيغة الحقل :attribute غير صحيحة.',
    'numeric' => 'يجب أن يكون الحقل :attribute رقمًا.',
    'password' => 'كلمة المرور غير صحيحة.',
    'present' => 'يجب أن يكون الحقل :attribute موجودًا.',
    'regex' => 'صيغة الحقل :attribute غير صحيحة.',
    'required' => 'الحقل :attribute إلزامي.',
    'required_if' => 'الحقل :attribute إلزامي عندما يكون :other مساويًا لـ :value.',
    'required_unless' => 'الحقل :attribute إلزامي ما لم يكن :other موجودًا في :values.',
    'required_with' => 'الحقل :attribute إلزامي عندما يكون :values موجودًا.',
    'required_with_all' => 'الحقل :attribute إلزامي عندما تكون القيم :values موجودة.',
    'required_without' => 'الحقل :attribute إلزامي عندما لا يكون :values موجودًا.',
    'required_without_all' => 'الحقل :attribute إلزامي عندما لا تكون أي من القيم :values موجودة.',
    'same' => 'يجب أن يتطابق الحقلان :attribute و :other.',
    'size' => [
        'numeric' => 'يجب أن تكون قيمة الحقل :attribute مساوية لـ :size.',
        'file' => 'يجب أن يكون حجم الملف :attribute :size كيلوبايت.',
        'string' => 'يجب أن يحتوي الحقل :attribute على :size حرفًا.',
        'array' => 'يجب أن يحتوي الحقل :attribute على :size عنصرًا.',
    ],
    'starts_with' => 'يجب أن يبدأ الحقل :attribute بأحد القيم التالية: :values.',
    'string' => 'يجب أن يكون الحقل :attribute نصًا.',
    'timezone' => 'يجب أن يكون الحقل :attribute نطاقًا زمنيًا صحيحًا.',
    'unique' => 'قيمة الحقل :attribute مستخدمة من قبل.',
    'uploaded' => 'فشل تحميل الملف :attribute.',
    'url' => 'رابط الحقل :attribute غير صحيح.',
    'uuid' => 'الحقل :attribute يجب أن يكون بصيغة UUID صحيحة.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'الاسم',
        'username' => 'اسم المستخدم',
        'email' => 'البريد الإلكتروني',
        'first_name' => 'الاسم الأول',
        'last_name' => 'اسم العائلة',
        'password' => 'كلمة المرور',
        'password_confirmation' => 'تأكيد كلمة المرور',
        'city' => 'المدينة',
        'country' => 'الدولة',
        'address' => 'العنوان',
        'phone' => 'الهاتف',
        'mobile' => 'الجوال',
        'age' => 'العمر',
        'sex' => 'الجنس',
        'gender' => 'النوع',
        'day' => 'اليوم',
        'month' => 'الشهر',
        'year' => 'السنة',
        'hour' => 'الساعة',
        'minute' => 'الدقيقة',
        'second' => 'الثانية',
        'title' => 'العنوان',
        'content' => 'المحتوى',
        'description' => 'الوصف',
        'excerpt' => 'المقتطف',
        'date' => 'التاريخ',
        'time' => 'الوقت',
        'available' => 'متاح',
        'size' => 'الحجم',
        'note_ar' => 'اسم التقييم',
        'full_mark' => 'الدرجة الكاملة',
        'score' => 'الدرجة',
        'student_no' => 'رقم الطالب',
        'staff_no' => 'رقم الموظف',
    ],

];
