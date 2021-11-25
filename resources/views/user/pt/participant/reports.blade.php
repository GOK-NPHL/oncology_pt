@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_pt_component'))
    <div id="user_reports"></div>
    @endif

</div>
@endsection