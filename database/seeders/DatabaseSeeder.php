<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      

   User::factory()->create([
            'firstname' => 'Jamaoui',
           'lastname' => 'Mouad',
            'email' => 'test@example.com',
            'password' => bcrypt('12345678')
        ]);

        Admin::factory()->create([
            'firstname' => 'Admin',
            'lastname' => 'Admin',
            'date_of_birth' => now()->subYears(30), // Example: 30 years ago
            'address' => \Faker\Factory::create()->address(),
            'phone' => substr(\Faker\Factory::create()->phoneNumber(), 10),
            'email' => 'admin@admin.admin',
            'password' => bcrypt('12122000')
        ]);
      
        Teacher::factory()->create([
            'firstname' => 'Teacher',
            'lastname' => 'Teacher',
            'date_of_birth' => now()->subYears(35), // Example: 35 years ago
            'address' => \Faker\Factory::create()->address(),
            'phone' => substr(\Faker\Factory::create()->phoneNumber(), 10),
            'email' => 'teacher@teacher.teacher',
            'password' => bcrypt('987456123')
        ]);
    }
}
