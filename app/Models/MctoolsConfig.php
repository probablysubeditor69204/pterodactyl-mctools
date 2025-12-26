<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Model;

class MctoolsConfig extends Model
{
    protected $table = 'mctools_config';

    protected $fillable = [
        'curseforge_api_key',
    ];

    public $timestamps = true;
}
