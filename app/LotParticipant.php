<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LotParticipant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'lot_id',
        'participant_id',
    ];

    public function lot()
    {
        return $this->belongsTo('App\Lot', 'lot_id', 'id');
    }
    public function participant()
    {
        return $this->belongsTo('App\Laboratory', 'participant_id', 'id');
    }
}
