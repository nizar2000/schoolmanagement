<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\StudentResource;
use App\Models\User;
use DateTime;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
  public function index(): JsonResponse
  {
      $students = User::all();
      return response()->json(
          StudentResource::collection($students)
      )->header('Access-Control-Allow-Origin', '*')
       ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  }
  

    public function store(StoreUserRequest $request): JsonResponse
    {
        $formFields = $request->validated();
        $formFields['password'] = Hash::make($formFields['password']);
        $formFields['last_login_date'] = new DateTime();
        $student = User::create($formFields);
        $response = new StudentResource($student);
        return response()->json([
            'student' => $response,
            'message' => __('Student created successfully')
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function update(StoreUserRequest $request, User $student): JsonResponse
    {
        $formFields = $request->validated();
        $formFields['password'] = Hash::make($formFields['password']);
        $student->update($formFields);
        return response()->json([
            'student' => new StudentResource($student),
            'message' => __('Student updated successfully')
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function destroy(User $student): JsonResponse
    {
        $student->delete();

        return response()->json(
            new StudentResource($student)
        )->header('Access-Control-Allow-Origin', '*')
         ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
}
