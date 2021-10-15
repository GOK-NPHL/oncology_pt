<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PtSubmissionResult extends Model
{
    protected $fillable = [
        "ptsubmission_id",
        "sample_id",
        "hpv_16",
        "hpv_18",
        "hpv_other",
    ];
}
