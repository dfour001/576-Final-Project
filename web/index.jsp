<%--
  Created by IntelliJ IDEA.
  User: danie
  Date: 11/13/2020
  Time: 11:44 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>$Title$</title>
  </head>
  <body>
  <p id="lbl">:(</p>
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script>
    $.ajax({
        method: "POST",
        url: "TimeMachineView",
        dataType: "JSON",
        success: function(r) {
            console.log(r);
            console.log(r[0]);
            $('#lbl').html(r[0].status);
        },
        error: function(x,y,z) {
            console.log(':(');
            console.log(x);
            console.log(y);
            console.log(z);
        }
    });
  </script>
  </body>
</html>
