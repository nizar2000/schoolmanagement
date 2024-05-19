<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Cookie;



use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

class SanctumController extends Controller
{
    public function csrfCookie(Request $request)
    {
        $token = csrf_token();

     $response = response('CSRF Token Set')->withCookie(Cookie::make('XSRF-TOKEN', $token));
     return $response;

    }
}
