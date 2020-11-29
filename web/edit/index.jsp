<%--
  Created by IntelliJ IDEA.
  User: danie
  Date: 11/22/2020
  Time: 1:11 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>576 Final Project Login</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

    <!-- Link to your css file -->
    <link rel="stylesheet" href="/css/fonts.css">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/editorStyle.css">
    <style>
        .login-container {
            background-color: #273848;
            position: relative;
            padding: 25px;
            margin: auto;
            margin-top: 50px;
            border: 6px double #986f31;
            border-bottom-left-radius: 25px;
            z-index: 99;
            display: inline-block;
        }
    </style>
</head>
<body>
    <%
        String userID = (String)session.getAttribute("userID");

        if(userID != null) {
            response.sendRedirect(request.getContextPath() + "/edit.jsp");
        }
    %>
    <div class="container-fluid">
        <div class="full-screen gradient"></div>

        <div class="row col-12 ">
            <div class="login-container color-white">
                <h1 class="ironick">Login</h1>
                <form action="${pageContext.request.contextPath}/loginRequest" method="post">
                    <label for="userID">Username:</label><br>
                    <input type="text" id="userID" name="userID" required><br>
                    <label for="password">Password:</label><br>
                    <input type="password" id="password" name="password" required><br><br>
                    <input type="submit" value="Submit">
                </form>
            </div>
        </div>
    </div>
</body>
</html>
