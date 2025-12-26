# Installation

Before using Mctools, ensure that your Pterodactyl Panel Version is v1.11x.

1. Open the `pterodactyl` folder in the Mctools addon directory, where you'll find three directories: `app`, `database` and `resources`. Please upload these directories to your Pterodactyl directory (commonly located at `/var/www/pterodactyl`).

2. Open the file `resources/scripts/routers/routes.ts`

- Find the code:

```js
import ServerActivityLogContainer from "@/components/server/ServerActivityLogContainer";
```

- Add this code below it:

```js
import MctoolsContainer from "@/components/server/mctools/MctoolsContainer";
```

- Find this code:

```js
        {
            path: '/settings',
            permission: ['settings.*', 'file.sftp'],
            name: 'Settings',
            component: SettingsContainer,
        },
```

- Add this code below it:

```js

        {
            path: '/mctools',
            permission: 'file.*',
            name: 'Mctools',
            component: MctoolsContainer,
        },
```

3. Open the file `routes/api-client.php`

- Find this code:

```php
    Route::post('/command', [Client\Servers\CommandController::class, 'index']);
    Route::post('/power', [Client\Servers\PowerController::class, 'index']);
```

- Add this code below:

```php

    Route::group(['prefix' => '/mctools'], function () {
        Route::get('/', [\Pterodactyl\Http\Controllers\Api\Client\Servers\MctoolsController::class, 'index']);
        Route::get('/versions', [\Pterodactyl\Http\Controllers\Api\Client\Servers\MctoolsController::class, 'versions']);
        Route::post('/install', [\Pterodactyl\Http\Controllers\Api\Client\Servers\MctoolsController::class, 'install']);
    });
```

4. Open the file `routes/admin.php`

- Put this code in the last line:

```php

Route::group(['prefix' => 'mctools'], function () {
    Route::get('/', [\Pterodactyl\Http\Controllers\Admin\MctoolsSettingsController::class, 'index'])->name('admin.mctools');
    Route::post('/', [\Pterodactyl\Http\Controllers\Admin\MctoolsSettingsController::class, 'update'])->name('admin.mctools.update');
});
```

5. Open the file `resources/views/layouts/admin.blade.php`

- Find this code:

```php
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
                            <a href="{{ route('admin.nests') }}">
                                <i class="fa fa-th-large"></i> <span>Nests</span>
                            </a>
                        </li>
```

- Add this code below:

```php
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mctools') ?: 'active' }}">
                            <a href="{{ route('admin.mctools') }}">
                                <i class="fa fa-gears"></i> <span>Mctools Settings</span>
                            </a>
                        </li>
```

6. Run these commands in your pterodactyl directory:

   1. `php artisan route:clear`
   2. `php artisan cache:clear`
   3. `php artisan migrate --force`
   4. `chmod -R 777 /var/www/pterodactyl`

7. Build the Panel:

```bash
npm run build
```

8. **Set up CurseForge API**: To use CurseForge content, you need an API key. Obtain one from the [CurseForge Console](https://console.curseforge.com), then enter it in the Admin settings under **Mctools Settings**.
