<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Pterodactyl\Models\MctoolsConfig;
use Pterodactyl\Http\Controllers\Controller;
use Prologue\Alerts\AlertsMessageBag;

class MctoolsSettingsController extends Controller
{
    public function __construct(private AlertsMessageBag $alerts)
    {
    }

    public function index()
    {
        $config = MctoolsConfig::first() ?? new MctoolsConfig();
        return view('admin.mctools.index', ['config' => $config]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'curseforge_api_key' => 'nullable|string',
        ]);

        $config = MctoolsConfig::first() ?? new MctoolsConfig();
        $config->curseforge_api_key = $request->input('curseforge_api_key');
        $config->save();

        $this->alerts->success('Mctools settings have been updated.')->flash();

        return redirect()->route('admin.mctools');
    }
}
