<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPanelidColumnPtsampleModel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pt_samples', function (Blueprint $table) {
            $table->unsignedBigInteger('panel_id')->after('ptshipment_id');
            // $table->foreign('panel_id')->references('id')->on('panels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pt_samples', function (Blueprint $table) {
            $table->dropColumn('panel_id');
        });
    }
}
