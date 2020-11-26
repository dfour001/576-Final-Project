<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>GEOG 576 Final Project - Editor</title>

    <link rel="shortcut icon" href="" type="image/x-icon">
    <link rel="apple-touch-icon" href="">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

    <!-- Link to your css file -->
    <link rel="stylesheet" href="css/fonts.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/editorStyle.css">
</head>

<body>
    <!-- Check if user is logged in to edit.  If not, forward to login page -->

    <%
        String userID = (String)session.getAttribute("userID");

        if (userID == null) { // User not logged in
            response.sendRedirect("edit/index.jsp");
        }
    %>




    <div class="container-fluid">
        <div class="full-screen gradient"></div>
        <div class="row">
            <div id="editMapContain" class="col-6 color-white">
                <div id="editMap"></div>
                <div id="mapNotification"></div>
                <div class="editMapButtonContain">
                    <div id="btnAddImage" class="editMapButton color-gold dubba">Add Image</div>
                    <div id="btnAddSlideshow" class="editMapButton color-gold dubba">Add Slideshow</div>
                </div>
            </div>

            <div id="editData" class="col-6 color-white">
                <div id="editCard" class="card">
                    <div class="card-header">
                        <h2 class="ironick color-gold">Time Machine Editor</h2>
                        <hr>
                        <h5 class="ironick color-white">Welcome, <%=userID%> <small>(<a href="edit/logout.jsp">logout</a>)</small></h5>
                    </div>
                    <h1 class="center color-gold fog04">6</h1>
                    <div class="card-body color-black">
                        <h4 class="card-title dubba">Image Markers</h4>
                        <hr>
                        <p>1992 - Old Warehouse Full of Boxes</p>
                        <h4 class="card-title dubba">Slideshows</h4>
                        <hr>
                        <p>[data]</p>
                    </div>
                    <h1 class="center color-gold fog04">7</h1>
                </div>
            </div>
        </div>


        <!-- Image Modal -->
        <div id="imgModal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                    <div class="full-modal gradient"></div>
                    <button type="button" class="close color-gold dubba mr-2" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <div class="img-content">
                        <div class="year-frame">
                            <p class="color-gold fog04">6</p>
                            <p id="imgYear" class="color-gold ironick">1965</p>
                            <p class="color-gold fog04">7</p>
                        </div>
                        <div class="picture-frame">
                            <h4 id="imgTitle" class="color-gold dubba">This is the image title!</h4>
                            <h1 class="color-gold fog04">1</h1>
                            <img id="imgImg" src="https://picsum.photos/500/300">
                            <p id="imgDescription" class="color-gold text-left">Ah, I'm...I'm fine. Thanks. (He turns and spots Doc. He heads over to him. Doc is smelling a flower that was given to him by Clara.) Doc. What are you doing? (stops sniffing) Oh, nothing...just out enjoying the morning air. It's really lovely here in the morning, don't you think? Yeah, it's lovely Doc. Listen, we gotta load the Delorean. We gotta get ready to roll alright...(he spots the tombstone from the picture) hey look at that, the tombstone.</p>
                            <p id="imgUserName" class="color-gold text-right mr-3">- CoolMuseum</p>
                            <button type="button" class="btn color-gold" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Edit Form in Modal -->
        <div id="editFormModal-Image" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="full-modal gradient"></div>
                    <button type="button" class="close color-gold dubba mr-2" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <div class="img-content">
                        <div class="year-frame">
                            <p class="color-gold fog04">6</p>
                            <p id="imgYear" class="color-gold ironick">Add Image Marker</p>
                            <p class="color-gold fog04">7</p>
                        </div>
                        <div class="picture-frame">
                            <br>
                            <h1 class="color-gold fog04">1</h1>
                            <div class="row">
                                <div class="col-md-6">
                                    <form class="form color-gold" action="TimeMachineEdit" method="post">
                                        <input type="hidden" name="op" value="insert-image">
                                        <input type="hidden" name="lat" id="imgLat">
                                        <input type="hidden" name="lng" id="imgLng">
                                        <label for="year">Year:</label><br>
                                        <input type="number" name="year" id="year" value="2020" class="full-width">
                                        <br>
                                        <label for="title">Marker Title:</label><br>
                                        <input type="text" name="title" id="title" class="full-width">
                                        <br>
                                        <label for="description">Description:</label><br>
                                        <textarea type="text" name="description" id="description" class="full-width"></textarea>
                                        <br><br>
                                        <label for="direction">Direction (Which direction was the photographer looking?):</label><br>
                                        <input type="text" class="dial" data-min="0" data-max="365" data-width="100" data-cursor=true data-step="1" data-thickness=.3 data-fgColor="#cd8e2f" value="1" id="direction" name="direction">
                                        <br><br>
                                        <label for="file">Load image file:</label><br>
                                        <input type="file" name="file" size="50" />
                                        <br><br>
                                        <input type="submit" class="btn color-gold" value="submit">
                                        <button type="button" class="btn color-gold" data-dismiss="modal">Cancel</button>
                                    </form>
                                </div>
                                <div class="col-md-6">
                                    <div id="editFormMap"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="editFormModal-Slideshow" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="full-modal gradient"></div>
                    <button type="button" class="close color-gold dubba mr-2" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <div class="img-content">
                        <div class="year-frame">
                            <p class="color-gold fog04">6</p>
                            <p id="imgYear" class="color-gold ironick">Add Slideshow Marker</p>
                            <p class="color-gold fog04">7</p>
                        </div>
                        <div class="picture-frame">
                            <br>
                            <h1 class="color-gold fog04">1</h1>
                            <div class="row">
                                <div class="col-md-12">
                                    <form class="form color-gold">
                                        <label for="title">Marker Title:</label><br>
                                        <input type="text" id="title" class="full-width">
                                        <br>
                                        <label for="description">Description:</label><br>
                                        <textarea type="text" id="description" class="full-width"></textarea>
                                        <br>
                                        <label for="direction">Folder Name <small>(Slideshow files must be loaded to this folder via FTP)</small> :</label><br>
                                        <input type="text" id="direction" class="full-width">
                                        <br><br>
                                        <input type="submit" class="btn color-gold">
                                        <button type="button" class="btn color-gold" data-dismiss="modal">Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
    </div>

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

    <!-- Leaflet -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="lib/markerRotate.js"></script>

    <!-- Custom JS -->
    <script src="js/editMap.js"></script>
    <script src="js/editor.js"></script>

    <!-- knob control -->
    <script src="lib/jquery.knob.js"></script>
    <script>
        $(function() {
            $(".dial").knob({
                'change': function(v) {
                    imgMapMarker.setRotationAngle(v);
                }
            });
        });
    </script>

    <!-- Show notification if one is sent from the servet and clear message from session object -->
    <% if (session.getAttribute("message") != null) {
        String msg = (String)session.getAttribute("message");
        session.setAttribute("message", null);
    %>
    <script type="text/javascript">
        map_notification("<%=msg%>");
    </script>
    <% } %>
</body></html>
