@extends('layouts.admin')

@section('title')
    Mctools Settings
@endsection

@section('content-header')
    <h1>Mctools Settings<small>Configure the Minecraft content installer.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Mctools</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">General Settings</h3>
                </div>
                <form action="{{ route('admin.mctools.update') }}" method="POST">
                    <div class="box-body">
                        <div class="form-group">
                            <label for="curseforge_api_key" class="control-label">CurseForge API Key</label>
                            <div>
                                <input type="text" name="curseforge_api_key" value="{{ $config->curseforge_api_key }}" class="form-control" />
                                <p class="text-muted"><small>Required to fetch data and install content from CurseForge. You can get a key from the <a href="https://console.curseforge.com/" target="_blank">CurseForge Console</a>.</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" class="btn btn-primary pull-right">Save Settings</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
