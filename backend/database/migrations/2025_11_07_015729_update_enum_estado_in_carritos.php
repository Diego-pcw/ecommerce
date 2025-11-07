<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('carritos', function (Blueprint $table) {
            DB::statement("
        ALTER TABLE carritos 
        MODIFY COLUMN estado 
        ENUM('activo', 'convertido', 'abandonado', 'fusionado') 
        DEFAULT 'activo';
    ");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carritos', function (Blueprint $table) {
            DB::statement("
        ALTER TABLE carritos 
        MODIFY COLUMN estado 
        ENUM('activo', 'convertido', 'abandonado') 
        DEFAULT 'activo';
    ");
        });
    }
};
