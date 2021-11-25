<?php

namespace App\Http\Controllers\Service;

use App\County;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommonsController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    }

    public function getCounties()
    {

        try {
            return County::all();
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting counties: ' . $ex->getMessage()], 500);
        }
    }

    public function getUserId()
    {

        try {
            $user = Auth::user();
            $userId = $user->id;
            return ['user_id' => $userId];
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting counties: ' . $ex->getMessage()], 500);
        }
    }
}
