<?php

/**
 * Add these routes to your Pterodactyl's routes/admin.php
 */

Route::group(['prefix' => 'mctools'], function () {
    Route::get('/', [\Pterodactyl\Http\Controllers\Admin\MctoolsSettingsController::class, 'index'])->name('admin.mctools');
    Route::post('/', [\Pterodactyl\Http\Controllers\Admin\MctoolsSettingsController::class, 'update'])->name('admin.mctools.update');
});
