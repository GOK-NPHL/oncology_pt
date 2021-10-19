<?php

namespace App\Http\Controllers;

use App\Platform;
use App\User;
use Exception;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    public function getPlatforms(Request $request)
    {
        try {
            return Platform::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch platform: ' . $ex->getMessage()], 500);
        }
    }

    public function createPlatform(Request $request)
    {

        try {
            Platform::create([
                'name' => $request->platform['platform_name'],
                'active' => $request->platform['is_active'],
            ]);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save platform: ' . $ex->getMessage()], 500);
        }
    }

    public function editPlatform(Request $request)
    {

        try {
            $platform = Platform::find($request->platform['id']);
            $platform->name = $request->platform['platform_name'];
            $platform->active = $request->platform['is_active'];
            $platform->save();

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update platform: ' . $ex->getMessage()], 500);
        }
    }

    public function getLabPlatformById(Request $request)
    {
        try {
            return Platform::find($request->id);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch platform: ' . $ex->getMessage()], 500);
        }
    }
}
