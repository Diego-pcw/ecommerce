<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;                      // <- importar el modelo
use Illuminate\Support\Facades\Hash;      // <- para encriptar la contraseña

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@demo.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'estado' => 'activo',
        ]);
    }
}