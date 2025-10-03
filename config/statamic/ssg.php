<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Base URL
    |--------------------------------------------------------------------------
    |
    | The base URL of your production site. This is used to generate
    | absolute URLs in your static site.
    |
    */

    'base_url' => env('SSG_BASE_URL', env('APP_URL')),

    /*
    |--------------------------------------------------------------------------
    | Destination Directory
    |--------------------------------------------------------------------------
    |
    | The directory where your static site will be generated.
    | For Vercel deployment, this should be storage/app/static
    |
    */

    'destination' => storage_path('app/static'),

    /*
    |--------------------------------------------------------------------------
    | Paths to Generate
    |--------------------------------------------------------------------------
    |
    | Specify which paths should be generated. You can use wildcards.
    | By default, all pages will be generated.
    |
    */

    'urls' => [
        '/',
        '/blog',
        '/blog/*',
        '/projects',
        '/projects/*',
        '/about',
        '/contact',
        // Add any other routes you want to include
    ],

    /*
    |--------------------------------------------------------------------------
    | Files to Copy
    |--------------------------------------------------------------------------
    |
    | Files that should be copied to your static site destination.
    | Typically you'll want your CSS, JS, images, and other assets.
    |
    */

    'copy' => [
        public_path('build') => 'build',
        public_path('css') => 'css',
        public_path('js') => 'js',
        public_path('images') => 'images',
        public_path('assets') => 'assets',
        public_path('favicon.ico') => 'favicon.ico',
        public_path('robots.txt') => 'robots.txt',
        // Add other public files/directories as needed
    ],

    /*
    |--------------------------------------------------------------------------
    | Excluded URLs
    |--------------------------------------------------------------------------
    |
    | URLs that should be excluded from static generation.
    | Common exclusions: admin panels, API endpoints, etc.
    |
    */

    'exclude' => [
        '/cp',
        '/cp/*',
        '*/amp',
        '/api/*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Glide
    |--------------------------------------------------------------------------
    |
    | Whether to generate Glide images during build.
    | Set to true if you use Statamic's image manipulation.
    |
    */

    'glide' => true,

    /*
    |--------------------------------------------------------------------------
    | Workers
    |--------------------------------------------------------------------------
    |
    | Number of concurrent workers to use during generation.
    | More workers = faster builds (up to a point).
    |
    */

    'workers' => 4,

];
