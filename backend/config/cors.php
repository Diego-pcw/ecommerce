<?php

return [
    'paths' => ['api/*', 'login', 'logout', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://ecommerce-frontend-three-steel.vercel.app',
        'https://mediumspringgreen-koala-465676.hostingersite.com',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ❌ YA NO USAMOS COOKIES → DESACTIVAR
    'supports_credentials' => false,
];
