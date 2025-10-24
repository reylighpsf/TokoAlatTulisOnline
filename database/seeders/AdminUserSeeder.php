<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if it doesn't exist
        if (!User::where('email', 'admin@printshop.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@printshop.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]);
        }

        // Create demo customer user if it doesn't exist
        if (!User::where('email', 'customer@example.com')->exists()) {
            User::create([
                'name' => 'Customer Demo',
                'email' => 'customer@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]);
        }
    }
}
