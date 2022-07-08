<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\ResourceFiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Authentication passed...
            return redirect()->intended('dashboard');
        }
    }


    public function downloadFile($id)
    {
        $file = ResourceFiles::find($id);
        if(!$file){
            return redirect('/');
        }
        if($file->is_public == 0){
            if(Auth::check()){
                return response()->download($file->path);
            }
            return redirect('/');
        }
        return response()->download($file->path);
    }

}
