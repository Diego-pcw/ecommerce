<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoPromocion extends Model
{
    protected $table = 'producto_promocion';
    protected $fillable = ['producto_id', 'promocion_id'];
}
