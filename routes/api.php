<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SanctumController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
/*

|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::post('/login', [AuthController::class, 'login']);

//Route::get('/csrf-token', [SanctumController::class, 'csrfCookie']);

Route::middleware('auth:sanctum,admin,teacher')->get('/user', [UserController::class, 'getUser']);
Route::group(['middleware' => ['auth:sanctum']], function () {
    // private post routes
    Route::get('/user', [UserController::class, 'getUser']);
    // logout 
   // Route::post('/logout', [AuthController::class, 'logout']);
    });
    Route::middleware(['auth:sanctum', 'ability:student'])->prefix('student')->group(static function () {
    });
    
    Route::middleware(['auth:sanctum', 'ability:admin'])->prefix('admin')->group(static function () {
      Route::apiResources([
        'parents' => StudentParentController::class,
        'students' => StudentController::class,
      ]);
    });
    
    Route::middleware(['auth:sanctum', 'ability:teacher'])->prefix('teacher')->group(static function () {
    });
    require __DIR__ . '/auth.php';
