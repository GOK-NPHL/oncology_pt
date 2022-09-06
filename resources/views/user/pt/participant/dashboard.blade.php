@extends('layouts.participant')

<?php
    use Illuminate\Support\Facades\Gate;
?>
@section('content')
<div class="container-fluid">

    <?php if (Gate::allows('view_pt_component')) { ?>
        <div id="participant-pt-dashboard"></div>
    <?php } ?>

</div>
@endsection