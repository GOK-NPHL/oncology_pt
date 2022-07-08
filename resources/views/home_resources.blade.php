<!doctype html>
<html style="height: 100%;" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <link rel="shortcut icon" href="{{ asset('images/favicon/favicon.ico') }}">
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body style="background-image: url('{{asset('images/pt.png')}}');
            background-repeat: no-repeat;
            background-size: cover; height: 100%; overflow: hidden;">
    <div>

        <main class="py-4">



            <div class="container">
                <nav class="navbar navbar-expand-lg navbar static-top">
                    <div class="container">
                        <!-- <a class="navbar-brand" href="#">
                            <img src="http://placehold.it/150x50?text=Logo" alt="">
                        </a> -->


                        <a style="color: #FFF;" class="navbar-brand" href="/" title="{{ config('app.name', 'Laravel') }}">

                            <div>
                                <div class="float-left">
                                    <img src="{{ asset('images/moh-logo.png') }}" height="60" width="60" />
                                </div>
                                <div class="float-right" style="font-size:0.8em;margin-left: 10px;">
                                    Ministry of health<br>
                                    National Public Health Laboratories<br>
                                    oncology
                                </div>
                            </div>
                        </a>



                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarResponsive">
                            <ul class="navbar-nav ml-auto">
                                <li style="background-color: purple;" class="nav-item active">
                                    <a style="color: white;" class="nav-link" href="/">About Us
                                        <span class="sr-only">(current)</span>
                                    </a>
                                </li>
                                <li style="background-color: purple; color: white;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="{{route('publicResources')}}">Library</a>
                                </li>

                                <li style="background-color: purple;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="/">Contact Us</a>
                                </li>
                                <li style="background-color: purple; color: white;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="{{ route('participant-login') }}">Log in</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div style="width: 100%; color: black; background: white; padding: 11px; border-radius: 4px" class="text-center">
                    <h1>Resources &amp; Files</h1>
                    @if( isset($files) && count($files) > 0 )
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table table-condensed">
                                <thead>
                                    <tr>
                                        <th>NAME</th>
                                        <th>SIZE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($files as $file)
                                    <tr>
                                        <td>
                                            <!-- <a href="{{'/api/resources/files/download/'.$file->id}}" target="_blank" download="{{$file->name}}">{{ $file->name }}</a> -->
                                            <a href="{{ url('/resources/download_file/'.$file->id) }}" download="{!! $file->name !!}">{!! $file->name !!}</a>
                                        </td>
                                        <td>{{ number_format((float)$file->size/1000000, 2, '.', '') }}MB</td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                    @endif
                </div>



            </div>
        </main>




    </div>
    <style>
        #footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 60px;
            /* Height of the footer */
            /* background: #6cf; */
        }

        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            /* background-color: #333333; */
        }

        li {
            float: left;
        }

        li a {
            display: block;
            color: white;
            text-align: center;
            padding: 16px;
            text-decoration: none;
        }

        li a:hover {
            background-color: #111111;
            color: white;
        }
    </style>
    <footer class="text-center" id="footer">

        <div class="row d-flex justify-content-center">
            <!--Grid column-->
            <div class="col-sm-12">

                <ul class="d-flex justify-content-center">
                    <li><a href="/">Home |</a></li>
                    <li><a href="/">About Us |</a></li>
                    <li><a href="/">Resources |</a></li>
                    <li><a href="/">FAQ |</a></li>
                    <li><a href="{{ route('admin-login') }}">Admin Login |</a></li>
                    <li><a href="{{route('publicResources')}}">NPHL Help Desk |</a></li>
                    <li><a href="/">2020 © National Public Health Laboratory</a></li>
                </ul>
            </div>
            <!--Grid column-->
        </div>

    </footer>
</body>

</html>