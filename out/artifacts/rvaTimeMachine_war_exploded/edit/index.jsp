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
    <title>Title</title>
</head>
<body>
    <%
        String userID = (String)session.getAttribute("userID");

        if(userID != null) {
            response.sendRedirect(request.getContextPath() + "/edit.jsp");
        }
    %>
    <h1>Login</h1>
    <form action="${pageContext.request.contextPath}/loginRequest" method="post">
        <label for="userID">Username:</label><br>
        <input type="text" id="userID" name="userID" required><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br>
        <input type="submit" value="Submit">
    </form>
</body>
</html>
