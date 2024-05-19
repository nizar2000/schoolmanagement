<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Validator; 


class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validation rules for user data
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors());
        }

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Generate an access token (replace with your token generation method)
        $token = $user->createToken('MyAppToken')->plainTextToken;

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
            'access_token' => $token,
        ]);
    }

    public function login(Request $request)
    {
        $rules = [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors());
        }

        // Attempt login using email and password
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            // User authenticated successfully
            $user = Auth::user();
            $token = $user->createToken('MyAppToken')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ]);
        }

        // Login failed
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }
    public function logout(Request $request){ 
        $user = Auth::user();
  
   // delete all tokens, essentially logging the user out
$user->tokens()->delete();

// delete the current token that was used for the request
$request->user()->currentAccessToken()->delete();
;
        return [
            'message' => 'user logged out'
        ];

    }
    
    
        /*  if (!$user) {
          return response()->json(['error' => 'not_logged_in'], 401); // Unauthorized
        }
      
        try {
          $user->token()->revoke();
          return response()->json(['success' => 'logout_success'], 200);
        } catch (\Exception $e) {
          Log::error('Logout failed: ' . $e->getMessage());
          return response()->json(['error' => 'token_revocation_failed'], 500);
        }
      }*/
      
  
}
