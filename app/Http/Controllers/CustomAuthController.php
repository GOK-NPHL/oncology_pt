<?php

namespace App\Http\Controllers;

use App\ResourceFiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use Auth;
use Hash;
use Session;
use App\User;
use Facade\FlareClient\View;
use Illuminate\Contracts\Session\Session as SessionSession;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session as FacadesSession;

class CustomAuthController extends Controller

{




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

    public function index()
    {   
        return view('home_page');
    }
    public function publicResources()
    {   
        $files = ResourceFiles::where('is_public', 1)->get();
        return view('home_resources', compact('files'));
    }

    public function getParticipantLoginPage()
    {
        return view('auth.participant_login');
    }

    public function doLogin(Request $request)
    {
        // $request->validate([
        //     'email' => 'required',
        //     'password' => 'required',
        // ]);
        // Log::info($request);
        // $credentials = $request->only('email', 'password');
        // if (Auth::attempt($credentials)) {
        //     return redirect()->route('participant-home');
        // } else {
        //     return Redirect::back()->withErrors(['Email or Password incorrect']);
        // }

        // return redirect()->route('login')->withSuccess('Login details are not valid');


        $request->validate([
            'email' => 'required',
            'password' => 'required',

        ]);

        $credentials = $request->only('email', 'password');
        Log::info($credentials);
        if (Auth::attempt($credentials)) {
            Log::info($request);
            return redirect()->route('participant-home');
        } else {
            Log::info("refuse == >>");
            return Redirect::back()->withErrors(['Email or Password incorrect']);
        }
        // return redirect()->back()->withInput($request->only('email', 'remember'));

    }


    public function registration()
    {
        return view('auth.registration');
    }


    public function customRegistration(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $data = $request->all();
        $check = $this->create($data);

        return redirect("home")->withSuccess('You have signed-in');
    }


    public function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);
    }

    public function signOut()
    {
        Session::flush();
        Auth::logout();

        return Redirect()->route('index');
    }
}
