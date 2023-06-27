<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PTAdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

        $this->middleware('auth:admin');
    }

    public function ptShipment()
    {
        return view('user.pt.shipment.pt_shipment');
    }
    public function lots()
    {
        return view('user.pt.lots.index');
    }
    public function lotDetail()
    {
        return view('user.pt.lots.lot_detail');
    }
    public function panels()
    {
        return view('user.pt.panels.index');
    }
    public function panelDetail()
    {
        return view('user.pt.panels.panel_detail');
    }

    public function editShipment()
    {
        return view('user.pt.shipment.edit_shipment');
    }

    public function listReadiness()
    {
        return view('user.pt.readiness.list_readiness');
    }

    public function addReadiness()
    {
        return view('user.pt.readiness.add_readiness');
    }

    public function editReadiness()
    {
        return view('user.pt.readiness.edit_readiness');
    }

    public function getReadinessResponse()
    {
        return view('user.pt.readiness.readiness_responses');
    }

    public function getShipmentResponse()
    {
        return view('user.pt.shipment.pt_responses_list');
    }

    public function getShipmentResponseForm()
    {
        return view('user.pt.shipment.pt_response_form');
    }

    public function getShipmentReportResponse()
    {
        return view('user.pt.reports.pt_responses_list');
    }

    public function getShipmentReportList()
    {
        return view('user.pt.reports.pt_shipment_list');
    }

    public function getShipmentResponsePerformance()
    {
        return view('user.pt.reports.pt_perfornance_report');
    }
}
