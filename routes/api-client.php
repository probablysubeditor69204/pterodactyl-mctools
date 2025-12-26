<?php

/**
 * Add these routes to your Pterodactyl's routes/api-client.php
 * Inside the Route::group([...], function () { ... }) block for servers.
 */

Route::group(['prefix' => '/mctools'], function () {
    Route::get('/', [\Pterodactyl\Http\Controllers\Api\Client\Servers\MctoolsController::class, 'index']);
    Route::get('/versions', [\Pterodactyl\Http\Controllers\Api\Client\Servers\MctoolsController::class, 'versions']);
    Route::post('/install', [\Pterodactyl\Http\Controllers\Api\Client\Servers\MctoolsController::class, 'install']);
});
