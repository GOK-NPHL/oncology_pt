<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddShipmentIdColumnLotpanelModel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema :: table('lot_panels', function (Blueprint $table) {
            $table -> integer('shipment_id') -> unsigned() -> nullable();
            // $table -> foreign('shipment_id') -> references('id') -> on('pt_shipements') -> onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema :: table('lot_panels', function (Blueprint $table) {
            // $table -> dropForeign('lot_panels_shipment_id_foreign');
            $table -> dropColumn('shipment_id');
        });
    }
}
