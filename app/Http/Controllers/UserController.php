<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser(Request $request)
    {
        $user = $request->user();

        if ($user) {
            // User is authenticated, return user data
            return response()->json($user);
        } else {
            // User is not authenticated, return unauthorized response
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }
}
